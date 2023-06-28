import type { Component } from 'vue';
import type { Plugin as Plugin_2 } from 'vue';

declare type AnimationType = 'slideDown' | 'slideUp' | 'slideLeft' | 'slideRight' | 'fade' | 'none';

export declare function closeModal(): void;

export declare function confirmModal(data?: any): void;

export declare function createModal(options?: Options): Plugin_2;

declare type ModalStyle = {
    padding?: string;
    align?: 'top' | 'center';
    'z-index'?: number;
};

export declare function openModal(component: Component, props?: {}): Promise<unknown>;

declare type Options = {
    transitionTime?: number;
    animationType?: AnimationType;
    modalStyle?: ModalStyle;
    overlayStyle?: OverlayStyle;
};

declare type OverlayStyle = {
    'background-color'?: string;
    'z-index'?: number;
};

export { }
