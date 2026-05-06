<script setup lang="ts">
import { Presence } from 'reka-ui'
import { inject } from 'vue'

import { modalGroupConfigKey } from '../../context'

defineOptions({ inheritAttrs: false })

const groupConfig = inject(modalGroupConfigKey, null)
if (!groupConfig) {
  throw new Error('[@kolirt/vue-modal] <ModalOverlay> must be used inside <ModalTarget>.')
}
</script>

<template>
  <Presence :present="groupConfig.hasActive.value">
    <div
      :data-state="groupConfig.hasActive.value ? 'open' : 'closed'"
      :data-instant="groupConfig.topInstantEnter.value ? '' : null"
      data-modal-overlay
      v-bind="$attrs"
    />
  </Presence>
</template>

<style>
:where([data-modal-overlay]) {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Suppress overlay enter animation when topmost modal opened with `instantEnter`.
   Scoped to data-state="open" so the close animation still runs. */
:where([data-modal-overlay][data-instant][data-state='open']) {
  animation: none !important;
  transition: none !important;
}
</style>
