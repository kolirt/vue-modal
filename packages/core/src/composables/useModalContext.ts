import { computed, inject, onBeforeUnmount } from 'vue'

import { modalContextKey, modalGroupConfigKey, type ModalContext } from '../context'
import { getGroupConfig, resolveBehaviorOptions } from '../options'
import { isTopmostInGroup, isTopmost as isTopmostInState } from '../state'
import type { BeforeCloseHandler, CloseFlags, ModalEffectiveOptions } from '../types'

/**
 * Access the current modal's context from **inside** a component opened via
 * {@link openModal} / {@link useModal}. Provides `confirm(data)`, `close()`,
 * `onBeforeClose(guard)`, and reactive `isClosing` / `isTopmost`. Throws if
 * called outside an opened modal.
 */
export function useModalContext<T = unknown>() {
  const injected = inject(modalContextKey, null) as ModalContext<T> | null
  if (!injected) {
    throw new Error(
      '[@kolirt/vue-modal] useModalContext() must be called inside a modal component (opened via openModal/useModal).'
    )
  }

  const context = injected
  const { item } = context

  const groupConfig = inject(modalGroupConfigKey, null)

  const isClosing = computed(() => item.isClosing)
  const isTopmost = computed(() => isTopmostInGroup(item.id, item.group))
  const isTopmostGlobal = computed(() => isTopmostInState(item.id))
  const effectiveOptions = computed<ModalEffectiveOptions>(() => {
    if (!groupConfig) return resolveBehaviorOptions(undefined, getGroupConfig(item.group))
    return {
      interactOutside: groupConfig.interactOutside.value,
      closeOnInteractOutside: groupConfig.closeOnInteractOutside.value,
      closeOnInteractOverlay: groupConfig.closeOnInteractOverlay.value,
      lockBodyScroll: groupConfig.lockBodyScroll.value,
      closeOnEscape: groupConfig.closeOnEscape.value
    }
  })

  function close(opts?: CloseFlags) {
    context.close({ ignoreGuard: opts?.ignoreGuard, instantExit: opts?.instantExit, success: false })
  }

  function confirm(data: T, opts?: CloseFlags) {
    context.confirm(data, opts)
  }

  function onBeforeClose(handler: BeforeCloseHandler) {
    const unregister = context.registerBeforeClose(handler)
    onBeforeUnmount(unregister)
  }

  return {
    id: item.id,
    group: item.group,
    isClosing,
    isTopmost,
    isTopmostGlobal,
    effectiveOptions,
    close,
    confirm,
    onBeforeClose
  }
}
