<script setup lang="ts">
import { ModalContent, ModalRoot, ModalTitle, useModalContext } from '@kolirt/vue-modal'

withDefaults(
  defineProps<{
    align?: 'center' | 'top'
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    showClose?: boolean
  }>(),
  {
    align: 'center',
    size: 'sm',
    showClose: true
  }
)

const { close } = useModalContext()
</script>

<template>
  <ModalRoot :data-align="align" class="playground-modal">
    <ModalContent :class="`playground-modal__size-${size}`" class="playground-modal__content">
      <div v-if="title || showClose" class="playground-modal__header">
        <ModalTitle v-if="title" as="h1" class="playground-modal__title">
          {{ title }}
        </ModalTitle>
        <button v-if="showClose" @click="close()" class="playground-modal__close" type="button" aria-label="Close" />
      </div>
      <div class="playground-modal__body">
        <slot />

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <!--        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid architecto beatae culpa dolor doloremque
          dolores est fugiat in laboriosam laborum quibusdam, sunt. Accusamus ad aspernatur modi nesciunt quidem
          voluptate?
        </p>-->
      </div>

      <div v-if="$slots.footer" class="playground-modal__footer">
        <slot name="footer" />
      </div>
    </ModalContent>
  </ModalRoot>
</template>

<style>
.playground-modal {
  padding: 2rem 1rem;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.playground-modal[data-align='top'] {
  align-items: flex-start;
}

@keyframes playground-modal-in {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes playground-modal-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(40px);
  }
}

.playground-modal__content {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 0.5rem;
  font-family: inherit;
  width: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(40px);
  margin: auto;
}

.playground-modal__content[data-state='open'] {
  animation: playground-modal-in 200ms ease forwards;
}

.playground-modal__content[data-state='closed'] {
  animation: playground-modal-out 200ms ease forwards;
}

.playground-modal__size-sm {
  max-width: 576px;
}
.playground-modal__size-md {
  max-width: 768px;
}
.playground-modal__size-lg {
  max-width: 992px;
}
.playground-modal__size-xl {
  max-width: 1200px;
}
.playground-modal__size-xxl {
  max-width: 1400px;
}

.playground-modal__header {
  padding: 1rem;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.playground-modal__title {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.playground-modal__close {
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
}
.playground-modal__close:hover {
  opacity: 1;
}

.playground-modal__body {
  padding: 1rem;
}

.playground-modal__footer {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-top: 1px solid #dee2e6;
  gap: 0.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .playground-modal__content[data-state] {
    animation: none;
  }
}
</style>
