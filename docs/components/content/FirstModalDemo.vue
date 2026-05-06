<script setup lang="ts">
import { ref } from 'vue'

import { ModalOverlay, ModalTarget, openModal } from '@kolirt/vue-modal'

import ConfirmDialogDemo from './ConfirmDialogDemo.vue'

const lastResult = ref<true | false | null>(null)
const busy = ref(false)

async function tryIt() {
  if (busy.value) return
  busy.value = true
  const ok = await openModal<boolean>(ConfirmDialogDemo, {
    props: { message: 'Delete this project?' }
  }).catch(() => false)
  lastResult.value = ok
  busy.value = false
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-default bg-elevated">
    <div
      class="flex items-center justify-between gap-2 border-b border-default px-3 py-2 text-xs font-medium text-muted"
    >
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-sparkles" class="size-4 text-primary" />
        <span>Live demo</span>
      </div>
      <p v-if="lastResult !== null" class="text-xs">
        <template v-if="lastResult === true">
          Result: <span class="font-medium text-primary">ok = true</span>
        </template>
        <template v-else> Result: <span class="font-medium">ok = false</span> </template>
      </p>
    </div>
    <div class="flex flex-col items-center justify-center px-4 py-4 text-center">
      <ClientOnly>
        <UButton @click="tryIt" size="xl" trailing-icon="i-lucide-arrow-up-right">Try it</UButton>
        <template #fallback>
          <UButton size="xl" disabled>Try it</UButton>
        </template>
      </ClientOnly>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <ModalTarget class="vm-first-modal-target" group="demo">
          <ModalOverlay class="vm-first-modal-overlay" />
        </ModalTarget>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style>
.vm-first-modal-target {
  z-index: 100;
}

.vm-first-modal-overlay {
  background: rgba(0, 0, 0, 0.5);
}
.vm-first-modal-overlay[data-state='open'] {
  animation: vm-first-modal-overlay-in 200ms ease-out;
}
.vm-first-modal-overlay[data-state='closed'] {
  animation: vm-first-modal-overlay-out 200ms ease-in forwards;
}
@keyframes vm-first-modal-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes vm-first-modal-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
