import { reactive } from 'vue'

import type { Options } from './types'

export const state = reactive<Options>({
  transitionTime: 200,
  animationType: 'slideDown',
  modalStyle: {
    padding: undefined,
    align: 'center',
    'z-index': 201
  },
  overlayStyle: {
    'background-color': 'rgba(0, 0, 0, 0.9)',
    'z-index': 200
  }
})

export function setOptions(newOptions: Options): void {
  if (newOptions?.transitionTime) {
    state.transitionTime = newOptions.transitionTime
  }

  if (newOptions?.animationType) {
    state.animationType = newOptions.animationType
  }

  if (newOptions?.modalStyle) {
    if (newOptions.modalStyle?.padding) {
      // @ts-ignore
      state.modalStyle.padding = newOptions.modalStyle.padding
    }

    if (newOptions.modalStyle?.align) {
      // @ts-ignore
      state.modalStyle.align = newOptions.modalStyle.align
    }

    if (newOptions.modalStyle?.['z-index']) {
      // @ts-ignore
      state.modalStyle['z-index'] = newOptions.modalStyle['z-index']
    }
  }

  if (newOptions?.overlayStyle?.['z-index']) {
    // @ts-ignore
    state.overlayStyle['z-index'] = newOptions.overlayStyle['z-index']
  }

  if (newOptions?.overlayStyle?.['background-color']) {
    // @ts-ignore
    state.overlayStyle['background-color'] = newOptions.overlayStyle['background-color']
  }
}
