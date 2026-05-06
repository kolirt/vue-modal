import { nextTick, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

// Sequential stack swap: hide current top, await exit via getAnimations().finished, promote pending.
export function useStackTransition(
  intendedTopId: MaybeRefOrGetter<number | null>,
  regionRef: Ref<HTMLElement | null>
): {
  visibleTopId: Ref<number | null>
} {
  const visibleTopId = ref<number | null>(null)
  const pendingTopId = ref<number | null>(null)

  // Bumped per swap; stale waiters bail before advancing.
  let generation = 0

  function advance() {
    if (visibleTopId.value !== null) return
    if (pendingTopId.value === null) return
    visibleTopId.value = pendingTopId.value
    pendingTopId.value = null
  }

  async function waitForExitThenAdvance(myGen: number) {
    // nextTick: Vue patches data-state. rAF: browser registers triggered
    // animations — getAnimations() is empty before this frame.
    await nextTick()
    await new Promise<void>((r) => requestAnimationFrame(() => r()))
    if (myGen !== generation) return

    const region = regionRef.value
    if (!region) {
      advance()
      return
    }

    const animations: Animation[] = []
    // Scope to outgoing elements only (data-state="closed"). Animations on the
    // entering modal or overlay aren't part of "exit done" — don't await them.
    for (const c of region.querySelectorAll<HTMLElement>('[data-state="closed"]')) {
      animations.push(...c.getAnimations({ subtree: false }))
    }

    if (animations.length === 0) {
      advance()
      return
    }

    await Promise.allSettled(animations.map((a) => a.finished))
    if (myGen !== generation) return
    advance()
  }

  watch(
    () => toValue(intendedTopId),
    (intended) => {
      if (intended === visibleTopId.value) {
        pendingTopId.value = null
        return
      }
      if (visibleTopId.value === null) {
        if (pendingTopId.value === null) {
          visibleTopId.value = intended
        } else {
          pendingTopId.value = intended
        }
        return
      }
      pendingTopId.value = intended
      visibleTopId.value = null
      generation++
      waitForExitThenAdvance(generation)
    },
    { immediate: true }
  )

  return { visibleTopId }
}
