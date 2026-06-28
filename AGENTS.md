# @kolirt/vue-modal — guide for AI agents

This is a complete, de-styled offline reference for AI coding agents using
`@kolirt/vue-modal` (Vue 3 headless modal library). Canonical, always-current
docs live at https://kolirt.github.io/vue-modal/. Package version: 2.4.0.

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
- **z-index / stacking:** `<ModalTarget>` has **no built-in z-index**. Within one
  group the package stacks modals for you, but to order **different groups** (a
  `confirm`/`prompt` above a `main` modal) give each group's `<ModalTarget>` an
  explicit z-index — a small layered scale (`z-40…z-70`), not `9999`. Same if a
  page's fixed element overlaps the modal. (See the z-index section.)
- **SSR:** the component primitives are SSR-safe and render on the server;
  `openModal` is not — only call it on the client (e.g. inside `onMounted`).

## Minimal correct setup

```ts
// main.ts
import { createModal } from '@kolirt/vue-modal'
app.use(createModal({ groups: { default: {} } }))
```

```vue
<!-- App.vue -->
<template>
  <RouterView />
  <ModalTarget group="default" />
</template>
```

```vue
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
```

```ts
// open it from an event handler
const ok = await openModal(MyModal, { group: 'default' }).catch(() => false)
```

## Recommended structure: a Wrapper + Target component per group

For anything beyond a throwaway, **do not repeat `<ModalRoot>`/`<ModalContent>`
in every modal**. Make two thin, reusable components per modal group and build
real modals on top of them. This is the proven structure:

**1. Target** — mount the group once in your layout; it owns the overlay and the
group's z-index (a small value, layered per group — never a magic number):

```vue
<!-- MainModalTarget.vue -->
<script setup lang="ts">
import { ModalTarget, ModalOverlay } from '@kolirt/vue-modal'
</script>
<template>
  <ModalTarget group="main" class="z-50">
    <ModalOverlay class="bg-black/80
      data-[state=open]:animate-in data-[state=closed]:animate-out
      fade-in data-[state=closed]:fade-out data-[state=closed]:fill-mode-forwards" />
  </ModalTarget>
</template>
```

Layer groups by giving each Target its own z-index, e.g. `z-40` menu · `z-50`
main · `z-60` sidebar · `z-70` prompt — keep them low with headroom (see the
z-index section about reka-ui popovers needing to sit above these).

**2. Wrapper** — bundle `<ModalRoot>` (alignment) + `<ModalContent>` (the card +
animation) + a `<slot>`. **Alignment lives on `<ModalRoot>`**; `<ModalContent>`
is a plain `relative` block — never positioned (`fixed`/`absolute`/`inset`/
`translate` for placement belongs to `<ModalRoot>`, not here):

```vue
<!-- MainModalWrapper.vue -->
<script setup lang="ts">
import { ModalRoot, ModalContent } from '@kolirt/vue-modal'
</script>
<template>
  <!-- ModalRoot already covers the target (inset:0) — set ALIGNMENT here -->
  <ModalRoot class="flex items-end justify-center overflow-hidden p-4">
    <!-- ModalContent = plain block: size + visuals + animation only -->
    <ModalContent class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl
      data-[state=open]:animate-in slide-in-from-bottom
      data-[state=closed]:animate-out slide-out-to-bottom data-[state=closed]:fill-mode-forwards">
      <slot />
    </ModalContent>
  </ModalRoot>
</template>
```

Alignment recipes for `<ModalRoot>`: `items-center justify-center` = centered
dialog · `items-end justify-center` = bottom sheet · `justify-end` = right side
panel · `items-start justify-center` = top. (A Wrapper may also accept `variant`/
`size` props and inject a shared close button — keep that logic in the Wrapper,
not in each modal.)

**3. The actual modal** uses the Wrapper and only deals with content + result:

```vue
<!-- ConfirmModal.vue -->
<script setup lang="ts">
import { useModalContext } from '@kolirt/vue-modal'
import MainModalWrapper from './MainModalWrapper.vue'
defineOptions({ modalGroup: 'main' })
const { confirm, close } = useModalContext<boolean>()
</script>
<template>
  <MainModalWrapper>
    <p>Are you sure?</p>
    <button @click="confirm(true)">OK</button>
    <button @click="close()">Cancel</button>
  </MainModalWrapper>
</template>
```

`useModalContext()` works in the opened component **and** inside the Wrapper —
the package provides the context above both.

## Styling, animations & z-index (get this right in one pass)

The package ships **zero CSS** — no styles, no animations, no z-index. You drive
everything via `data-state="open" | "closed"` attributes the package sets on the
rendered elements. Key rule: **the package waits for your CSS
animation/transition to finish before unmounting**, so close animations always
play to completion.

**Positioning (most common mistake):** `<ModalRoot>` already covers the whole
target (`position: absolute; inset: 0`) and is the positioning context for the
card. Put layout utilities (`flex`, alignment, padding) on `<ModalRoot>`; style
`<ModalContent>` as a normal block (width, background, padding, shadow,
animation). **Do NOT put `position: fixed/absolute`, `inset-0`, `top-*`,
`left-*`, or `-translate-*` on `<ModalContent>`** — it fights the parent and
breaks stacking.

**Data attributes you can target:** `[data-modal-region]` (`<ModalTarget>` root,
no state), `[data-modal-overlay][data-state]` (`<ModalOverlay>`),
`[data-modal-content][data-state]` (`<ModalContent>`),
`[data-modal-title]` / `[data-modal-description]`.

**Animation (custom keyframes) — note `animation-fill-mode: forwards` is required:**

```vue
<template>
  <ModalRoot class="flex items-center justify-center p-4">
    <ModalContent class="card"><slot /></ModalContent>
  </ModalRoot>
</template>

<style>
.card {
  background: #fff; border-radius: 12px; padding: 24px;
  opacity: 0; transform: translateY(8px) scale(0.98); /* enter start */
}
.card[data-state='open']   { animation: card-in  200ms ease forwards; }
.card[data-state='closed'] { animation: card-out 150ms ease forwards; }
@keyframes card-in  { to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes card-out { to { opacity: 0; transform: translateY(8px) scale(0.98); } }
</style>
```

Keep `forwards` on **both** states. Without it the element snaps back to the
base selector's values the instant the keyframes end — discarding the final
frame and causing a flicker before unmount / when the next modal opens on top.
(Tailwind alternative: `data-[state=open]:animate-in data-[state=closed]:animate-out`
+ `fade-in-0`/`zoom-in-95` etc. via the `tw-animate-css` plugin.)

**z-index / stacking:** `<ModalTarget>` renders `[data-modal-region]` as
`position: fixed; inset: 0` with **no z-index** (zero specificity). Two things
to layer:

- **Within one group:** the package stacks modals inside that group's own region
  for you — no z-index needed for modal-over-modal in the *same* group.
- **Across groups (one group's modal must sit above another's):** each group has
  its **own** `<ModalTarget>` = its own fixed region. When several groups can be
  open at once and must stack in a defined order (e.g. a `prompt`/`confirm` on
  top of a `main` modal, a `sidebar` over `main`), **give each `<ModalTarget>` an
  explicit z-index** — this is the intended, deterministic way to order groups.
  Relying on DOM order of the targets is fragile; set the z-index. Use a **small,
  layered scale**, not a magic number:

```html
<!-- one ModalTarget per group, layered deliberately -->
<ModalTarget group="menu"    class="z-40" />
<ModalTarget group="main"    class="z-50" />
<ModalTarget group="sidebar" class="z-60" />
<ModalTarget group="prompt"  class="z-70" />   <!-- confirm/error: on top -->
```

Keep the values low (`z-40…z-70`, not `9999`) and leave headroom above the top
group — because of the next point.

**Popovers/selects inside a modal (reka-ui & friends):** floating content from
`Select`, `Combobox`, `Popover`, `Tooltip`, etc. teleports to `<body>`, *outside*
the modal's DOM subtree. To appear **above** the open modal it must have a
z-index greater than that group's `<ModalTarget>`. So keep the group z-indexes
low with headroom, or render the floating content inside the modal (disable the
primitive's portal / teleport it into the modal) so it shares the modal's
stacking context instead of competing with it.

For overlay theming, Tailwind utility strategy, and CSS-var convenience, see the
[styling-and-animations](./dist/docs/4.guide/05.styling-and-animations.md) guide.

## Documentation index

Open the file relevant to your task.

### Getting started
| Topic | File |
| --- | --- |
| What @kolirt/vue-modal is and the problems it solves | [introduction](./dist/docs/2.getting-started/1.introduction.md) |
| Install the package and register your modal groups | [installation](./dist/docs/2.getting-started/2.installation.md) |
| Write a modal component, open it imperatively, handle the result | [first-modal](./dist/docs/2.getting-started/3.first-modal.md) |

### Concepts
| Topic | File |
| --- | --- |
| How ModalTarget, ModalRoot, and the headless primitives fit together | [architecture](./dist/docs/3.concepts/1.architecture.md) |
| Why the API is promise-based and how the modal lifecycle works | [imperative-flow](./dist/docs/3.concepts/2.imperative-flow.md) |
| How multiple modals stack and what "topmost" means globally vs per-group | [stacking](./dist/docs/3.concepts/3.stacking.md) |
| Why modals belong to named groups and what isolation that provides | [groups](./dist/docs/3.concepts/4.groups.md) |
| Why the package ships no visual styles and how to drive animations with data attributes | [headless-primitives](./dist/docs/3.concepts/5.headless-primitives.md) |

### Guide
| Topic | File |
| --- | --- |
| Structure of a modal component using ModalRoot, ModalContent, and useModalContext | [writing-a-modal](./dist/docs/4.guide/01.writing-a-modal.md) |
| openModal, closeModal, replaceModal — signatures, return values, and pitfalls | [opening-and-closing](./dist/docs/4.guide/02.opening-and-closing.md) |
| How props flow into a modal and how to type the result promise end-to-end | [passing-props-and-results](./dist/docs/4.guide/03.passing-props-and-results.md) |
| Modal mode, close triggers, scroll lock, focus trap | [behavior-options](./dist/docs/4.guide/04.behavior-options.md) |
| Headless data-state hooks, Tailwind utilities, custom keyframes | [styling-and-animations](./dist/docs/4.guide/05.styling-and-animations.md) |
| Bind a modal component to a reactive controller — persistent listeners, reactive isOpen, auto-cleanup | [usemodal-composable](./dist/docs/4.guide/06.usemodal-composable.md) |
| Full reference for useModalContext — id, group, isTopmost, effectiveOptions, close, confirm, onBeforeClose | [modal-context](./dist/docs/4.guide/07.modal-context.md) |
| When and how to use more than one ModalTarget — visual layering, scroll-lock policies, separate DOM positions | [multiple-targets](./dist/docs/4.guide/08.multiple-targets.md) |
| Customize the dimming layer — slot content, pointer behavior, per-group overlays, and the data attributes used for styling and animations | [overlay](./dist/docs/4.guide/09.overlay.md) |
| Keep heavy modal components out of the initial bundle with defineAsyncComponent | [async-components](./dist/docs/4.guide/10.async-components.md) |
| Full type-safety — group registry, typed promises, ExtractComponentProps, and useModalContext typing | [typescript](./dist/docs/4.guide/11.typescript.md) |

### Recipes
| Topic | File |
| --- | --- |
| A reusable ConfirmDialog component paired with a confirm() helper that returns Promise<boolean> | [confirm-dialog](./dist/docs/5.recipes/1.confirm-dialog.md) |
| A modal that hosts a form, returns validated data via confirm(data), and guards against accidental dirty-close | [form-modal-with-validation](./dist/docs/5.recipes/2.form-modal-with-validation.md) |
| A full-screen lightbox that navigates a list of images with arrow keys, closes on backdrop or Esc, and transitions instantly between images using replaceModal | [image-lightbox](./dist/docs/5.recipes/3.image-lightbox.md) |
| A Cmd+K command palette built as a fullscreen modal with fuzzy search, using a dedicated modal group and useModal for clean open/close state | [command-palette](./dist/docs/5.recipes/4.command-palette.md) |
| Build a multi-step wizard using replaceModal + instantEnter so steps swap without full open/close transitions | [nested-flows](./dist/docs/5.recipes/5.nested-flows.md) |
| Wire a fetch/axios interceptor to open an error modal from anywhere. Uses a dedicated high-z-index group, replaceModal to deduplicate, and closeModalsByGroup on logout | [global-error-modal](./dist/docs/5.recipes/6.global-error-modal.md) |

### API
| Topic | File |
| --- | --- |
| openModal, closeModal, closeModalById, closeAllModals, closeModalsByGroup, replaceModal, ModalClosedError | [functions](./dist/docs/6.api/1.functions.md) |
| ModalTarget, ModalRoot, ModalContent, ModalTitle, ModalDescription, ModalOverlay | [components](./dist/docs/6.api/2.components.md) |
| useModal, useModalContext | [composables](./dist/docs/6.api/3.composables.md) |
| createModal() — the Vue plugin factory for @kolirt/vue-modal | [plugin](./dist/docs/6.api/4.plugin.md) |
| Reactive read-only exports for observing the modal stack — modals, isOpened, groupModals, isGroupOpen | [state](./dist/docs/6.api/5.state.md) |
| Subscribe to modal-open and modal-close events globally or per group — onModalOpen, onModalClose | [events](./dist/docs/6.api/6.events.md) |
| Complete public type surface for @kolirt/vue-modal — all exported interfaces, type aliases, and utility types | [types](./dist/docs/6.api/7.types.md) |

### Resources
| Topic | File |
| --- | --- |
| Step-by-step guide to upgrading from @kolirt/vue-modal v1 to v2 | [migration-from-v1](./dist/docs/7.resources/1.migration-from-v1.md) |
| Frequently asked questions about @kolirt/vue-modal v2 | [faq](./dist/docs/7.resources/2.faq.md) |
| Common errors and problems in @kolirt/vue-modal v2, with causes and fixes | [troubleshooting](./dist/docs/7.resources/3.troubleshooting.md) |
| How @kolirt/vue-modal compares to other dialog solutions for Vue 3 | [comparison](./dist/docs/7.resources/4.comparison.md) |
| Version history for @kolirt/vue-modal | [changelog](./dist/docs/7.resources/5.changelog.md) |
