<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'

import { closeAllModals, openModal, replaceModal, useModalContext } from '@kolirt/vue-modal'
import PlaygroundModal from './PlaygroundModal.vue'

import Test3Modal from './Test3Modal.vue'

defineOptions({ modalGroup: 'default' })

const props = defineProps<{
  test: string
}>()

const emit = defineEmits<{
  progress: [percent: number]
}>()

const { close, confirm } = useModalContext<{ test: string }>()

function runModal3(replace = false) {
  emit('progress', replace ? 100 : 50)
  const fn = replace ? replaceModal : openModal
  fn(Test3Modal, {
    props: { test: 'modal3 from modal2' },
    instantEnter: replace
  })
    .then((data) => {
      notify({
        type: 'success',
        title: 'Success modal3 from modal2',
        text: JSON.stringify(data)
      })
    })
    .catch(() => {
      notify({
        type: 'error',
        title: 'Error modal3 from modal2'
      })
    })
}
</script>

<template>
  <PlaygroundModal title="Modal2" size="sm">
    <pre>props: {{ props }}</pre>

    <div class="d-flex gap-2">
      <button @click="runModal3(true)" class="btn btn-primary">Replace with modal3 (no overlay)</button>
      <button @click="runModal3()" class="btn btn-primary">Open modal3 without overlay</button>
    </div>

    <template #footer>
      <button @click="closeAllModals()" class="btn btn-outline-danger">Close All</button>
      <button @click="close()" class="btn btn-danger">Close</button>
      <button @click="confirm({ test: 'modal2' })" class="btn btn-success">Confirm</button>
    </template>
  </PlaygroundModal>
</template>
