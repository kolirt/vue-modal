import { computed, markRaw, reactive } from 'vue'

import type { ModalItem } from './types'

export const state = reactive<{
  modals: ModalItem[]
}>({
  modals: []
})

export const lastModal = computed(() => state.modals[state.modals.length - 1])

export const modals = computed(() => state.modals)
export const isOpened = computed(() => state.modals.length > 0)

export function addModal(data: ModalItem) {
  data.options.group = data.options.group || 'default'
  state.modals.push(markRaw(data))
}

export function removeModal() {
  state.modals.pop()
}
