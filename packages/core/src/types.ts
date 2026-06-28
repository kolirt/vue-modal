import type { AllowedComponentProps, Component, VNodeProps } from 'vue'

// Users register groups via `declare module` augmentation.
/** Augment via `declare module '@kolirt/vue-modal'` to register typed group names. */
export interface ModalGroupRegistry {}
export type ModalGroup = keyof ModalGroupRegistry

export type DefineGroups<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: unknown
}

/** Map of group name → {@link ModalBehaviorOptions}, passed to `createModal({ groups })`. */
export type ModalGroupsConfig = {
  [K in ModalGroup]?: ModalBehaviorOptions
}

declare module 'vue' {
  interface ComponentCustomOptions {
    modalGroup?: ModalGroup
  }
}

/** Per-group behavior toggles seeded via `createModal({ groups })`. */
export interface ModalBehaviorOptions {
  enableInteractOutside?: boolean
  disableCloseOnInteractOutside?: boolean
  disableCloseOnInteractOverlay?: boolean
  disableLockBodyScroll?: boolean
  disableCloseOnEscape?: boolean
}

/** Resolved per-modal behavior (after merging group defaults), as read via `useModalContext().effectiveOptions`. */
export interface ModalEffectiveOptions {
  interactOutside: boolean
  closeOnInteractOutside: boolean
  closeOnInteractOverlay: boolean
  lockBodyScroll: boolean
  closeOnEscape: boolean
}

export type ExtractComponentProps<C> = C extends new () => { $props: infer P }
  ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
  : Record<string, unknown>

/** Options for {@link openModal} / {@link replaceModal}. `group` is required unless the component declares `modalGroup`. */
export interface OpenModalOptions<C extends Component = Component> {
  props?: ExtractComponentProps<C>
  on?: Record<string, (...args: any[]) => void>
  group?: ModalGroup
  instantEnter?: boolean
}

/** Flags shared by close operations: `ignoreGuard` skips `beforeClose` guards; `instantExit` skips the exit animation. */
export interface CloseFlags {
  ignoreGuard?: boolean
  instantExit?: boolean
}

/** Options when closing a modal: `success` + `data` (resolve), or flags `ignoreGuard` / `instantExit`. */
export interface CloseModalOptions<T = unknown> extends CloseFlags {
  success?: boolean
  data?: T
}

export type BeforeCloseHandler = () => boolean | void | Promise<boolean | void>

/** Public shape of a modal in the stack: `id`, `group`, `component`, `props`, `listeners`. */
export interface ModalItem {
  id: number
  group: ModalGroup
  component: Component
  props: Record<string, unknown>
  listeners: Record<string, (...args: any[]) => void>
}

/** Awaitable handle returned by {@link openModal}: resolves with the modal result, rejects with {@link ModalClosedError}. */
export interface ModalHandle<T = unknown> extends Promise<T> {
  id: number
  group: ModalGroup
  close(opts?: CloseModalOptions<T>): void
  on(event: string, handler: (...args: any[]) => void): void
  off(event: string, handler: (...args: any[]) => void): void
}
