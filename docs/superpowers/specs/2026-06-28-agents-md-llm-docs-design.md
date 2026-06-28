# Design: AGENTS.md + LLM-facing docs delivery for @kolirt/vue-modal

**Date:** 2026-06-28
**Status:** Approved (design), pending spec review
**Author:** kolirt (with Claude)

## Problem

When a developer in a **consumer project** tells an AI coding agent
"install `@kolirt/vue-modal` and make a modal", the agent makes mistakes —
the last real failure was a wrong **z-index / stacking** result; other common
ones: forgetting `<ModalTarget>`, omitting `<ModalContent>`, calling
`openModal` at module scope, missing `group`.

The agent in a consumer project sees the package **only through
`node_modules/@kolirt/vue-modal/`**. Rich human docs exist (the Nuxt content
site under `docs/content`), but they never reach `node_modules`, and no file
inside `node_modules` is *guaranteed* to be read. The goal is to **maximize
the hit-rate** that an agent encounters correct usage information, via several
complementary channels (defence in depth), not a single "magic" file.

Verifier panel (codex, grok-composer, grok) consensus: the highest-confidence
levers are (1) type/JSDoc signals the agent reads almost always, and (2)
shipping the real docs into the package behind a small index — avoiding a
hand-maintained duplicate (drift risk).

## Scope

In scope:
1. **JSDoc** on the public API surface.
2. **AGENTS.md** — an inline critical-rules checklist **plus an index** that
   points to the real documentation files.
3. **Ship the real docs** into the published package as plain (de-styled)
   markdown, produced by a build script.
4. **README** "For AI agents" section linking to `AGENTS.md`.

Out of scope (explicitly dropped during brainstorming):
- Dev-mode runtime `console.warn` for the silent missing-`<ModalContent>` case.
- `llms.txt` on the docs site.
- Auto-generating `AGENTS.md` from docs (possible future work).

## Architecture

### Delivery layout (in the published tarball / `node_modules`)

The de-styled docs ship under `dist/docs/`; there is exactly **one**
`AGENTS.md`, placed at the **package root**, whose index links use
`./dist/docs/<path>`. One file, one link convention, all resolvable from the
package root where an agent starts:

```
node_modules/@kolirt/vue-modal/
  README.md            ← npm-rendered; copied to package root by CI (as today)
  LICENSE              ← copied by CI (as today)
  package.json         ← files: ["dist", "AGENTS.md"]
  AGENTS.md            ← single copy at package root; links → ./dist/docs/...
  dist/
    index.js / index.cjs / index.d.ts   ← JSDoc lands in index.d.ts
    docs/              ← de-styled markdown, mirrors docs/content structure
      2.getting-started/2.installation.md
      4.guide/05.styling-and-animations.md
      ...
```

`files` becomes `["dist", "AGENTS.md"]`. npm auto-includes `README.md`,
`LICENSE`, and `package.json` regardless of `files`; `dist/**` (incl.
`dist/docs/**`) is covered by the `"dist"` entry; `AGENTS.md` must be listed
explicitly. The `scripts/` dir is **not** in `files`, so the build script is
never published.

### AGENTS.md authoring & link resolution

`AGENTS.md` is **authored and committed at the repo root** (`/AGENTS.md`),
next to `README.md`. CI copies it into `packages/core/` at publish time, the
same way `README.md`/`LICENSE` are copied today, so it lands at the published
package root.

Link resolution by context:
- **Published package / consumer `node_modules`** (the audience that matters):
  package root contains `AGENTS.md` + `dist/docs/**` → every `./dist/docs/...`
  index link resolves. ✓
- **`packages/core/` after a local build**: same relative layout → links
  resolve. ✓
- **Repo-root committed copy / GitHub browse**: `dist/` does not exist at the
  repo root (it is `packages/core/dist`), so the `./dist/docs/...` links do
  **not** resolve there. This is acceptable: the repo-root file is the
  authoring source, and humans have the docs site. The README "For AI agents"
  link to `./AGENTS.md` *does* resolve at the repo root (and in the package).
  This trade-off is called out so no one "fixes" it by pointing links at
  `docs/content` (which would then break in the package).

### Component 1 — JSDoc on the public API

**Placement (critical):** JSDoc must be attached at each export's
**definition site**, not on the `index.ts` re-export. `index.ts` is a barrel
of `export { x } from './y'`; `vite-plugin-dts` with `rollupTypes: true`
rolls declarations up from the definition sites, so a comment written only on
the barrel re-export is not guaranteed to survive into `dist/index.d.ts`.
Concretely, comments go on the declarations in: `src/actions.ts`
(`openModal`, `replaceModal`, `closeModal`, `closeModalById`,
`closeModalsByGroup`, `closeAllModals`, `ModalClosedError`,
`CloseManyResult`), `src/components/target/*` (`ModalTarget`, `ModalOverlay`,
props), `src/components/modal/*` (`ModalRoot`, `ModalContent`, `ModalTitle`,
`ModalDescription`, `ModalRootProps`), `src/composables/useModal.ts`,
`src/composables/useModalContext.ts`, `src/plugin.ts` (`createModal`),
`src/events.ts` (`onModalOpen`, `onModalClose`), `src/state.ts`
(`modals`, `groupModals`, `isOpened`, `isGroupOpen`), and `src/types.ts`
(the exported types/fields). For SFC-defined component props, JSDoc goes on the
`defineProps`/props type in the corresponding `.ts`/`.vue` so it reaches the
generated `.d.ts`.

Each comment states purpose + the critical caveat:

- `openModal` / `replaceModal` — returns a Promise that resolves with the
  modal result; `group` is required (option or `defineOptions({ modalGroup })`);
  **never call at module scope** — only in event handlers / `onMounted`.
- `closeModal` / `closeModalById` / `closeModalsByGroup` / `closeAllModals` —
  what each closes; resolution semantics; `ModalClosedError`.
- `ModalTarget` — must be mounted for the group; positioning + **z-index via
  `[data-modal-region]`** note.
- `ModalRoot` / `ModalContent` — required hierarchy `<ModalRoot> → <ModalContent>`;
  missing `<ModalContent>` ⇒ blank / stuck modal.
- `ModalOverlay`, `ModalTitle`, `ModalDescription` — role + data-attributes.
- `useModal` — defaults binding; `useModalContext` — only inside an opened modal.
- `createModal` — plugin install + group registration.
- `onModalOpen` / `onModalClose` — global events.
- State helpers `modals` / `groupModals` / `isOpened` / `isGroupOpen`.
- Key types: `OpenModalOptions`, `ModalBehaviorOptions`, `ModalHandle`,
  `CloseModalOptions`, `ModalItem`, etc. — JSDoc on fields.

**Verification:** `vite-plugin-dts` runs with `rollupTypes: true`. After build,
grep `dist/index.d.ts` to confirm the comments survived rollup. If they are
stripped, adjust the dts/tsconfig settings until they appear.

### Component 2 — AGENTS.md (critical rules + index)

Single file at package root. Two sections:

1. **Header** — one paragraph: "complete offline reference for LLMs / AI
   coding agents", canonical docs URL (the site), and the package version.
2. **Critical rules (inline checklist)** — the safety net so a single-read
   agent already avoids the top mistakes:
   - peer deps: `vue >= 3.4`, `reka-ui >= 2`;
   - register the plugin via `createModal(...)`;
   - mount a `<ModalTarget group="...">` somewhere in the layout;
   - modal hierarchy `<ModalRoot> → <ModalContent>` (omit content ⇒ blank/stuck);
   - `group` is required on `openModal` (option or `defineOptions`);
   - do **not** call `openModal` at module scope (use event handler / `onMounted`);
   - z-index/stacking: target `[data-modal-region]` in your CSS (no built-in z-index);
   - SSR: `openModal` is client-only — guard with `onMounted`.
3. **Index** — grouped table with **one row for every shipped file** (the 37
   non-excluded docs), short description → `./dist/docs/<path>`. Groups:
   Getting-started / Concepts / Guide / Recipes / API / Resources. The index
   must list exactly the files the build emits (excluded `index.md` /
   `1.playground.md` get no row); adding/removing a doc file requires updating
   this index.

### Component 3 — de-styling build script

`packages/core/scripts/prepare-llm-docs.mjs` (Node ESM, no new deps; the
`scripts/` dir does not exist yet and is created as part of this work). Wired
into the package `build` script so it runs after Vite (surviving
`emptyOutDir`):

```
"build": "vite build && node scripts/prepare-llm-docs.mjs"
```

**Path robustness:** the script resolves paths from its own location via
`import.meta.url`, never from `process.cwd()` — source is
`<scriptDir>/../../../docs/content` (repo `docs/content`), output is
`<scriptDir>/../dist/docs` (`packages/core/dist/docs`). It asserts the source
dir exists and fails loudly otherwise.

**Corpus facts (full scan of `docs/content`, drives the rules below).** The
docs tree has **39** markdown files. The only MDC block components present are:
`::code-group` (17), `::callout` (13), `::steps` (1), `::first-modal-demo` (1),
`::Playground` (1), and a `u-page-hero` / `u-page-section` pair in `index.md`
(written at deep colon nesting, ≥4 colons — the generic `:`×N rule below
handles any depth). There is **no** inline MDC (`:name[...]`); brace
occurrences (`{ groups }`, `defineProps<{...}>`) are JS/TS code, not MDC
attributes. Angle-bracket tags (`<ModalTarget>`, `<script>`, `<div>`, …) appear
both inside fenced code **and** in prose/headings/tables (usually inline
`` `<ModalTarget>` ``); the de-style rules below **never touch angle-bracket
tags anywhere** — only `::`-fences, frontmatter, and (defensive) `{.class}`
attribute syntax are removed — so their location is irrelevant to correctness.

**Excluded files (not shipped, not indexed) — decision:** `index.md` (landing
page — `u-page-hero` / `u-page-section` chrome, no instructional content) and
`1.playground.md` (interactive demo, ~137 words, `::Playground`). All other
**37** files are shipped, including `7.resources/5.changelog.md`. This is
**confirmed by the user** (2026-06-28): the two excluded files carry no value
for an AI agent once de-styled. The earlier "include literally all" preference
is settled as "all except pure site chrome."

Behaviour, per file:
1. Read every `*.md` under `docs/content/`, **skipping the excluded files**.
2. **De-style**, operating line-by-line while tracking whether the cursor is
   inside a fenced code block (``` or ~~~). **Never modify anything inside a
   code fence.** Outside code fences:
   - **Frontmatter:** strip the leading block only — if the file's first
     non-empty line is `---`, drop through the next `---`. Leave all later
     `---` (thematic breaks) intact.
   - **MDC containers — unwrap, keep inner content:** `::code-group`,
     `::callout` (incl. `::callout{...}` with attributes), `::steps`. Use a
     **stack-based** matcher: push on an opening line `:`×N followed by an
     unwrapped-set name (N ≥ 2; handle any depth and **nesting**, e.g. `::steps`
     wrapping `::code-group` in `2.getting-started/2.installation.md`), pop on a
     bare `:`×N close line, matching closes to opens by the stack (do not assume
     equal N or non-nesting). Remove only the opening/closing fence lines; keep
     the body. (Optionally prefix `::callout` body lines with `> ` to preserve
     the "note" emphasis — cosmetic, not required.)
   - **MDC containers — drop with body:** any block component **not** in the
     unwrap-set is removed together with its content: `::first-modal-demo`
     (appears in the kept file `2.getting-started/3.first-modal.md`) plus, as a
     safety net for the excluded files, `::Playground`, `u-page-hero`,
     `u-page-section` (any colon depth). Rule of thumb: unwrap the known doc
     containers {`code-group`, `callout`, `steps`}; drop every other
     `::component` block with its body.
   - **Inline attribute syntax** (`{.class}`, `{#id}`) — strip if it ever
     appears outside code (none today; defensive).
   - **Keep:** headings, prose, tables, fenced code including code-group fence
     labels like ` ```ts [setup] ` (harmless).
3. Write to `packages/core/dist/docs/` mirroring source structure (numeric
   Nuxt prefixes kept — stable identifiers referenced by the AGENTS.md index).
4. **Idempotent**; re-runnable. On an **unbalanced** MDC fence (no matching
   close) the script logs a warning and emits the file body unchanged rather
   than corrupting it.

Internal cross-links inside doc files (e.g. `/api/state`) are **left as-is**;
navigation is via the AGENTS.md index, not via in-doc links.

### Component 4 — README section

Add a short "🤖 For AI agents" block to the root `README.md`:
> Using an AI coding agent? See [`AGENTS.md`](./AGENTS.md) for a complete,
> de-styled reference and a critical-rules checklist. Most common agent
> mistakes: missing `<ModalContent>` and z-index/stacking — both covered there.

Because CI copies the root `README.md` into the package, the link ships too.
(The relative link resolves on GitHub and in the package root.)

### CI workflow change

`.github/workflows/publish-to-npm.yml` currently has a step:
```
- name: 📄 Copy README & LICENSE into package
  run: cp README.md LICENSE packages/core/
```
The de-styled docs are produced by the **build script** (run in the existing
`🏗 Build` step) into `dist/docs`, so no extra copy of docs is needed in CI.
We only additionally copy `AGENTS.md`, and update the step **name** to match:
```
- name: 📄 Copy README, LICENSE & AGENTS into package
  run: cp README.md LICENSE AGENTS.md packages/core/
```
Ordering note: the copy step already runs after `🏗 Build`, so `dist/docs`
exists before `pnpm publish` packs the tarball.

## Data flow

```
docs/content/**.md ──(prepare-llm-docs.mjs, de-style)──▶ dist/docs/**.md
AGENTS.md (hand-written: rules + index → ./dist/docs/...) ─▶ shipped at root
src/*.ts JSDoc ──(vite build, rollupTypes)──▶ dist/index.d.ts
README.md (+ For-AI-agents link) ──(CI cp)──▶ package root
```

## Error handling / edge cases

- **JSDoc stripped by rollup** — verify via grep; adjust dts config if needed.
- **Frontmatter false-positive** — only strip the *first* `---…---` at file top.
- **Unbalanced MDC fences** — script logs a warning and leaves the file's body
  intact rather than corrupting it.
- **New doc file added** — must be added to the AGENTS.md index (manual step;
  acceptable since index entries need human descriptions). A future generator
  could automate this.
- **Tarball size** — shipping ~26k words of de-styled markdown is acceptable
  (hundreds of KB); documented as an intentional trade-off.

## Testing / verification

No unit-test harness is wired for build scripts in this repo, so verify
manually with explicit pass/fail criteria:

1. **Build:** `pnpm --filter @kolirt/vue-modal build` completes without error
   and the script logs **no** "unbalanced MDC" warnings.
2. **JSDoc survived rollup:** `grep -c '/\*\*' packages/core/dist/index.d.ts`
   returns > 0, and grepping for a known phrase (e.g. `module scope`) finds the
   `openModal` caveat. **If 0**, the barrel-only placement failed → move JSDoc
   to definition sites / adjust dts config until it appears. (Acceptance: every
   footgun-prone export named in Component 1 has a comment in `index.d.ts`.)
3. **De-style completeness:** across `packages/core/dist/docs/**`,
   `grep -rE '^::|^:::|^::::' ` returns **nothing** (no MDC fences leaked) and
   no file begins with a `---` frontmatter block. Code fences are intact
   (`<ModalTarget>` etc. still present inside ``` blocks).
4. **Spot-check** `dist/docs/4.guide/05.styling-and-animations.md`: frontmatter
   gone, `::callout`/`::code-group` wrappers gone, table + code intact.
5. **Exclusions:** `index.md` and `1.playground.md` are **absent** from
   `dist/docs`.
6. **Index ↔ files match:** every `./dist/docs/...` link in `AGENTS.md` points
   to a file that exists, and every shipped file has exactly one index row
   (script-assisted diff: list `dist/docs/**` vs links parsed from AGENTS.md).
7. **Tarball:** from `packages/core/` after `cp README.md LICENSE AGENTS.md .`
   (mirroring CI), `npm pack --dry-run` lists `AGENTS.md`, `dist/docs/**`, and
   does **not** list `scripts/`. (Running pack from the repo root would not see
   the copied `AGENTS.md`, so it must be run from the prepared package dir.)

## Drift note

The de-style-and-ship approach means the package ships the **real** docs, so
there is no second copy to keep in sync (unlike a full hand-written dump). The
only manual coupling is the **AGENTS.md index** (descriptions + file list),
which changes only when docs files are added/removed. Canonical source remains
`docs/content` (and the docs site); `AGENTS.md` says so in its header.
