<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useLock } from '../composables/useLock'
import { lastModal, state as stateData } from '../data'
import { $off, $on } from '../event'
import { state as stateOptions } from '../options'
import type { CloseEventData, OpenModalOptions } from '../types'
import { Events } from '../types'
import BaseModal from './BaseModal.vue'

const props = withDefaults(
  defineProps<{
    group?: OpenModalOptions['group']
    withoutOverlay?: boolean
  }>(),
  {
    group: 'default',
    withoutOverlay: false
  }
)

const lock = useLock()

const transitionTime = stateOptions.animationType !== 'none' ? stateOptions.transitionTime || 0 : 0
const overlayStyle = computed(() => {
  return {
    ...(stateOptions?.overlayStyle || {}),
    transition: `opacity ${transitionTime}ms ease, visibility ${transitionTime}ms ease`
  }
})

const hide = ref(false)

const currentModals = computed(() => {
  return stateData.modals.filter((item) => item.options.group === props.group)
})

const activeOverlay = computed(() => {
  return currentModals.value.length && !hide.value && lastModal.value.options.group === props.group
})

function onClose({ forceCloseAll }: CloseEventData) {
  if ((currentModals.value.length === 1 && forceCloseAll !== false) || forceCloseAll) {
    hide.value = true
    setTimeout(() => {
      hide.value = false
    }, transitionTime)
  }
}

function onClosed() {
  lock.toggleLock(false)
}

function onOpen() {
  lock.toggleLock(true)
}

onMounted(() => {
  $on(Events.Close, onClose)
  $on(Events.Closed, onClosed)
  $on(Events.Open, onOpen)
})

onBeforeUnmount(() => {
  $off(Events.Close, onClose)
  $off(Events.Closed, onClosed)
  $off(Events.Open, onOpen)
})
</script>

<template>
  <div :class="[`vue-modals-${props.group}-group`]" class="vue-modals">
    <BaseModal v-for="item in currentModals" :item="item" :key="`${props.group}-${item.id}`">
      <template #default="{ show, hide }">
        <component
          :is="item.component"
          :modal="item"
          :data-state="hide || (!hide && !show) ? 'closed' : show ? 'open' : undefined"
          v-bind="item.props"
        />
      </template>
    </BaseModal>

    <div
      v-if="!withoutOverlay"
      :style="overlayStyle"
      :class="{ active: activeOverlay }"
      class="vue-modals-overlay"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.vue-modals {
  width: 0;

  :deep(*) {
    box-sizing: border-box;
  }
}

.vue-modals-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}
</style>
