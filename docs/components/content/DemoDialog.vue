<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import { ModalContent, ModalDescription, ModalRoot, ModalTitle, openModal, useModalContext } from '@kolirt/vue-modal'

const props = withDefaults(
  defineProps<{
    title: string
    level?: number
  }>(),
  { level: 1 }
)

const { close, confirm } = useModalContext<boolean>()

function openAnother() {
  const Self = defineAsyncComponent(() => import('./DemoDialog.vue'))
  openModal(
    // Self-import via defineAsyncComponent — using a raw `() => Promise<comp>`
    // makes Vue's `<component :is>` stringify the promise to "[object Promise]".
    Self,
    {
      group: 'demo',
      props: {
        title: `Stacked modal #${props.level + 1}`,
        level: props.level + 1
      }
    }
  ).catch(() => {
    /* user closed */
  })
}
</script>

<template>
  <ModalRoot class="flex items-center justify-center">
    <ModalContent
      class="demo-modal w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg)] p-6 shadow-2xl outline-none"
    >
      <ModalTitle class="text-lg font-semibold text-[var(--ui-text-highlighted)]">
        {{ props.title }}
      </ModalTitle>
      <ModalDescription class="mt-2 text-sm text-[var(--ui-text-muted)]">
        Level {{ props.level }} — close with the buttons below, the Esc key, or by clicking the overlay.
      </ModalDescription>

      <div class="mt-6 flex flex-wrap gap-2 justify-end">
        <UButton @click="openAnother" color="neutral" variant="outline">Open another</UButton>
        <UButton @click="close()" color="neutral" variant="ghost">Close</UButton>
        <UButton @click="confirm(true)" color="primary">Confirm</UButton>
      </div>
    </ModalContent>
  </ModalRoot>
</template>

<style>
.demo-modal[data-state='open'] {
  animation: demo-modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.demo-modal[data-state='closed'] {
  animation: demo-modal-out 200ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes demo-modal-in {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes demo-modal-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(40px);
  }
}
</style>
