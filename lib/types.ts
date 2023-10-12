import type { Component } from 'vue'

export enum Events {
  Open = 'open',
  Opened = 'opened',
  Close = 'close',
  Closed = 'closed'
}

export type AnimationType = 'slideDown' | 'slideUp' | 'slideLeft' | 'slideRight' | 'fade' | 'none'
export type ModalStyle = {
  padding?: string
  align?: 'top' | 'center'
  'z-index'?: number
}
export type OverlayStyle = {
  'background-color'?: string
  'z-index'?: number
}

export type Options = {
  transitionTime?: number
  animationType?: AnimationType
  modalStyle?: ModalStyle
  overlayStyle?: OverlayStyle
}

export type OpenModalOptions = {
  force?: boolean
  modalStyle?: ModalStyle
}

export type CloseEventData = {
  success: boolean
  forceCloseAll?: boolean
  data?: any
}

export interface ModalItem {
  component: Component
  props?: {} | []
  options?: OpenModalOptions
}
