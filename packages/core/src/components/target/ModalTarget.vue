<script setup lang="ts">
import { computed, provide, ref } from 'vue'

import { requestClose } from '../../actions'
import { usePressOutside } from '../../composables/usePressOutside'
import { useScrollLock } from '../../composables/useScrollLock'
import { useStackTransition } from '../../composables/useStackTransition'
import { modalGroupConfigKey } from '../../context'
import { getGroupConfig, resolveBehaviorOptions } from '../../options'
import { isTopmost, state } from '../../state'
import type { ModalBehaviorOptions } from '../../types'
import ModalSlot from './ModalSlot.vue'
import type { ModalTargetProps } from './interface'

const props = withDefaults(defineProps<ModalTargetProps>(), {
  enableInteractOutside: undefined,
  disableCloseOnInteractOutside: undefined,
  disableCloseOnInteractOverlay: undefined,
  disableLockBodyScroll: undefined,
  disableCloseOnEscape: undefined
})

const regionRef = ref<HTMLElement | null>(null)

const items = computed(() => state.modals.filter((m) => m.group === props.group))

const hasActive = computed(() => items.value.some((m) => m.present))

const intendedTopId = computed(() => {
  for (let i = items.value.length - 1; i >= 0; i--) {
    if (items.value[i].present) return items.value[i].id
  }
  return null
})

const ownsGlobalTop = computed(() => intendedTopId.value !== null && isTopmost(intendedTopId.value))

const { visibleTopId } = useStackTransition(intendedTopId, regionRef)

const topInstantEnter = computed(() => {
  const top = items.value[items.value.length - 1]
  return !!top?.instantEnter
})

const groupOptions = computed<ModalBehaviorOptions>(() => ({
  enableInteractOutside: props.enableInteractOutside,
  disableCloseOnInteractOutside: props.disableCloseOnInteractOutside,
  disableCloseOnInteractOverlay: props.disableCloseOnInteractOverlay,
  disableLockBodyScroll: props.disableLockBodyScroll,
  disableCloseOnEscape: props.disableCloseOnEscape
}))

const effectiveOptions = computed(() => resolveBehaviorOptions(groupOptions.value, getGroupConfig(props.group)))

function closeTopmost() {
  if (!ownsGlobalTop.value) return
  const top = [...items.value].reverse().find((m) => m.present)
  if (top) requestClose(top, {})
}

useScrollLock(() => hasActive.value && effectiveOptions.value.lockBodyScroll)

usePressOutside({
  element: regionRef,
  enabled: () => hasActive.value && effectiveOptions.value.closeOnInteractOutside,
  onTrigger: closeTopmost
})

provide(modalGroupConfigKey, {
  interactOutside: computed(() => effectiveOptions.value.interactOutside),
  closeOnInteractOutside: computed(() => effectiveOptions.value.closeOnInteractOutside),
  closeOnInteractOverlay: computed(() => effectiveOptions.value.closeOnInteractOverlay),
  closeOnEscape: computed(() => effectiveOptions.value.closeOnEscape),
  lockBodyScroll: computed(() => effectiveOptions.value.lockBodyScroll),
  region: regionRef,
  visibleTopId,
  hasActive,
  topInstantEnter
})
</script>

<template>
  <div ref="regionRef" data-modal-region>
    <slot />

    <ModalSlot v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<style>
/* :where() keeps specificity at 0 so user CSS overrides without !important. */
:where([data-modal-region]) {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  width: 100dvw;
  height: 100dvh;
  pointer-events: none;
}
</style>
