<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import { defineAsyncComponent } from 'vue'

import { ModalOverlay, ModalTarget, openModal, replaceModal, useModal } from '@kolirt/vue-modal'

import Test2Modal from './components/Test2Modal.vue'
import Test3Modal from './components/Test3Modal.vue'

// =====================================================================
// openModal — pattern 1: async component + .then/.catch
// =====================================================================
function openModal1Async() {
  openModal(
    defineAsyncComponent(() => import('./components/Test1Modal.vue')),
    { group: 'default', props: { test: 'modal1' } }
  )
    .then((data) => notify({ type: 'success', title: 'Success modal1', text: JSON.stringify(data) }))
    .catch(() => notify({ type: 'error', title: 'Error modal1' }))
}

// =====================================================================
// openModal — pattern 2: imported component + .then/.catch
// =====================================================================
function openModal2Sync() {
  openModal(Test2Modal, { props: { test: 'modal2' } })
    .then((data) => notify({ type: 'success', title: 'Success modal2', text: JSON.stringify(data) }))
    .catch(() => notify({ type: 'error', title: 'Error modal2' }))
}

// =====================================================================
// openModal — pattern 3: component declares group via defineOptions
// (Test3Modal has defineOptions({ modalGroup: 'default2' }))
// =====================================================================
function openModal3DeclaredGroup() {
  openModal(Test3Modal, { props: { test: 'modal3' } })
    .then((data) => notify({ type: 'success', title: 'Success modal3', text: JSON.stringify(data) }))
    .catch(() => notify({ type: 'error', title: 'Error modal3' }))
}

// =====================================================================
// openModal — pattern 4: await + try/catch
// =====================================================================
async function openWithAwait() {
  try {
    const data = await openModal(Test2Modal, { props: { test: 'await pattern' } })
    notify({ type: 'success', title: 'Awaited result', text: JSON.stringify(data) })
  } catch {
    notify({ type: 'warn', title: 'Awaited rejected (closed)' })
  }
}

// =====================================================================
// openModal — pattern 5: fire-and-forget (no await, no .then)
// =====================================================================
function openFireAndForget() {
  // No promise handling — modal closes silently when user dismisses.
  openModal(Test2Modal, { props: { test: 'fire-and-forget' } })
}

// =====================================================================
// openModal — pattern 6: with `on` listener for emitted events
// =====================================================================
function openWithEventListener() {
  openModal(Test2Modal, {
    props: { test: 'with on:progress' },
    on: {
      progress: (percent: number) => {
        notify({ type: 'info', title: 'progress event', text: `${percent}%` })
      }
    }
  }).catch(() => {})
}

// =====================================================================
// replaceModal — close top in target group, open new (wizard pattern).
// Pass instantEnter: true to also skip enter animation.
// =====================================================================
function openForceReplace() {
  replaceModal(Test2Modal, {
    props: { test: 'replaceModal' },
    instantEnter: true
  }).catch(() => {})
}

// =====================================================================
// useModal — controller with reactive state, persistent listeners,
// programmatic open/close, auto-cleanup on App unmount.
// =====================================================================
const editModal = useModal(Test2Modal, {
  // persistent listener — survives across multiple .open() calls
  on: {
    progress: (percent: number) => {
      console.log('[useModal controller] progress:', percent)
    }
  }
  // closeOnUnmount: true (default) — modal force-closes if App unmounts
})

async function openViaController() {
  try {
    const data = await editModal.open({ props: { test: 'via useModal controller' } })
    notify({ type: 'success', title: 'Controller success', text: JSON.stringify(data) })
  } catch {
    notify({ type: 'warn', title: 'Controller closed' })
  }
}

function closeViaController() {
  // programmatic close from outside the modal — promise rejects
  editModal.close()
}
</script>

<template>
  <div class="container py-5">
    <div class="bg-body-secondary rounded p-5">
      <div class="d-grid d-sm-flex mb-3 gap-2">
        <img
          src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js"
          alt="vuejs"
        />
      </div>

      <iframe
        src="https://ghbtns.com/github-btn.html?user=kolirt&repo=vue-modal&type=star&count=true&size=large"
        frameborder="0"
        scrolling="0"
        width="170"
        height="30"
        title="GitHub"
        class="mb-3"
      >
      </iframe>

      <div class="d-grid d-sm-flex mb-3 gap-2">
        <a href="https://github.com/kolirt/vue-modal" target="_blank">Github</a>
        <a href="https://www.npmjs.com/package/@kolirt/vue-modal" target="_blank">Npmjs</a>
        <a href="https://github.com/kolirt/vue-modal/blob/master/README.md" target="_blank">Docs</a>
      </div>

      <h1>Vue3 modal package</h1>
      <p class="lead">Easy to use and highly customizable Vue3 modal package</p>

      <h5 class="h5 mt-4">openModal — basic patterns</h5>
      <div class="d-grid d-sm-flex mb-3 gap-2">
        <button @click="openModal1Async" class="btn btn-primary">Async component (.then/.catch)</button>
        <button @click="openModal2Sync" class="btn btn-primary">Imported component (.then/.catch)</button>
        <button @click="openModal3DeclaredGroup" class="btn btn-primary">Group via defineOptions (no overlay)</button>
      </div>

      <h5 class="h5 mt-4">openModal — advanced patterns</h5>
      <div class="d-grid d-sm-flex mb-3 gap-2">
        <button @click="openWithAwait" class="btn btn-outline-primary">await + try/catch</button>
        <button @click="openFireAndForget" class="btn btn-outline-primary">fire-and-forget</button>
        <button @click="openWithEventListener" class="btn btn-outline-primary">with on:progress listener</button>
        <button @click="openForceReplace" class="btn btn-outline-warning">force: true (replace stack)</button>
      </div>

      <h5 class="h5 mt-4">useModal — controller pattern</h5>
      <p class="text-muted small mb-2">
        One <code>useModal()</code> instance per controller. Persistent listeners (logged to console), reactive
        <code>isOpen</code>, programmatic close from outside, and auto-cleanup when this component unmounts.
      </p>
      <div class="d-grid d-sm-flex align-items-center gap-2">
        <button @click="openViaController" class="btn btn-success">Open via controller</button>
        <button @click="closeViaController" :disabled="!editModal.isOpen.value" class="btn btn-secondary">
          Close via controller
        </button>
        <span class="text-muted small">
          isOpen: <strong>{{ editModal.isOpen.value }}</strong> · instanceId:
          <strong>{{ editModal.instanceId.value ?? '—' }}</strong>
        </span>
      </div>
    </div>
  </div>

  <notifications class="notifications" />

  <ModalTarget group="default">
    <ModalOverlay class="modal-overlay" />
  </ModalTarget>

  <ModalTarget group="default2">
    <ModalOverlay class="modal-overlay" />
  </ModalTarget>
</template>

<style scoped>
.notifications {
  position: fixed;
  right: unset !important;
  left: 100vw;
  transform: translateX(-100%);
  margin-left: -15px;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.modal-overlay[data-state='open'] {
  animation: overlay-fade-in 200ms ease-out;
}

.modal-overlay[data-state='closed'] {
  animation: overlay-fade-out 200ms ease-in forwards;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlay-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
