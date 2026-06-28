import { computed, getCurrentScope, onScopeDispose, ref, type Component } from 'vue'

import { openModal } from '../actions'
import { isTopmost } from '../state'
import type { CloseFlags, ModalHandle, OpenModalOptions } from '../types'

/** Defaults for {@link useModal}; extends {@link OpenModalOptions} with `closeOnUnmount`. */
export interface UseModalDefaults<C extends Component> extends OpenModalOptions<C> {
  closeOnUnmount?: boolean
}

/**
 * Component-scoped wrapper around {@link openModal}. Binds default props/`on`
 * handlers and exposes reactive `isOpen` / `isTop`. By default the modal is
 * closed automatically when the owning scope unmounts (`closeOnUnmount`).
 */
export function useModal<T = unknown, C extends Component = Component>(component: C, defaults?: UseModalDefaults<C>) {
  const closeOnUnmount = defaults?.closeOnUnmount ?? true

  const persistent: Record<string, Set<(...args: any[]) => void>> = {}
  if (defaults?.on) {
    for (const [event, fn] of Object.entries(defaults.on)) {
      if (typeof fn === 'function') (persistent[event] ||= new Set()).add(fn)
    }
  }

  let currentHandle: ModalHandle<T> | null = null
  const instanceId = ref<number | null>(null)
  const isOpen = computed(() => instanceId.value !== null)
  const isTop = computed(() => instanceId.value !== null && isTopmost(instanceId.value))

  function on(event: string, handler: (...args: any[]) => void) {
    ;(persistent[event] ||= new Set()).add(handler)
  }

  function off(event: string, handler: (...args: any[]) => void) {
    persistent[event]?.delete(handler)
  }

  function buildOnMap(callOn?: Record<string, (...args: any[]) => void>) {
    const out: Record<string, (...args: any[]) => void> = {}
    for (const [event, set] of Object.entries(persistent)) {
      if (set.size > 0) out[event] = (...args) => set.forEach((fn) => fn(...args))
    }
    if (callOn) {
      for (const [event, fn] of Object.entries(callOn)) {
        if (typeof fn !== 'function') continue
        const prev = out[event]
        out[event] = prev
          ? (...args) => {
              prev(...args)
              fn(...args)
            }
          : fn
      }
    }
    return out
  }

  async function open(options?: OpenModalOptions<C>) {
    const mergedProps = {
      ...((defaults?.props as Record<string, unknown>) || {}),
      ...((options?.props as Record<string, unknown>) || {})
    } as OpenModalOptions<C>['props']
    const merged: OpenModalOptions<C> = {
      ...defaults,
      ...options,
      props: mergedProps,
      on: buildOnMap(options?.on)
    }

    const handle = openModal<T, C>(component, merged)
    currentHandle = handle
    instanceId.value = handle.id
    try {
      return await handle
    } finally {
      if (currentHandle === handle) {
        currentHandle = null
        instanceId.value = null
      }
    }
  }

  function close(opts?: CloseFlags) {
    currentHandle?.close({ ignoreGuard: opts?.ignoreGuard, instantExit: opts?.instantExit, success: false })
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (closeOnUnmount) currentHandle?.close({ ignoreGuard: true, instantExit: true, success: false })
      currentHandle = null
      instanceId.value = null
    })
  }

  return {
    open,
    close,
    on,
    off,
    isOpen,
    isTop,
    instanceId
  }
}
