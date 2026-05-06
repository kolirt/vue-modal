<p align="center">
  <img src="https://raw.githubusercontent.com/kolirt/vue-modal/master/docs/public/logo.png" alt="@kolirt/vue-modal" width="160" />
</p>

<h1 align="center">@kolirt/vue-modal</h1>

<p align="center">
  Open modals from any function, stack them as needed, and style them however you want.<br />
  No template boilerplate, no manual state — just call and <code>await</code>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kolirt/vue-modal"><img src="https://img.shields.io/npm/v/@kolirt/vue-modal.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@kolirt/vue-modal"><img src="https://img.shields.io/npm/dm/@kolirt/vue-modal.svg?style=flat-square" alt="npm downloads" /></a>
  <a href="https://github.com/kolirt/vue-modal/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@kolirt/vue-modal.svg?style=flat-square" alt="license" /></a>
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=flat-square&logo=vue.js" alt="Vue 3" />
</p>

<p align="center">
  <a href="https://kolirt.github.io/vue-modal/"><strong>📚 Documentation</strong></a> ·
  <a href="https://kolirt.github.io/vue-modal/playground"><strong>🎮 Playground</strong></a> ·
  <a href="https://kolirt.github.io/vue-modal/recipes/confirm-dialog"><strong>🍳 Recipes</strong></a>
</p>

---

## What you get

`@kolirt/vue-modal` is a lightweight, headless modal package for Vue 3. It lets you open, stack, and control dialogs imperatively from any function — without registering modal components in templates or wiring open/close state by hand.

- **Open from JS/TS** — trigger modals from any function and await the user's response. A single call returns a typed promise with full TypeScript inference for props and result.
- **Less template boilerplate** — skip placing every modal in your templates and wiring open/close state by hand. Register one mount point and trigger any modal from code with a single call.
- **Cascading modals** — open multiple modals one after another while preserving their state and context. Layer a confirmation on top of a form without losing the form's data.
- **Highly customizable** — headless primitives with no imposed styles. Bring your own CSS, transitions, and animations — compose modals that fit any design system.
- **Modal groups** — isolate flows with named groups — the main app stack, confirm dialogs, side panels — each rendering in its own mount point with its own queue.
- **Async components** — open any Vue component, including async ones loaded on demand. Heavy modals stay out of your initial bundle and resolve through the same promise.

## Install

```bash
npm install @kolirt/vue-modal reka-ui
# or
yarn add @kolirt/vue-modal reka-ui
# or
pnpm add @kolirt/vue-modal reka-ui
```

`reka-ui` is a peer dependency.

## Quick start

**1. Register groups and install the plugin** (`main.ts`):

The package requires every modal to belong to a registered group. Without registered groups the package can't be used at all — there's no implicit `'default'`.

```ts
import { createApp } from 'vue'
import { createModal, type DefineGroups } from '@kolirt/vue-modal'
import App from './App.vue'

// (TypeScript only) Type-check every `group` reference against this list.
declare module '@kolirt/vue-modal' {
  interface ModalGroupRegistry extends DefineGroups<['default']> {}
}

const app = createApp(App)

app.use(
  createModal({
    groups: {
      // per-group behavior options — see /guide/behavior-options for the full list
      default: {}
    }
  })
)

app.mount('#app')
```

**2. Mount a `<ModalTarget>` for each group** (`App.vue`):

```vue
<script setup lang="ts">
import { ModalTarget, ModalOverlay } from '@kolirt/vue-modal'
</script>

<template>
  <RouterView />

  <ModalTarget group="default">
    <ModalOverlay class="overlay" />
  </ModalTarget>
</template>
```

**3. Write a modal:**

```vue
<!-- ConfirmDialog.vue -->
<script setup lang="ts">
import { ModalRoot, ModalContent, ModalTitle, ModalDescription, useModalContext } from '@kolirt/vue-modal'

defineOptions({ modalGroup: 'default' })

const props = defineProps<{ message: string }>()

const { close, confirm } = useModalContext<boolean>()
</script>

<template>
  <ModalRoot class="root">
    <ModalContent class="card">
      <ModalTitle>Confirm</ModalTitle>
      <ModalDescription>{{ props.message }}</ModalDescription>

      <div class="actions">
        <button @click="close()" class="btn btn--cancel">Cancel</button>
        <button @click="confirm(true)" class="btn btn--confirm">OK</button>
      </div>
    </ModalContent>
  </ModalRoot>
</template>
```

> Styles omitted for brevity. See the [first modal](https://kolirt.github.io/vue-modal/getting-started/first-modal) page for the full version with enter/exit animations.

**4. Open it from anywhere:**

```ts
import { openModal } from '@kolirt/vue-modal'
import ConfirmDialog from './ConfirmDialog.vue'

const ok = await openModal<boolean>(ConfirmDialog, {
  props: { message: 'Delete this project?' }
}).catch(() => false)

if (ok) {
  // user pressed OK
}
```

## Documentation

Everything lives at **[kolirt.github.io/vue-modal](https://kolirt.github.io/vue-modal/)**:

- [Getting started](https://kolirt.github.io/vue-modal/getting-started/introduction) — install, setup, your first modal
- [Concepts](https://kolirt.github.io/vue-modal/concepts/architecture) — architecture, imperative flow, stacking, groups, headless primitives
- [Guide](https://kolirt.github.io/vue-modal/guide/writing-a-modal) — writing modals, props & results, behavior options, styling, `useModal`, multiple targets, async components, TypeScript
- [Recipes](https://kolirt.github.io/vue-modal/recipes/confirm-dialog) — confirm dialog, form with validation, lightbox, command palette, nested flows, global error modal
- [API reference](https://kolirt.github.io/vue-modal/api/functions) — functions, components, composables, plugin, state, types
- [Migration from v1](https://kolirt.github.io/vue-modal/resources/migration-from-v1) · [FAQ](https://kolirt.github.io/vue-modal/resources/faq) · [Troubleshooting](https://kolirt.github.io/vue-modal/resources/troubleshooting) · [Changelog](https://kolirt.github.io/vue-modal/resources/changelog)

## Support

<a href="https://www.buymeacoffee.com/kolirt" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me A Coffee" height="48" />
</a>

## License

[MIT](https://github.com/kolirt/vue-modal/blob/master/LICENSE)

## Other packages

Check out my other projects on my [GitHub profile](https://github.com/kolirt).
