# AGENTS.md + LLM-facing docs delivery — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maximise the chance an AI coding agent in a consumer project uses `@kolirt/vue-modal` correctly, by shipping JSDoc on the public API, a de-styled copy of the docs, and an `AGENTS.md` index with a critical-rules checklist.

**Architecture:** Defence in depth across channels the agent actually reads. A build script de-styles `docs/content/**` into `dist/docs/**`; a hand-written root `AGENTS.md` carries inline critical rules + an index linking to those files; JSDoc on the source definition sites lands in `dist/index.d.ts`; README links to `AGENTS.md`. Delivery rides the existing publish workflow.

**Tech Stack:** Node ESM build script (no new deps), Vite + `vite-plugin-dts` (`rollupTypes: true`), pnpm workspace, GitHub Actions.

## Global Constraints

- Monorepo; the published package is `packages/core` (`@kolirt/vue-modal`, v2.3.0).
- No new runtime/dev dependencies. Build script is Node ESM, stdlib only.
- `vite-plugin-dts` rolls types up from definition sites — JSDoc must live at the **definition**, never only on the `src/index.ts` barrel re-export.
- Docs corpus: `docs/content` has **39** `.md` files. Ship **37**; exclude `index.md` and `1.playground.md` (user-confirmed: pure site chrome).
- De-styling must **never** modify anything inside a code fence, and must never strip angle-bracket tags (they are example code) — only leading frontmatter and `::`-MDC fences are touched.
- One `AGENTS.md`, authored at repo root, links use `./dist/docs/<path>`.
- `files` in `packages/core/package.json` becomes `["dist", "AGENTS.md"]`; `scripts/` must not be published.
- Do not commit. The user commits manually.
- Canonical docs source stays `docs/content`; `AGENTS.md` says so in its header.

Spec: `docs/superpowers/specs/2026-06-28-agents-md-llm-docs-design.md`.

---

### Task 1: De-styling build script + build wiring

**Files:**
- Create: `packages/core/scripts/prepare-llm-docs.mjs`
- Modify: `packages/core/package.json` (the `build` script line only)

**Interfaces:**
- Consumes: repo `docs/content/**/*.md` (read-only).
- Produces: `packages/core/dist/docs/**/*.md` — de-styled markdown mirroring the source tree, used by Task 3's index links and Task 4's pack verification.

- [ ] **Step 1: Create the script**

Create `packages/core/scripts/prepare-llm-docs.mjs` with exactly this content:

```js
// Generates de-styled, LLM-friendly copies of docs/content into dist/docs.
// Strips leading frontmatter and MDC container fences (::code-group/::callout/
// ::steps are unwrapped; every other ::component block is dropped with its
// body). Never touches anything inside a code fence. Stdlib only.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(scriptDir, '../../../docs/content')
const OUT = resolve(scriptDir, '../dist/docs')

const EXCLUDE = new Set(['index.md', '1.playground.md'])
const UNWRAP = new Set(['code-group', 'callout', 'steps'])

const OPEN_RE = /^(:{2,})\s*([A-Za-z][\w-]*)/ // `::name`, `::::u-page-hero{...}`
const CLOSE_RE = /^:{2,}\s*$/ // bare colons => container close
const FENCE_RE = /^\s*(```|~~~)/

function stripFrontmatter(lines) {
  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') return lines.slice(i + 1)
    }
  }
  return lines
}

function destyle(raw, relPath) {
  const lines = stripFrontmatter(raw.split('\n'))
  const out = []
  const stack = [] // { drop: boolean }
  let inFence = false
  for (const line of lines) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence
      if (!stack.some((s) => s.drop)) out.push(line)
      continue
    }
    if (!inFence) {
      const open = line.match(OPEN_RE)
      if (open) {
        stack.push({ drop: !UNWRAP.has(open[2]) })
        continue // never emit the opening fence line
      }
      if (CLOSE_RE.test(line) && stack.length > 0) {
        stack.pop()
        continue // never emit the closing fence line
      }
    }
    if (!stack.some((s) => s.drop)) out.push(line)
  }
  if (stack.length > 0) {
    console.warn(`[prepare-llm-docs] WARN unbalanced MDC fence in ${relPath}; emitting body unchanged`)
    return stripFrontmatter(raw.split('\n')).join('\n')
  }
  return out.join('\n')
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...(await walk(full)))
    else if (e.name.endsWith('.md')) files.push(full)
  }
  return files
}

if (!existsSync(SRC)) {
  console.error(`[prepare-llm-docs] source dir not found: ${SRC}`)
  process.exit(1)
}

const files = await walk(SRC)
let shipped = 0
for (const file of files) {
  const rel = relative(SRC, file)
  if (EXCLUDE.has(rel)) continue
  const raw = await readFile(file, 'utf8')
  const cleaned = destyle(raw, rel).replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '') + '\n'
  const dest = join(OUT, rel)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, cleaned, 'utf8')
  shipped++
}
console.log(`[prepare-llm-docs] wrote ${shipped} files to dist/docs`)
```

- [ ] **Step 2: Wire it into the build script**

In `packages/core/package.json`, change the `build` script:

```json
"build": "vite build && node scripts/prepare-llm-docs.mjs"
```

- [ ] **Step 3: Run the build**

Run: `pnpm --filter @kolirt/vue-modal build`
Expected: completes without error; final line `[prepare-llm-docs] wrote 37 files to dist/docs`; **no** `WARN unbalanced` lines.

- [ ] **Step 4: Verify de-style completeness**

Run: `grep -rEl '^:{2,}' packages/core/dist/docs ; echo "exit=$?"`
Expected: no file paths printed (grep finds no MDC fences left). Then:

Run: `for f in $(find packages/core/dist/docs -name '*.md'); do head -1 "$f" | grep -q '^---$' && echo "FRONTMATTER LEFT: $f"; done`
Expected: nothing printed (no leading frontmatter survived).

- [ ] **Step 5: Verify exclusions and code intact**

Run: `ls packages/core/dist/docs/index.md packages/core/dist/docs/1.playground.md 2>&1`
Expected: both report "No such file or directory".

Run: `grep -c 'ModalContent' packages/core/dist/docs/4.guide/05.styling-and-animations.md`
Expected: a number > 0 (example code inside fences preserved; this file's content/table survive).

Run: `grep -cE '^:{2,}' packages/core/dist/docs/2.getting-started/2.installation.md`
Expected: `0`. That file uses nested `::steps` wrapping `::code-group` in the source; open it and confirm the frontmatter block and both wrapper fences are gone while the install commands / code blocks remain.

- [ ] **Step 6: Commit** (only if the user has asked to commit; otherwise leave staged for their manual commit)

```bash
git add packages/core/scripts/prepare-llm-docs.mjs packages/core/package.json
git commit -m "build(core): de-style docs into dist/docs for LLM consumption"
```

---

### Task 2: JSDoc on the public API (definition sites)

**Files:**
- Modify: `packages/core/src/actions.ts`
- Modify: `packages/core/src/plugin.ts`
- Modify: `packages/core/src/events.ts`
- Modify: `packages/core/src/state.ts`
- Modify: `packages/core/src/composables/useModal.ts`
- Modify: `packages/core/src/composables/useModalContext.ts`
- Modify: `packages/core/src/types.ts`
- Modify: `packages/core/src/components/modal/interface.ts`
- Modify: `packages/core/src/components/target/interface.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: JSDoc comments in `dist/index.d.ts` (verified by grep). No code behaviour changes.

JSDoc goes **immediately above the existing exported declaration**, with no other edits. Add these blocks verbatim (adjust only whitespace to match the file).

- [ ] **Step 1: `actions.ts` — `openModal`**

Above `export function openModal<T = unknown, ...`:

```ts
/**
 * Open a modal imperatively and get a typed promise for its result.
 *
 * Returns a {@link ModalHandle} that is awaitable: it resolves with the value
 * passed to `confirm(...)` and rejects with {@link ModalClosedError} when the
 * modal is dismissed.
 *
 * Requirements:
 * - A `group` is required — pass `options.group` or declare
 *   `defineOptions({ modalGroup: '...' })` on the component. Missing group throws.
 * - A `<ModalTarget group="...">` for that group must be mounted in the app.
 * - Client-only: never call at module scope; call from an event handler or
 *   inside `onMounted`. It mutates shared module-level state, so calling it
 *   during SSR is unsafe — that state leaks across concurrent requests.
 */
```

- [ ] **Step 2: `actions.ts` — `replaceModal`, `closeModal`, `closeModalById`, `closeAllModals`, `closeModalsByGroup`, `ModalClosedError`**

Above `export class ModalClosedError`:

```ts
/** Rejection reason when a modal is dismissed without `confirm(...)`. */
```

Above `export function replaceModal`:

```ts
/**
 * Close the topmost modal of the target group (instantly, ignoring guards) and
 * open `component` in its place. Same `group` requirement as {@link openModal}.
 */
```

Above `export async function closeModal`:

```ts
/** Close the topmost modal (optionally scoped to `opts.group`). No-op if none open. */
```

Above `export async function closeModalById`:

```ts
/** Close a modal by its numeric id. No-op if not found. */
```

Above `export function closeAllModals`:

```ts
/** Close every open modal (all groups). Returns counts of closed/vetoed. */
```

Above `export function closeModalsByGroup`:

```ts
/** Close every open modal in `group`. Returns counts of closed/vetoed. */
```

Above `export interface CloseManyResult`:

```ts
/** Result of a bulk close: how many modals actually closed vs. were not closed (guard veto, or already closing/resolved). */
```

- [ ] **Step 3: `plugin.ts` — `createModal`**

Above `export function createModal`:

```ts
/**
 * Create the Vue plugin. Register it with `app.use(createModal({ groups }))`.
 * `groups` seeds per-group behavior defaults (scroll lock, close-on-escape,
 * interact-outside, etc.). Registering groups here does not by itself render
 * anything — you still mount a `<ModalTarget group="...">` per group.
 */
```

Above `export interface CreateModalOptions`:

```ts
/** Options for {@link createModal}. */
```

- [ ] **Step 4: `events.ts` — `onModalOpen` / `onModalClose`**

Above the **first** `export function onModalOpen(handler: ...` overload signature:

```ts
/**
 * Subscribe to modal-open events, globally or for one `group`.
 * Returns an unsubscribe function. Handler errors are caught and logged.
 */
```

Above the first `export function onModalClose(handler: ...` overload signature:

```ts
/**
 * Subscribe to modal-close events, globally or for one `group`.
 * Returns an unsubscribe function. Handler errors are caught and logged.
 */
```

- [ ] **Step 5: `state.ts` — reactive state helpers**

Above `export const modals = computed(...)`:

```ts
/** Reactive list of all open modals (read-only snapshot of the stack). */
```

Above `export const isOpened = computed(...)`:

```ts
/** Reactive boolean: is any modal currently open. */
```

Above `export function groupModals`:

```ts
/** Reactive list of open modals in `group` (top of stack is last). */
```

Above `export function isGroupOpen`:

```ts
/** Reactive boolean: is any modal open in `group`. */
```

- [ ] **Step 6: `composables/useModal.ts` — `useModal`**

Above `export function useModal<T = unknown, ...`:

```ts
/**
 * Component-scoped wrapper around {@link openModal}. Binds default props/`on`
 * handlers and exposes reactive `isOpen` / `isTop`. By default the modal is
 * closed automatically when the owning scope unmounts (`closeOnUnmount`).
 */
```

Above `export interface UseModalDefaults`:

```ts
/** Defaults for {@link useModal}; extends {@link OpenModalOptions} with `closeOnUnmount`. */
```

- [ ] **Step 7: `composables/useModalContext.ts` — `useModalContext`**

Above `export function useModalContext<T = unknown>()`:

```ts
/**
 * Access the current modal's context from **inside** a component opened via
 * {@link openModal} / {@link useModal}. Provides `confirm(data)`, `close()`,
 * `onBeforeClose(guard)`, and reactive `isClosing` / `isTopmost`. Throws if
 * called outside an opened modal.
 */
```

- [ ] **Step 8: `types.ts` — key exported types**

Above `export interface OpenModalOptions`:

```ts
/** Options for {@link openModal} / {@link replaceModal}. `group` is required unless the component declares `modalGroup`. */
```

Above `export interface ModalBehaviorOptions`:

```ts
/** Per-group behavior toggles seeded via `createModal({ groups })`. */
```

Above `export interface ModalHandle`:

```ts
/** Awaitable handle returned by {@link openModal}: resolves with the modal result, rejects with {@link ModalClosedError}. */
```

Above `export interface ModalGroupRegistry`:

```ts
/** Augment via `declare module '@kolirt/vue-modal'` to register typed group names. */
```

Above `export interface CloseModalOptions`:

```ts
/** Options when closing a modal: `success` + `data` (resolve), or flags `ignoreGuard` / `instantExit`. */
```

Above `export interface CloseFlags`:

```ts
/** Flags shared by close operations: `ignoreGuard` skips `beforeClose` guards; `instantExit` skips the exit animation. */
```

Above `export interface ModalItem`:

```ts
/** Public shape of a modal in the stack: `id`, `group`, `component`, `props`, `listeners`. */
```

Above `export interface ModalEffectiveOptions`:

```ts
/** Resolved per-modal behavior (after merging group defaults), as read via `useModalContext().effectiveOptions`. */
```

Above `export type ModalGroupsConfig`:

```ts
/** Map of group name → {@link ModalBehaviorOptions}, passed to `createModal({ groups })`. */
```

- [ ] **Step 9: `components/*/interface.ts` — props**

Above `export interface ModalRootProps` (in `components/modal/interface.ts`):

```ts
/**
 * Props for `<ModalRoot>`. `<ModalRoot>` must wrap a `<ModalContent>` — a modal
 * with no `<ModalContent>` renders blank and never finishes its exit animation.
 */
```

Above `export interface ModalTargetProps` (in `components/target/interface.ts`):

```ts
/**
 * Props for `<ModalTarget>` — the mount point for a group's modal stack.
 * Renders `div[data-modal-region]` at `position: fixed; inset: 0` with zero
 * specificity and no built-in `z-index`; set stacking via `[data-modal-region]`
 * in your CSS if another fixed element overlaps the modal.
 */
```

- [ ] **Step 9b: Component SFCs (best-effort source doc)**

The exported components are `.vue` default exports; `vite-plugin-dts` emits them
as `DeclareComponent`/`DefineComponent` declarations and a JSDoc block on the
SFC does **not** reliably surface in `dist/index.d.ts`. Their *props* are already
documented via `ModalRootProps` / `ModalTargetProps` (Step 9). For the remaining
components, add a one-line HTML comment at the top of each `<template>` so source
readers and the docs see intent (no d.ts guarantee — this is the documented
limitation, not a gap to chase):

- `components/modal/ModalContent.vue`: `<!-- Visible modal card + enter/exit transitions. Required inside <ModalRoot>; omitting it leaves the modal blank/stuck. -->`
- `components/modal/ModalTitle.vue`: `<!-- Accessible dialog title; renders [data-modal-title]. -->`
- `components/modal/ModalDescription.vue`: `<!-- Accessible dialog description; renders [data-modal-description]. -->`
- `components/target/ModalOverlay.vue`: `<!-- Backdrop for a group; renders [data-modal-overlay][data-state]. -->`

The authoritative usage for these components lives in `AGENTS.md` + `dist/docs`
(Tasks 1 and 3); JSDoc coverage that *must* land in `.d.ts` is the `.ts`
declarations and the two Props interfaces above.

- [ ] **Step 10: Build and verify JSDoc survives rollup**

Run: `pnpm --filter @kolirt/vue-modal build`
Expected: success.

Run: `grep -c '/\*\*' packages/core/dist/index.d.ts`
Expected: a number > 0.

Run: `grep -c 'module scope' packages/core/dist/index.d.ts`
Expected: ≥ 1 (the `openModal` caveat reached the declarations).

If either returns 0, the comments did not roll up. Fix by confirming the JSDoc sits directly on the exported declaration in the source `.ts` (not on the barrel), rebuild, and re-check. Do not proceed until both greps pass.

- [ ] **Step 11: Type-check & lint**

Run: `pnpm --filter @kolirt/vue-modal type-check && pnpm --filter @kolirt/vue-modal lint`
Expected: both pass (JSDoc-only changes must not break either).

- [ ] **Step 12: Commit** (only on the user's explicit instruction)

```bash
git add packages/core/src
git commit -m "docs(core): add JSDoc to the public API for agent/autocomplete discovery"
```

---

### Task 3: AGENTS.md (critical rules + index)

**Files:**
- Create: `AGENTS.md` (repo root)

**Interfaces:**
- Consumes: the `dist/docs/**` tree produced by Task 1 (the 37 shipped paths) — index links must point at files that exist there.
- Produces: `AGENTS.md` at repo root, linked from README in Task 4.

- [ ] **Step 1: Write the header + critical rules**

Create `AGENTS.md` starting with:

```markdown
# @kolirt/vue-modal — guide for AI agents

This is a complete, de-styled offline reference for AI coding agents using
`@kolirt/vue-modal` (Vue 3 headless modal library). Canonical, always-current
docs live at https://kolirt.github.io/vue-modal/. Package version: 2.3.0.

If you only read one section, read this one.

## Critical rules (avoid the common mistakes)

- **Peer deps:** requires `vue >= 3.4` and `reka-ui >= 2`. Install both.
- **Register the plugin:** `app.use(createModal({ groups: { default: {} } }))`.
- **Mount a target:** put `<ModalTarget group="default" />` in your app layout
  (not behind a `v-if` that is false when a modal opens).
- **Hierarchy:** a modal component must render `<ModalRoot>` wrapping
  `<ModalContent>`. **Missing `<ModalContent>` ⇒ the modal is blank and never
  closes** (the exit animation never fires).
- **Group is required:** `openModal(Comp, { group: 'default' })`, or declare
  `defineOptions({ modalGroup: 'default' })` on the component. No group ⇒ throws.
- **Never call `openModal` at module scope.** Call it from an event handler or
  inside `onMounted`. It is client-only; it mutates shared module-level state, so
  calling it during SSR is unsafe (the state leaks across concurrent requests).
- **z-index / stacking:** `<ModalTarget>` has **no built-in z-index**. If a
  fixed element overlaps the modal, set one on `[data-modal-region]` in your CSS
  (or move `<ModalTarget>` later in the DOM).
- **SSR:** the component primitives are SSR-safe and render on the server;
  `openModal` is not — only call it on the client (e.g. inside `onMounted`).

## Minimal correct setup

\`\`\`ts
// main.ts
import { createModal } from '@kolirt/vue-modal'
app.use(createModal({ groups: { default: {} } }))
\`\`\`

\`\`\`vue
<!-- App.vue -->
<template>
  <RouterView />
  <ModalTarget group="default" />
</template>
\`\`\`

\`\`\`vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ModalRoot, ModalContent, useModalContext } from '@kolirt/vue-modal'
const modal = useModalContext<boolean>()
</script>
<template>
  <ModalRoot class="flex items-center justify-center p-4">
    <ModalContent class="bg-white rounded-lg p-6">
      <button @click="modal.confirm(true)">OK</button>
    </ModalContent>
  </ModalRoot>
</template>
\`\`\`

\`\`\`ts
// open it from an event handler
const ok = await openModal(MyModal, { group: 'default' }).catch(() => false)
\`\`\`
```

(The triple backticks above are shown escaped for this plan; in `AGENTS.md` write them as real fenced code blocks.)

- [ ] **Step 2: Append the index**

After the critical-rules section, add a `## Documentation index` section. Produce **one table row per shipped file**, grouped exactly as below. For each row, the description is that file's frontmatter `description:` value condensed to one line (read it from `docs/content/<path>`); the link is `./dist/docs/<path>`. Example rows (use this exact format):

```markdown
## Documentation index

Open the file relevant to your task.

### Getting started
| Topic | File |
| --- | --- |
| Introduction & feature overview | [introduction](./dist/docs/2.getting-started/1.introduction.md) |
| Install & plugin setup | [installation](./dist/docs/2.getting-started/2.installation.md) |
| Your first modal | [first-modal](./dist/docs/2.getting-started/3.first-modal.md) |
```

Add the remaining groups and rows for **all 37** shipped files, in this order:

- **Concepts:** `3.concepts/1.architecture.md`, `3.concepts/2.imperative-flow.md`, `3.concepts/3.stacking.md`, `3.concepts/4.groups.md`, `3.concepts/5.headless-primitives.md`
- **Guide:** `4.guide/01.writing-a-modal.md`, `4.guide/02.opening-and-closing.md`, `4.guide/03.passing-props-and-results.md`, `4.guide/04.behavior-options.md`, `4.guide/05.styling-and-animations.md`, `4.guide/06.usemodal-composable.md`, `4.guide/07.modal-context.md`, `4.guide/08.multiple-targets.md`, `4.guide/09.overlay.md`, `4.guide/10.async-components.md`, `4.guide/11.typescript.md`
- **Recipes:** `5.recipes/1.confirm-dialog.md`, `5.recipes/2.form-modal-with-validation.md`, `5.recipes/3.image-lightbox.md`, `5.recipes/4.command-palette.md`, `5.recipes/5.nested-flows.md`, `5.recipes/6.global-error-modal.md`
- **API:** `6.api/1.functions.md`, `6.api/2.components.md`, `6.api/3.composables.md`, `6.api/4.plugin.md`, `6.api/5.state.md`, `6.api/6.events.md`, `6.api/7.types.md`
- **Resources:** `7.resources/1.migration-from-v1.md`, `7.resources/2.faq.md`, `7.resources/3.troubleshooting.md`, `7.resources/4.comparison.md`, `7.resources/5.changelog.md`

(3 + 5 + 11 + 6 + 7 + 5 = 37.)

- [ ] **Step 3: Verify index ↔ files match**

Run (after Task 1's build):
```bash
diff <(grep -oE '\./dist/docs/[^)]+\.md' AGENTS.md | sed 's#\./##' | sort -u) \
     <(cd packages/core && find dist/docs -name '*.md' | sort -u)
```
Expected: no output (every link resolves to a shipped file and vice-versa). Note: the link prefix is `dist/docs/...` while files live under `packages/core/dist/docs/...`; the `sed`/`cd` above normalise both to `dist/docs/...` for comparison.

- [ ] **Step 4: Commit** (only on the user's explicit instruction)

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md (critical rules + docs index) for AI agents"
```

---

### Task 4: Delivery wiring (README, package files, CI)

**Files:**
- Modify: `README.md` (root) — add a "For AI agents" block
- Modify: `packages/core/package.json` — `files` array
- Modify: `.github/workflows/publish-to-npm.yml` — copy step

**Interfaces:**
- Consumes: `AGENTS.md` (Task 3), `dist/docs/**` (Task 1).
- Produces: the published tarball containing `AGENTS.md` + `dist/docs/**`.

- [ ] **Step 1: README section**

In root `README.md`, immediately after the intro/`What you get` area (before `## Install`), add:

```markdown
## 🤖 For AI agents

Using an AI coding agent? See [`AGENTS.md`](./AGENTS.md) for a complete,
de-styled reference plus a critical-rules checklist. The two most common agent
mistakes are a missing `<ModalContent>` and z-index/stacking — both covered there.
```

- [ ] **Step 2: package.json `files`**

In `packages/core/package.json`, change:

```json
"files": [
  "dist",
  "AGENTS.md"
],
```

- [ ] **Step 3: CI copy step**

In `.github/workflows/publish-to-npm.yml`, update the copy step (name + command):

```yaml
      - name: 📄 Copy README, LICENSE & AGENTS into package
        run: cp README.md LICENSE AGENTS.md packages/core/
```

- [ ] **Step 4: Verify the tarball contents (mirror CI locally)**

Run (each line's own exit status is checked; no piping that masks failures):
```bash
set -e
pnpm --filter @kolirt/vue-modal build
cp README.md LICENSE AGENTS.md packages/core/
( cd packages/core && npm pack --dry-run ) > /tmp/pack.txt 2>&1
grep -q 'AGENTS.md' /tmp/pack.txt || { echo "FAIL: AGENTS.md missing from tarball"; exit 1; }
grep -q 'dist/docs/2.getting-started/1.introduction.md' /tmp/pack.txt || { echo "FAIL: dist/docs missing"; exit 1; }
grep -q 'README.md' /tmp/pack.txt || { echo "FAIL: README.md missing"; exit 1; }
! grep -q 'scripts/' /tmp/pack.txt || { echo "FAIL: scripts/ was published"; exit 1; }
echo "PACK OK: AGENTS.md + dist/docs present, scripts/ excluded"
```
`set -e` plus the `|| { … exit 1; }` guards make any failure abort with a non-zero status — the command cannot print a problem yet still "succeed". Expected final line: `PACK OK: …` and no `FAIL:` line. (`LICENSE`/`package.json` also appear in `/tmp/pack.txt`.)

- [ ] **Step 5: Clean up the local copies** (these are CI-only; do not leave them in the work tree)

```bash
rm -f packages/core/README.md packages/core/LICENSE packages/core/AGENTS.md
```

(`packages/core/.gitignore` already ignores the copied README/LICENSE per current setup; confirm `AGENTS.md` is likewise not committed inside `packages/core`. If `packages/core/.gitignore` lists `README.md`/`LICENSE`, add `AGENTS.md` to it in the same step.)

- [ ] **Step 6: Commit** (only on the user's explicit instruction)

```bash
git add README.md packages/core/package.json .github/workflows/publish-to-npm.yml packages/core/.gitignore
git commit -m "build(core): ship AGENTS.md in the package and link it from README"
```

---

## Self-Review

**Spec coverage:**
- Component 1 (JSDoc, definition-site, grep-verified) → Task 2. Covers all `.ts`
  function exports, the `OpenModalOptions`/`ModalBehaviorOptions`/`ModalHandle`/
  `CloseModalOptions`/`CloseFlags`/`ModalItem`/`ModalEffectiveOptions`/
  `ModalGroupsConfig`/`ModalGroupRegistry` types, and the `ModalRootProps`/
  `ModalTargetProps` interfaces; component `.vue` default exports get best-effort
  source comments with the d.ts limitation documented (Step 9b). Grep gate Step 10. ✓
- Component 2 (AGENTS.md: rules + 37-row index, `./dist/docs` links) → Task 3. ✓
- Component 3 (de-style build script, full rule set, exclusions, idempotent, unbalanced-warn) → Task 1. ✓
- Component 4 (README link) → Task 4 Step 1. ✓
- Delivery (`files`, CI cp + step name, pack from prepared dir, scripts/ excluded) → Task 4. ✓
- Link-resolution / authoring-at-root → Task 3 creates root file; Task 4 copies it (CI). ✓
- Verification criteria (build, de-style grep, JSDoc grep, exclusions, index↔files, pack) → distributed across task verify steps. ✓

**Placeholder scan:** Script and JSDoc blocks are complete literal content. The index descriptions are a deterministic transform of each file's frontmatter `description:` (concrete source given, two example rows shown, full ordered path list provided) — not a TODO. No "TBD"/"handle edge cases"/"similar to Task N".

**Type/name consistency:** Symbol names (`openModal`, `replaceModal`, `closeModal`, `closeModalById`, `closeAllModals`, `closeModalsByGroup`, `ModalClosedError`, `CloseManyResult`, `createModal`, `CreateModalOptions`, `onModalOpen`, `onModalClose`, `modals`, `isOpened`, `groupModals`, `isGroupOpen`, `useModal`, `UseModalDefaults`, `useModalContext`, `OpenModalOptions`, `ModalBehaviorOptions`, `ModalHandle`, `ModalGroupRegistry`, `CloseModalOptions`, `CloseFlags`, `ModalItem`, `ModalEffectiveOptions`, `ModalGroupsConfig`, `ModalRootProps`, `ModalTargetProps`) match the actual exports in `packages/core/src/index.ts` and their definition files. `files` value matches the spec. Path `2.getting-started/3.first-modal.md` is consistent across tasks.

**Testing note:** This repo has no wired test runner for build scripts; per the project's convention, TDD steps are replaced with build + `grep`/`find`/`npm pack --dry-run` smoke verification (concrete commands + expected output above). No test file is scaffolded just to satisfy a checklist.
