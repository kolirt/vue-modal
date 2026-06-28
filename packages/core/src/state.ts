import { computed, markRaw, reactive } from 'vue'

import { emitModalOpen } from './events'
import type { BeforeCloseHandler, CloseModalOptions, ModalGroup, ModalItem } from './types'

export interface InternalModalItem<T = unknown> extends ModalItem {
  present: boolean
  isClosing: boolean
  instantEnter: boolean
  resolve: (data: T) => void
  reject: (reason?: unknown) => void
  resolved: boolean
  beforeCloseGuards: BeforeCloseHandler[]
  pendingClose: CloseModalOptions<T> | null
}

interface ModalState {
  modals: InternalModalItem[]
}

export const state: ModalState = reactive<ModalState>({
  modals: []
})

/** Reactive list of all open modals (read-only snapshot of the stack). */
export const modals = computed(() => state.modals as ModalItem[])
/** Reactive boolean: is any modal currently open. */
export const isOpened = computed(() => state.modals.length > 0)

/** Reactive list of open modals in `group` (top of stack is last). */
export function groupModals(group: ModalGroup) {
  return computed(() => state.modals.filter((m) => m.group === group) as ModalItem[])
}

/** Reactive boolean: is any modal open in `group`. */
export function isGroupOpen(group: ModalGroup) {
  return computed(() => state.modals.some((m) => m.group === group))
}

export function addModal(item: InternalModalItem) {
  item.component = markRaw(item.component)
  state.modals.push(item)
  emitModalOpen(item)
}

export function removeModalById(id: number) {
  const idx = state.modals.findIndex((m) => m.id === id)
  if (idx >= 0) state.modals.splice(idx, 1)
}

export function findModalById(id: number) {
  return state.modals.find((m) => m.id === id)
}

export function isTopmost(id: number) {
  const last = state.modals[state.modals.length - 1]
  return last !== undefined && last.id === id
}

export function isTopmostInGroup(id: number, group: ModalGroup) {
  for (let i = state.modals.length - 1; i >= 0; i--) {
    if (state.modals[i].group === group) return state.modals[i].id === id
  }
  return false
}
