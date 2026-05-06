<script setup lang="ts">
import { ref } from 'vue'

import { ModalOverlay, ModalTarget, openModal } from '@kolirt/vue-modal'

import DemoDialog from './DemoDialog.vue'

const lastResult = ref<'confirmed' | 'closed' | null>(null)
const busy = ref(false)
const activeTab = ref<'openModal' | 'useModal'>('openModal')

const snippets = {
  openModal: `import { openModal } from '@kolirt/vue-modal'
import DemoDialog from './DemoDialog.vue'

openModal(DemoDialog, {
  props: { title: 'Hello from JS!', level: 1 }
})
  .then(() => { lastResult = 'confirmed' })
  .catch(() => { lastResult = 'closed' })`,
  useModal: `import { useModal } from '@kolirt/vue-modal'
import DemoDialog from './DemoDialog.vue'

const demo = useModal(DemoDialog, {
  props: { title: 'Hello from JS!', level: 1 }
})

demo.open()
  .then(() => { lastResult = 'confirmed' })
  .catch(() => { lastResult = 'closed' })`
} as const

function openDemo() {
  if (busy.value) return
  busy.value = true
  openModal(DemoDialog, {
    group: 'demo',
    props: { title: 'Hello from JS!', level: 1 }
  })
    .then(() => {
      lastResult.value = 'confirmed'
    })
    .catch(() => {
      lastResult.value = 'closed'
    })
    .finally(() => {
      busy.value = false
    })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="overflow-hidden rounded-2xl border border-default bg-muted">
      <div
        class="flex items-center justify-between gap-2 border-b border-default px-2 py-1 text-xs font-medium text-muted"
      >
        <div class="flex items-center gap-1">
          <button
            v-for="tab in ['openModal', 'useModal'] as const"
            @click="activeTab = tab"
            :key="tab"
            :class="activeTab === tab ? 'bg-elevated text-highlighted' : 'text-muted hover:text-default'"
            type="button"
            class="rounded-md px-3 py-1.5 transition-colors"
          >
            {{ tab }}
          </button>
        </div>
        <div class="flex items-center gap-2 pr-2">
          <UIcon name="i-vscode-icons-file-type-typescript-official" class="size-4" />
          <span>What runs on click</span>
        </div>
      </div>
      <pre class="overflow-x-auto px-4 py-4 text-sm leading-6 text-default"><code>{{ snippets[activeTab] }}</code></pre>
    </div>

    <div class="overflow-hidden rounded-2xl border border-default bg-elevated">
      <div
        class="flex items-center justify-between gap-2 border-b border-default px-3 py-2 text-xs font-medium text-muted"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sparkles" class="size-4 text-primary" />
          <span>Live demo</span>
        </div>
        <p v-if="lastResult" class="text-xs">
          <template v-if="lastResult === 'confirmed'">
            Last result:
            <span class="font-medium text-primary">confirmed</span>
          </template>
          <template v-else>
            Last result:
            <span class="font-medium">closed</span>
          </template>
        </p>
      </div>
      <div class="flex flex-col items-center justify-center px-4 py-4 text-center">
        <ClientOnly>
          <UButton @click="openDemo" size="xl" trailing-icon="i-lucide-arrow-up-right">Open modal</UButton>
          <template #fallback>
            <UButton size="xl" disabled>Open modal</UButton>
          </template>
        </ClientOnly>
      </div>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <ModalTarget class="vm-demo-target" group="demo">
          <ModalOverlay class="vm-demo-overlay" />
        </ModalTarget>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style>
.vm-demo-target {
  z-index: 100;
}

.vm-demo-overlay {
  background: rgba(0, 0, 0, 0.6);
}

.vm-demo-overlay[data-state='open'] {
  animation: vm-demo-overlay-in 200ms ease-out;
}

.vm-demo-overlay[data-state='closed'] {
  animation: vm-demo-overlay-out 200ms ease-in forwards;
}

@keyframes vm-demo-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes vm-demo-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
