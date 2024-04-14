import type { Component } from "vue";

export enum Events {
	Open = "open",
	Opened = "opened",
	Close = "close",
	Closed = "closed",
}

export type AnimationType =
	| "slideDown"
	| "slideUp"
	| "slideLeft"
	| "slideRight"
	| "fade"
	| "none";
export type ModalStyle = {
	padding?: string;
	align?: "top" | "center";
	"z-index"?: number;
};
export type OverlayStyle = {
	"background-color"?: string;
	"backdrop-filter"?: string;
	"z-index"?: number;
};

export type Options = {
	transitionTime?: number;
	animationType?: AnimationType;
	modalStyle?: ModalStyle;
	overlayStyle?: OverlayStyle;
};

export type OpenModalOptions = {
	group?: "default" | string;
	force?: boolean;
	modalStyle?: ModalStyle;
};

export interface ModalItem {
	id: number;
	component: Component;
	props?: { [key: string]: any };
	options: OpenModalOptions;
}

export type CloseEventData<T = any> = {
	forceCloseAll?: boolean;
} & (
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
	  }
);

export type ClosedEventData<T = any> = {
	id: ModalItem["id"];
} & (
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
	  }
);
