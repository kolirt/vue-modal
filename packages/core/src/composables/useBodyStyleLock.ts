import { onScopeDispose, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function createBodyStyleLock(
  prop: 'overflow' | 'paddingRight' | 'userSelect',
  lockedValue: string | (() => string)
) {
  let activeLocks = 0
  let original: string | null = null

  function applyLock() {
    if (typeof window === 'undefined') return
    if (activeLocks === 0) {
      original = document.body.style[prop] || ''
      document.body.style[prop] = typeof lockedValue === 'function' ? lockedValue() : lockedValue
    }
    activeLocks++
  }

  function releaseLock() {
    if (typeof window === 'undefined') return
    if (activeLocks === 0) return
    activeLocks--
    if (activeLocks === 0) {
      document.body.style[prop] = original ?? ''
      original = null
    }
  }

  return function useBodyStyleLock(enabled: MaybeRefOrGetter<boolean>) {
    let owned = false

    watch(
      () => toValue(enabled),
      (v) => {
        if (v && !owned) {
          owned = true
          applyLock()
        } else if (!v && owned) {
          owned = false
          releaseLock()
        }
      },
      { immediate: true }
    )

    onScopeDispose(() => {
      if (owned) releaseLock()
    })
  }
}

export const useBodyOverflowLock = createBodyStyleLock('overflow', 'hidden')
export const useBodyUserSelectLock = createBodyStyleLock('userSelect', 'none')
export const useBodyPaddingRightLock = createBodyStyleLock('paddingRight', () => {
  const width = window.innerWidth - document.documentElement.clientWidth
  return width > 0 ? `${width}px` : ''
})
