<script setup lang="ts">
import { useSlots } from 'vue'

import { closeModal } from '../../actions'

const slots = useSlots()
const props = defineProps({
  title: {},
  showClose: { type: Boolean, default: true },
  size: {
    type: String,
    default: 'sm',
    validator(value: string): boolean {
      return ['sm', 'md', 'lg', 'xl', 'xxl'].includes(value)
    }
  }
})
</script>

<template>
  <div :class="`size-${props.size}`" class="vue-modal-content">
    <div v-if="props.title || props.showClose" class="vue-modal-header">
      <h1 v-if="props.title" class="vue-modal-title">{{ props.title }}</h1>
      <button v-if="props.showClose" @click="closeModal()" class="vue-modal-btn-close" aria-label="Close"></button>
    </div>

    <div class="vue-modal-body">
      <slot></slot>
    </div>

    <div v-if="slots.footer" class="vue-modal-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vue-modal-content {
  background: #fff;
  border-radius: 0.5rem;
  font-family: inherit;

  &.size-sm {
    width: 100%;
    max-width: 576px;
  }

  &.size-md {
    width: 100%;
    max-width: 768px;
  }

  &.size-lg {
    width: 100%;
    max-width: 992px;
  }

  &.size-xl {
    width: 100%;
    max-width: 1200px;
  }

  &.size-xxl {
    width: 100%;
    max-width: 1400px;
  }
}

.vue-modal-header {
  padding: 1rem;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.vue-modal-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.vue-modal-btn-close {
  opacity: 0.5;
  width: 2rem;
  height: 2rem;
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 1;
  }
}

.vue-modal-body {
  padding: 1rem;
}

.vue-modal-footer {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-top: 1px solid #dee2e6;
  gap: 0.25rem;

  & > :deep(*) {
    //margin: 0.25rem;
  }
}
</style>
