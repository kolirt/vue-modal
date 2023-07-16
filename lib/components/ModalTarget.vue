<script setup lang="ts">
import type {CloseEventData} from '../types'
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {state as stateOptions} from '../options'
import {state as stateData} from '../data'
import {$off, $on} from '../event'
import {Events} from '../types'
import BaseModal from './BaseModal.vue'
import {useLock} from '../composables/useLock'

const transitionTime = stateOptions.animationType !== 'none' ? (stateOptions.transitionTime || 0) : 0
const overlayStyle = computed(() => {
  return {
    ...stateOptions?.overlayStyle,
    'transition': `opacity ${transitionTime}ms ease, visibility ${transitionTime}ms ease`
  }
})

const hide = ref(false)
const activeOverlay = computed(() => stateData.modals.length && !hide.value)

function onClose({forceCloseAll}: CloseEventData) {
  if (stateData.modals.length === 1 && forceCloseAll !== false || forceCloseAll) {
    hide.value = true
    setTimeout(() => {
      hide.value = false
    }, transitionTime)
  }
}

const lock = useLock()

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
  <div class="vue-modals">
    <BaseModal v-for="(item, index) in stateData.modals" :index="index" :item="item" :key="index">
      <component :is="item.component" v-bind="item.props"/>
    </BaseModal>

    <div class="vue-modals-overlay" :style="overlayStyle" :class="{'active': activeOverlay}"></div>
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
