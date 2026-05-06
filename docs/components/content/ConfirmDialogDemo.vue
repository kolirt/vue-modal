<script setup lang="ts">
import { ModalContent, ModalDescription, ModalRoot, ModalTitle, useModalContext } from '@kolirt/vue-modal'

defineOptions({ modalGroup: 'demo' })

const props = defineProps<{ message: string }>()

const { close, confirm } = useModalContext<boolean>()
</script>

<template>
  <ModalRoot class="vm-cdd-root">
    <ModalContent class="vm-cdd-card">
      <ModalTitle>Confirm</ModalTitle>
      <ModalDescription>{{ props.message }}</ModalDescription>

      <div class="vm-cdd-actions">
        <button @click="close()" class="vm-cdd-btn vm-cdd-btn--cancel">Cancel</button>
        <button @click="confirm(true)" class="vm-cdd-btn vm-cdd-btn--confirm">OK</button>
      </div>
    </ModalContent>
  </ModalRoot>
</template>

<style>
.vm-cdd-root {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.vm-cdd-card {
  width: 100%;
  max-width: 24rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.vm-cdd-card[data-state='open'] {
  animation: vm-cdd-slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.vm-cdd-card[data-state='closed'] {
  animation: vm-cdd-slide-down 200ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
@keyframes vm-cdd-slide-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes vm-cdd-slide-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(24px);
  }
}

.vm-cdd-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.vm-cdd-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 150ms ease;
}
.vm-cdd-btn--cancel {
  background: transparent;
  color: #525252;
  border-color: #d4d4d4;
}
.vm-cdd-btn--cancel:hover {
  background: #f5f5f5;
}
.vm-cdd-btn--confirm {
  background: #2563eb;
  color: white;
}
.vm-cdd-btn--confirm:hover {
  background: #1d4ed8;
}
</style>
