import type { AllowedComponentProps } from 'vue';
import type { Component } from 'vue';
import type { ComponentCustomProps } from 'vue';
import type { ComponentOptionsMixin } from 'vue';
import type { ComputedRef } from 'vue';
import type { DefineComponent } from 'vue';
import type { ExtractPropTypes } from 'vue';
import type { Plugin as Plugin_2 } from 'vue';
import type { Ref } from 'vue';
import type { VNodeProps } from 'vue';

export declare function $off(event: Events, callback: (...args: any) => void): void;

export declare function $on(event: Events, callback: (...args: any) => void): void;

declare type AnimationType = 'slideDown' | 'slideUp' | 'slideLeft' | 'slideRight' | 'fade' | 'none';

export declare function closeAllModals(forceCloseAll?: boolean): Promise<void>;

export declare function closeModal(): Promise<void>;

export declare function confirmModal(data?: any): Promise<any>;

export declare function createModal(options?: Options): Plugin_2;

export declare enum Events {
    Open = "open",
    Opened = "opened",
    Close = "close",
    Closed = "closed"
}

export declare const isOpened: ComputedRef<boolean>;

declare type ModalStyle = {
    padding?: string;
    align?: 'top' | 'center';
    'z-index'?: number;
};

export declare const ModalTarget: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{}>>, {}, {}>;

export declare function openModal(component: Component, props?: {}, options?: OpenModalOptions): Promise<unknown>;

declare type OpenModalOptions = {
    force?: boolean;
};

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

export declare function useLock(): {
    paddingSize: Ref<number | null>;
    toggleLock: (value: boolean) => void;
};

export { }
