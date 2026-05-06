import type { AllowedComponentProps, Component, VNodeProps } from 'vue'

// Users register groups via `declare module` augmentation.
export interface ModalGroupRegistry {}
export type ModalGroup = keyof ModalGroupRegistry

export type DefineGroups<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: unknown
}

export type ModalGroupsConfig = {
  [K in ModalGroup]?: ModalBehaviorOptions
}

declare module 'vue' {
  interface ComponentCustomOptions {
    modalGroup?: ModalGroup
  }
}

export interface ModalBehaviorOptions {
  enableInteractOutside?: boolean
  disableCloseOnInteractOutside?: boolean
  disableCloseOnInteractOverlay?: boolean
  disableLockBodyScroll?: boolean
  disableCloseOnEscape?: boolean
}

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

export interface OpenModalOptions<C extends Component = Component> {
  props?: ExtractComponentProps<C>
  on?: Record<string, (...args: any[]) => void>
  group?: ModalGroup
  instantEnter?: boolean
}

export interface CloseFlags {
  ignoreGuard?: boolean
  instantExit?: boolean
}

export interface CloseModalOptions<T = unknown> extends CloseFlags {
  success?: boolean
  data?: T
}

export type BeforeCloseHandler = () => boolean | void | Promise<boolean | void>

export interface ModalItem {
  id: number
  group: ModalGroup
  component: Component
  props: Record<string, unknown>
  listeners: Record<string, (...args: any[]) => void>
}

export interface ModalHandle<T = unknown> extends Promise<T> {
  id: number
  group: ModalGroup
  close(opts?: CloseModalOptions<T>): void
  on(event: string, handler: (...args: any[]) => void): void
  off(event: string, handler: (...args: any[]) => void): void
}
