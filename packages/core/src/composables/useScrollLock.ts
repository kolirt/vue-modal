import { onScopeDispose, toValue, watch, type MaybeRefOrGetter } from 'vue'

import { useBodyOverflowLock, useBodyPaddingRightLock } from './useBodyStyleLock'

// Don't touch body.pointer-events — reka-ui's DismissableLayer owns it in modal mode.
// Order matters: measure & compensate scrollbar BEFORE locking overflow.
// `body.overflow: hidden` propagates to <html>, hiding the scrollbar — at which point
// `innerWidth - documentElement.clientWidth` reads 0 and compensation is skipped.
export function useScrollLock(enabled: MaybeRefOrGetter<boolean>) {
  useBodyPaddingRightLock(enabled)
  useBodyOverflowLock(enabled)
  useIosScrollLock(enabled)
}

// `body.overflow: hidden` does NOT prevent touch scrolling on iOS Safari.
// The fix is to listen for `touchmove` and call preventDefault, but only when
// the touch is NOT inside a scrollable element (so users can still scroll modal content).
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1)
  )
}

function hasScrollableAncestor(start: Element | null): boolean {
  let el = start
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el)
    const oy = style.overflowY
    const ox = style.overflowX
    if (
      oy === 'scroll' ||
      ox === 'scroll' ||
      (oy === 'auto' && el.scrollHeight > el.clientHeight) ||
      (ox === 'auto' && el.scrollWidth > el.clientWidth)
    ) {
      return true
    }
    el = el.parentElement
  }
  return false
}

function onIosTouchMove(e: TouchEvent) {
  // Allow pinch zoom.
  if (e.touches.length > 1) return
  const target = e.target instanceof Element ? e.target : ((e.target as Node | null)?.parentElement ?? null)
  // Allow scrolling inside scrollable descendants of the modal.
  if (hasScrollableAncestor(target)) return
  if (e.cancelable) e.preventDefault()
}

let iosActiveLocks = 0

function applyIosLock() {
  if (typeof window === 'undefined') return
  if (!isIOS()) return
  if (iosActiveLocks === 0) {
    document.addEventListener('touchmove', onIosTouchMove, { passive: false })
  }
  iosActiveLocks++
}

function releaseIosLock() {
  if (typeof window === 'undefined') return
  if (!isIOS()) return
  if (iosActiveLocks === 0) return
  iosActiveLocks--
  if (iosActiveLocks === 0) {
    document.removeEventListener('touchmove', onIosTouchMove)
  }
}

function useIosScrollLock(enabled: MaybeRefOrGetter<boolean>) {
  let owned = false
  watch(
    () => toValue(enabled),
    (v) => {
      if (v && !owned) {
        owned = true
        applyIosLock()
      } else if (!v && owned) {
        owned = false
        releaseIosLock()
      }
    },
    { immediate: true }
  )
  onScopeDispose(() => {
    if (owned) releaseIosLock()
  })
}
