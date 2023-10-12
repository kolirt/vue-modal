import type { Component } from 'vue'
import { computed, markRaw, reactive } from 'vue'

import type { ModalItem, OpenModalOptions } from './types'

export const state = reactive<{
  modals: ModalItem[]
}>({
  modals: []
})

export const modals = computed(() => state.modals)
export const isOpened = computed(() => state.modals.length > 0)

export function addModal(component: Component, props?: {}, options?: OpenModalOptions) {
  state.modals.push(markRaw({ component, props, options }))
}

export function removeModal() {
  state.modals.pop()
}
