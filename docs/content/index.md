---
seo:
  title: '@kolirt/vue-modal — Simple Vue 3 modal package'
  description: Easy to use and highly customizable Vue 3 modal package. Open and close modals dynamically from JS/TS, stack cascading modals, and skip the template boilerplate.
---

::::u-page-hero
---
orientation: horizontal
ui:
  container: flex flex-col lg:grid py-10 sm:py-14 lg:py-20 gap-8 sm:gap-y-10 lg:gap-y-12
  body: mt-6
  footer: mt-6
---
  :::live-demo
  :::

#title
Modal magic for Vue3

#description
Open modals from any function, stack them as needed, and style them however you want. No template boilerplate, no manual state — just call and await.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started/introduction
  trailing-icon: i-lucide-arrow-right
  ---
  Get Started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-lucide-flask-conical
  size: xl
  to: /playground
  variant: subtle
  ---
  Try the Playground
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  to: https://github.com/kolirt/vue-modal
  variant: outline
  target: _blank
  ---
  Open on GitHub
  :::

  :::div{class="mt-4 flex w-full flex-col items-start gap-2"}
    ::div{class="text-sm text-(--ui-text-muted)"}
    If this package saved you time, you can buy me a coffee — it keeps me building.
    ::

    ::a{href="https://buymeacoffee.com/kolirt" target="_blank" rel="noopener" class="inline-block"}
    :img{src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me A Coffee" style="height:40px;width:auto" :zoom="false"}
    ::
  :::
::::

::::u-page-section
---
ui:
  container: flex flex-col lg:grid py-10 sm:py-14 lg:py-20 gap-6 sm:gap-10
  body: mt-6
  footer: mt-6
---
#title
Why this library

#description
Less boilerplate, cleaner control flow, and room to bring your own styles.

#features
  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  Open from JS/TS

  #description
  Trigger modals from any function and await the user's response — a single call returns a typed promise with full TypeScript inference for props and result.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code-2
  ---
  #title
  Less template boilerplate

  #description
  Skip placing every modal in your templates and wiring open/close state by hand. Register one mount point and trigger any modal from code with a single call.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Cascading modals

  #description
  Open multiple modals one after another while preserving their state and context. Layer a confirmation on top of a form without losing the form's data.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  Highly customizable

  #description
  Headless primitives with no imposed styles. Bring your own CSS, transitions, and animations — compose modals that fit any design system.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-folder-tree
  ---
  #title
  Modal groups

  #description
  Isolate flows with named groups — the main app stack, confirm dialogs, side panels — each rendering in its own mount point with its own queue.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-puzzle
  ---
  #title
  Async components

  #description
  Open any Vue component, including async ones loaded on demand. Heavy modals stay out of your initial bundle and resolve through the same promise.
  :::
::::

