import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { InternalModalItem } from './state'
import type { BeforeCloseHandler, CloseFlags, CloseModalOptions } from './types'

export interface ModalRootContext {
  present: ComputedRef<boolean>
  dataState: ComputedRef<'open' | 'closed'>
  instantEnter: ComputedRef<boolean>
  onEscape: (e: Event) => void
  onInteractOverlay: (e: Event) => void
  onFocusOutside: (e: Event) => void
  onAfterLeave: () => void
}

export const modalRootContextKey: InjectionKey<ModalRootContext> = Symbol('modal-root-context')

export interface ModalContext<T = unknown> {
  item: InternalModalItem<T>
  close: (opts?: CloseModalOptions<T>) => void
  confirm: (data: T, opts?: CloseFlags) => void
  registerBeforeClose: (handler: BeforeCloseHandler) => () => void
  finalize: () => void
}

export const modalContextKey: InjectionKey<ModalContext<any>> = Symbol('modal-context')

export interface ModalGroupConfig {
  interactOutside: Ref<boolean>
  closeOnInteractOutside: Ref<boolean>
  closeOnInteractOverlay: Ref<boolean>
  closeOnEscape: Ref<boolean>
  lockBodyScroll: Ref<boolean>
  region: Ref<HTMLElement | null>
  // null while a stack swap is mid-flight; intentionally distinct from `hasActive`.
  visibleTopId: Ref<number | null>
  hasActive: Ref<boolean>
  // True when the visible-top modal in this group was opened with `instantEnter: true`.
  // Used by `<ModalOverlay>` to skip its own enter animation in sync.
  topInstantEnter: Ref<boolean>
}

export const DATA_STATE_OPEN = 'open' as const
export const DATA_STATE_CLOSED = 'closed' as const
export type DataState = typeof DATA_STATE_OPEN | typeof DATA_STATE_CLOSED

export const modalGroupConfigKey: InjectionKey<ModalGroupConfig> = Symbol('modal-group-config')
