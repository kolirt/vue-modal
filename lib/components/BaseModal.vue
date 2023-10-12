<script setup lang="ts">
import { PropType, computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { closeModal } from '../actions'
import { state as stateData } from '../data'
import { $emit, $off, $on } from '../event'
import { state as stateOptions } from '../options'
import type { ModalItem } from '../types'
import { Events } from '../types'
import isEsc from '../utils/isEsc'

const props = defineProps({
  index: { type: Number, required: true },
  item: { type: Object as PropType<ModalItem> }
})

const show = ref(false)
const hide = computed(() => props.index !== stateData.modals.length - 1)

const transitionTime = computed(() => {
  return stateOptions.animationType !== 'none' ? stateOptions.transitionTime || 0 : 0
})
const getStyle = computed(() => {
  return {
    padding: props.item?.options?.modalStyle?.padding ?? stateOptions.modalStyle?.padding,
    'z-index': props.item?.options?.modalStyle?.['z-index'] ?? stateOptions.modalStyle?.['z-index'],
    transition: `opacity ${transitionTime.value}ms ease, visibility ${transitionTime.value}ms ease, transform ${transitionTime.value}ms ease`
  }
})
const getClasses = computed(() => {
  return [
    {
      'vue-modal--active': show.value,
      'vue-modal--hide': hide.value
    },
    `vue-modal--${props.item?.options?.modalStyle?.align ?? stateOptions.modalStyle?.align}`,
    `vue-modal--${stateOptions.animationType}`
  ]
})

function onClose(data: any) {
  if (stateData.modals.length - 1 === props.index) {
    show.value = false
    setTimeout($emit, transitionTime.value, Events.Closed, {
      index: props.index,
      success: data.success,
      data: data.data
    })
  }
}

function onEsc(e: Event) {
  if (isEsc(e) && stateData.modals.length - 1 === props.index) {
    closeModal()
  }
}

onMounted(() => {
  setTimeout(
    () => {
      show.value = true
    },
    props.index > 0 ? transitionTime.value : 0
  )
  $on(Events.Close, onClose)
  document.addEventListener('keydown', onEsc)
  $emit(Events.Opened)
})

onBeforeUnmount(() => {
  $off(Events.Close, onClose)
  document.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <div :class="getClasses" :style="getStyle" class="vue-modal">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.vue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  opacity: 0;
  visibility: hidden;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  &.vue-modal--slideDown {
    transform: translate(0, -40px);
  }

  &.vue-modal--slideUp {
    transform: translate(0, 40px);
  }

  &.vue-modal--slideLeft {
    transform: translate(-40px, 0);
  }

  &.vue-modal--slideRight {
    transform: translate(40px, 0);
  }

  &.vue-modal--center {
    align-items: center;
  }

  &.vue-modal--top {
    align-items: flex-start;
  }

  &.vue-modal--active:not(.vue-modal--hide) {
    transform: translate(0, 0);
    opacity: 1;
    visibility: visible;
  }
}
</style>
