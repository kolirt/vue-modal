<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import { ModalOverlay, ModalTarget, openModal, useModal } from '@kolirt/vue-modal'

import DemoDialog from './DemoDialog.vue'

type Action = 'openModal' | 'useModal'

const action = ref<Action>('openModal')

const modalProps = reactive({
  title: 'Hello from playground',
  level: 1
})

const openOpts = reactive({
  instantEnter: false
})

const targetOpts = reactive({
  enableInteractOutside: false,
  disableCloseOnInteractOutside: false,
  disableCloseOnInteractOverlay: false,
  disableLockBodyScroll: false,
  disableCloseOnEscape: false
})

const lastResult = ref<{ kind: 'confirmed' | 'closed' | 'error'; data?: unknown } | null>(null)
const busy = ref(false)

const controller = useModal(DemoDialog)

function asObjectLiteral(obj: Record<string, unknown>, indent = 2): string {
  const entries = Object.entries(obj).filter(([, v]) => v !== false && v !== '' && v !== undefined)
  if (entries.length === 0) return '{}'
  const pad = ' '.repeat(indent)
  return (
    '{\n' +
    entries
      .map(([k, v]) => {
        if (typeof v === 'string') return `${pad}${k}: ${JSON.stringify(v)}`
        return `${pad}${k}: ${v}`
      })
      .join(',\n') +
    '\n' +
    ' '.repeat(indent - 2) +
    '}'
  )
}

const targetSnippet = computed(() => {
  const props = Object.entries(targetOpts)
    .filter(([, v]) => v)
    .map(([k]) => k)
  const propsStr = props.length ? '\n  ' + props.join('\n  ') + '\n' : ' '
  return `<ModalTarget group="demo"${propsStr}>
  <ModalOverlay class="vm-demo-overlay" />
</ModalTarget>`
})

const openSnippet = computed(() => {
  const opts: Record<string, unknown> = {
    group: 'demo',
    props: { ...modalProps }
  }
  if (openOpts.instantEnter) opts.instantEnter = true

  const optsLiteral = `{\n  group: 'demo',\n  props: ${JSON.stringify(modalProps)}${
    openOpts.instantEnter ? ',\n  instantEnter: true' : ''
  }\n}`

  if (action.value === 'useModal') {
    return `const demo = useModal(DemoDialog)\n\ndemo.open(${optsLiteral})\n  .then((data) => { /* confirmed */ })\n  .catch(() => { /* closed */ })`
  }
  return `openModal(DemoDialog, ${optsLiteral})\n  .then((data) => { /* confirmed */ })\n  .catch(() => { /* closed */ })`
})

function run() {
  if (busy.value) return
  busy.value = true
  lastResult.value = null

  const opts = {
    group: 'demo' as const,
    props: { ...modalProps },
    ...(openOpts.instantEnter ? { instantEnter: true } : {})
  }

  const promise = action.value === 'useModal' ? controller.open(opts) : openModal(DemoDialog, opts)

  promise
    .then((data) => {
      lastResult.value = { kind: 'confirmed', data }
    })
    .catch((e) => {
      lastResult.value = e ? { kind: 'error', data: String(e) } : { kind: 'closed' }
    })
    .finally(() => {
      busy.value = false
    })
}

const targetToggles: { key: keyof typeof targetOpts; label: string; hint: string }[] = [
  {
    key: 'enableInteractOutside',
    label: 'enableInteractOutside',
    hint: 'Allow interacting with content behind the modal.'
  },
  {
    key: 'disableCloseOnInteractOutside',
    label: 'disableCloseOnInteractOutside',
    hint: 'Clicking outside no longer requests close.'
  },
  {
    key: 'disableCloseOnInteractOverlay',
    label: 'disableCloseOnInteractOverlay',
    hint: 'Clicking the overlay specifically does not close.'
  },
  {
    key: 'disableLockBodyScroll',
    label: 'disableLockBodyScroll',
    hint: 'Body scroll is not locked while the modal is open.'
  },
  {
    key: 'disableCloseOnEscape',
    label: 'disableCloseOnEscape',
    hint: 'Esc key no longer closes the modal.'
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- controls -->
    <div class="grid gap-4 rounded-2xl border border-default bg-elevated p-4 md:grid-cols-2">
      <!-- left: props -->
      <div class="flex flex-col gap-3">
        <div>
          <p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Modal props</p>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 text-sm">
              <span class="w-16 text-muted">title</span>
              <input
                v-model="modalProps.title"
                type="text"
                class="flex-1 rounded-md border border-default bg-default px-2 py-1 text-sm outline-none focus:border-primary"
              />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="w-16 text-muted">level</span>
              <input
                v-model.number="modalProps.level"
                type="number"
                min="1"
                class="w-24 rounded-md border border-default bg-default px-2 py-1 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Open options</p>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="openOpts.instantEnter" type="checkbox" class="size-4 accent-[var(--ui-primary)]" />
            <span>instantEnter</span>
            <span class="text-xs text-muted">— skip enter animation</span>
          </label>
        </div>
      </div>

      <!-- right: target behavior -->
      <div>
        <p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">ModalTarget behavior</p>
        <div class="flex flex-col gap-2">
          <label v-for="t in targetToggles" :key="t.key" class="flex items-start gap-2 text-sm">
            <input
              v-model="targetOpts[t.key]"
              type="checkbox"
              class="mt-0.5 size-4 shrink-0 accent-[var(--ui-primary)]"
            />
            <span class="flex-1">
              <span class="font-mono text-xs">{{ t.label }}</span>
              <span class="block text-xs text-muted">{{ t.hint }}</span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- run + result -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-default bg-elevated px-4 py-3"
    >
      <div class="flex items-center gap-3">
        <ClientOnly>
          <UButton @click="run" :loading="busy" size="lg" trailing-icon="i-lucide-play">Run {{ action }}</UButton>
          <template #fallback>
            <UButton size="lg" disabled>Run</UButton>
          </template>
        </ClientOnly>
        <p v-if="action === 'useModal'" class="text-xs text-muted">
          isOpen: <strong>{{ controller.isOpen.value }}</strong>
          <UButton
            v-if="controller.isOpen.value"
            @click="controller.close()"
            size="xs"
            color="neutral"
            variant="ghost"
            class="ml-2"
          >
            close()
          </UButton>
        </p>
      </div>
      <p v-if="lastResult" class="text-xs">
        Last result:
        <span
          :class="{
            'text-primary font-medium': lastResult.kind === 'confirmed',
            'text-muted': lastResult.kind === 'closed',
            'text-red-500': lastResult.kind === 'error'
          }"
        >
          {{ lastResult.kind }}<span v-if="lastResult.data !== undefined"> · {{ lastResult.data }}</span>
        </span>
      </p>
    </div>

    <!-- code preview -->
    <div class="grid gap-3 md:grid-cols-2">
      <div class="overflow-hidden rounded-2xl border border-default bg-muted">
        <div
          class="flex items-center justify-between gap-2 border-b border-default px-3 py-1 text-xs font-medium text-muted"
        >
          <span>Action call</span>
          <div class="flex items-center gap-1">
            <button
              v-for="a in ['openModal', 'useModal'] as const"
              @click="action = a"
              :key="a"
              :class="action === a ? 'bg-elevated text-highlighted' : 'text-muted hover:text-default'"
              type="button"
              class="rounded-md px-2 py-0.5 transition-colors"
            >
              {{ a }}
            </button>
          </div>
        </div>
        <pre class="overflow-x-auto px-4 py-3 text-xs leading-6 text-default"><code>{{ openSnippet }}</code></pre>
      </div>
      <div class="overflow-hidden rounded-2xl border border-default bg-muted">
        <div class="border-b border-default px-3 py-1 text-xs font-medium text-muted">Target setup</div>
        <pre class="overflow-x-auto px-4 py-3 text-xs leading-6 text-default"><code>{{ targetSnippet }}</code></pre>
      </div>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <ModalTarget
          :enable-interact-outside="targetOpts.enableInteractOutside"
          :disable-close-on-interact-outside="targetOpts.disableCloseOnInteractOutside"
          :disable-close-on-interact-overlay="targetOpts.disableCloseOnInteractOverlay"
          :disable-lock-body-scroll="targetOpts.disableLockBodyScroll"
          :disable-close-on-escape="targetOpts.disableCloseOnEscape"
          class="vm-playground-target"
          group="demo"
        >
          <ModalOverlay class="vm-playground-overlay" />
        </ModalTarget>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style>
.vm-playground-target {
  z-index: 100;
  top: var(--ui-header-height, 64px);
  height: calc(100dvh - var(--ui-header-height, 64px));
}

.vm-playground-overlay {
  background: rgba(0, 0, 0, 0.55);
  pointer-events: auto;
}
.vm-playground-overlay[data-state='open'] {
  animation: vm-pg-overlay-in 200ms ease-out;
}
.vm-playground-overlay[data-state='closed'] {
  animation: vm-pg-overlay-out 200ms ease-in forwards;
}
@keyframes vm-pg-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes vm-pg-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
