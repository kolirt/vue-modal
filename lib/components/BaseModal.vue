<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {$emit, $off, $on} from '../event'
import {state as stateData} from '../data'
import {state as stateOptions} from '../options'
import {Events} from '../types'
import {isEsc} from '../utils/isEsc'
import {closeModal} from '../actions'

const props = defineProps({
  index: {type: Number, required: true}
})

const transitionTime = stateOptions.animationType !== 'none' ? stateOptions.transitionTime : 0
const baseModalStyle = computed(() => {
  return {
    'padding': stateOptions.modalStyle?.padding,
    'z-index': stateOptions.modalStyle?.['z-index'],
    'justify-content': stateOptions.modalStyle?.align
  }
})
const baseModalInnerStyle = computed(() => {
  return {
    'transition': `opacity ${transitionTime}ms ease, visibility ${transitionTime}ms ease, transform ${transitionTime}ms ease`
  }
})

const show = ref(false)
const hide = computed(() => props.index !== stateData.modals.length - 1)

const getClasses = computed(() => {
  return [
    {
      'vue-modal__inner--active': show.value,
      'vue-modal__inner--hide': hide.value
    },
    `vue-modal__inner--${stateOptions.animationType}`
  ]
})

function onClose(data: any) {
  if (stateData.modals.length - 1 === props.index) {
    show.value = false
    setTimeout($emit, transitionTime, Events.Closed, {
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
  setTimeout(() => {
    show.value = true
  }, props.index > 0 ? transitionTime : 0)
  $on(Events.Close, onClose)
  document.addEventListener('keydown', onEsc)
})

onBeforeUnmount(() => {
  $off(Events.Close, onClose)
  document.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <div class="vue-modal modal" :style="baseModalStyle">
    <div class="vue-modal__inner" :style="baseModalInnerStyle" :class="getClasses">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
}

.vue-modal__inner {
  margin-top: auto;
  margin-bottom: auto;
  height: auto;
  opacity: 0;
  visibility: hidden;
  width: 100%;
  display: flex;
  justify-content: center;

  &.vue-modal__inner--slideDown {
    transform: translate(0, -40px);
  }

  &.vue-modal__inner--slideUp {
    transform: translate(0, 40px);
  }

  &.vue-modal__inner--slideLeft {
    transform: translate(-40px, 0);
  }

  &.vue-modal__inner--slideRight {
    transform: translate(40px, 0);
  }

  &.vue-modal__inner--active:not(.vue-modal__inner--hide) {
    transform: translate(0, 0);
    opacity: 1;
    visibility: visible;
  }
}
</style>