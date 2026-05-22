<script setup lang="ts">
import { DialogRoot } from 'reka-ui'
import { computed, inject, provide } from 'vue'

import {
  DATA_STATE_CLOSED,
  DATA_STATE_OPEN,
  type DataState,
  modalContextKey,
  modalGroupConfigKey,
  modalRootContextKey,
  type ModalContext
} from '../../context'
import { isTopmost } from '../../state'

defineOptions({ inheritAttrs: false })

const injected = inject(modalContextKey)
if (!injected) {
  throw new Error('[@kolirt/vue-modal] <ModalRoot> must be used inside a modal opened via openModal/useModal.')
}
const context: ModalContext = injected

const injectedGroup = inject(modalGroupConfigKey, null)
if (!injectedGroup) {
  throw new Error('[@kolirt/vue-modal] <ModalRoot> must be rendered inside a <ModalTarget> tree.')
}
const groupConfig = injectedGroup

const item = context.item

const present = computed(() => item.present)

const dataState = computed<DataState>(() => {
  if (!item.present) return DATA_STATE_CLOSED
  if (groupConfig.visibleTopId.value !== item.id) return DATA_STATE_CLOSED
  return DATA_STATE_OPEN
})

// Stays for the lifetime of the modal — CSS scopes suppression to data-state="open"
// so exit animations still run when the state flips to "closed".
const instantEnter = computed(() => item.instantEnter)

function onEscape(e: Event) {
  // Reka fires escape on every open layer — only global top reacts.
  if (!isTopmost(item.id) || !groupConfig.closeOnEscape.value) {
    e.preventDefault()
    return
  }
  context.close()
}

function onInteractOverlay(e: Event) {
  // Reka fires `pointer-down-outside` for any click outside ModalContent —
  // including clicks outside the entire region. Those belong to the
  // `closeOnInteractOutside` gesture (handled by usePressOutside in ModalTarget),
  // not to this overlay gesture. Filter them out so the two flags stay independent.
  const region = groupConfig.region.value
  const detail = (e as CustomEvent<{ originalEvent?: Event }>).detail
  const target = (detail?.originalEvent?.target ?? (e as Event).target) as Node | null
  if (region && target instanceof Node && !region.contains(target)) {
    e.preventDefault()
    return
  }
  if (!isTopmost(item.id) || !groupConfig.closeOnInteractOverlay.value) {
    e.preventDefault()
    return
  }
  context.close()
}

function onFocusOutside(e: Event) {
  e.preventDefault()
}

function onAfterLeave() {
  context.finalize()
}

function onDialogUpdateOpen(open: boolean) {
  if (!open) context.close()
}

provide(modalRootContextKey, {
  present,
  dataState,
  instantEnter,
  onEscape,
  onInteractOverlay,
  onFocusOutside,
  onAfterLeave
})
</script>

<template>
  <DialogRoot @update:open="onDialogUpdateOpen" :open="true" :modal="!groupConfig.interactOutside.value">
    <div data-modal-root v-bind="$attrs">
      <slot />
    </div>
  </DialogRoot>
</template>

<style>
:where([data-modal-root]) {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}
</style>
