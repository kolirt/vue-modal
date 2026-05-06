<script setup lang="ts">
import { provide } from 'vue'

import { finalizeModal, requestClose } from '../../actions'
import { modalContextKey, type ModalContext } from '../../context'
import type { InternalModalItem } from '../../state'

const props = defineProps<{
  item: InternalModalItem
}>()

const item = props.item

const context: ModalContext = {
  item,
  close(opts) {
    requestClose(item, { ...(opts || {}), success: opts?.success ?? false })
  },
  confirm(data, opts) {
    requestClose(item, { success: true, data, ignoreGuard: opts?.ignoreGuard, instantExit: opts?.instantExit })
  },
  registerBeforeClose(handler) {
    item.beforeCloseGuards.push(handler)
    return () => {
      const i = item.beforeCloseGuards.indexOf(handler)
      if (i >= 0) item.beforeCloseGuards.splice(i, 1)
    }
  },
  finalize() {
    finalizeModal(item.id)
  }
}

// `my-event` → `onMyEvent`, `update:modelValue` → `onUpdate:modelValue`.
function toListenerProp(event: string) {
  const camel = event.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
  return `on${camel.charAt(0).toUpperCase()}${camel.slice(1)}`
}

const listenerProps: Record<string, (...args: any[]) => void> = {}
for (const event of Object.keys(item.listeners)) {
  listenerProps[toListenerProp(event)] = item.listeners[event]
}

provide(modalContextKey, context)
</script>

<template>
  <component :is="item.component" v-bind="{ ...item.props, ...listenerProps }" />
</template>
