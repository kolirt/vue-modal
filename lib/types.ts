export enum Events {
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
}

export type CloseEventData = {
    success: boolean
    forceCloseAll?: boolean
    data?: any
}