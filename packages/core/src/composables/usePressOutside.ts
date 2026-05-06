import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

// Both pointerdown and pointerup must land outside; capture phase so stopPropagation can't hide events.
// Pointer events cover mouse, touch, and pen — unlike mousedown/mouseup which skip touch on mobile.
export function usePressOutside(options: {
  element: MaybeRefOrGetter<HTMLElement | null>
  enabled: MaybeRefOrGetter<boolean>
  onTrigger: () => void
}) {
  const startedOutside = ref(false)

  function isOutside(target: EventTarget | null): boolean {
    const el = toValue(options.element)
    if (!el || !(target instanceof Node)) return false
    return !el.contains(target)
  }

  function onPointerDown(e: PointerEvent) {
    startedOutside.value = isOutside(e.target)
  }

  function onPointerUp(e: PointerEvent) {
    const wasOutside = startedOutside.value
    startedOutside.value = false
    if (!wasOutside) return
    if (!isOutside(e.target)) return
    options.onTrigger()
  }

  watchEffect((onCleanup) => {
    if (typeof window === 'undefined') return
    if (!toValue(options.enabled)) return
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('pointerup', onPointerUp, true)
    onCleanup(() => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('pointerup', onPointerUp, true)
    })
  })
}
