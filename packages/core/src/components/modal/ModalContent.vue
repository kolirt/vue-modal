<script setup lang="ts">
import { DialogContent, Presence } from 'reka-ui'
import { inject } from 'vue'

import { modalRootContextKey } from '../../context'

defineOptions({ inheritAttrs: false })

const rootContext = inject(modalRootContextKey)
if (!rootContext) {
  throw new Error('[@kolirt/vue-modal] <ModalContent> must be used inside <ModalRoot>.')
}
</script>

<template>
  <!-- Visible modal card + enter/exit transitions. Required inside <ModalRoot>; omitting it leaves the modal blank/stuck. -->
  <Presence @after-leave="rootContext.onAfterLeave" :present="rootContext.present.value">
    <DialogContent
      @escape-key-down="rootContext.onEscape"
      @pointer-down-outside="rootContext.onInteractOverlay"
      @focus-outside="rootContext.onFocusOutside"
      :data-state="rootContext.dataState.value"
      :data-instant="rootContext.instantEnter.value ? '' : null"
      data-modal-content
      v-bind="$attrs"
    >
      <slot />
    </DialogContent>
  </Presence>
</template>

<style>
/* Suppress enter animation when `instantEnter` was requested.
   Scoped to data-state="open" so the exit animation still runs on close. */
:where([data-modal-content][data-instant][data-state='open']) {
  animation: none !important;
  transition: none !important;
}
</style>
