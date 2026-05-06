<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'

import { openModal, replaceModal, useModalContext } from '@kolirt/vue-modal'
import PlaygroundModal from './PlaygroundModal.vue'

import Test2Modal from './Test2Modal.vue'

defineOptions({ modalGroup: 'default' })

const props = defineProps<{
  test: string
}>()

const { close, confirm } = useModalContext<{ test: string }>()

function runModal2(replace = false) {
  const fn = replace ? replaceModal : openModal
  fn(Test2Modal, {
    props: { test: 'modal2 from modal1' },
    instantEnter: replace
  })
    .then((data) => {
      notify({
        type: 'success',
        title: 'Success modal2 from modal1',
        text: JSON.stringify(data)
      })
    })
    .catch(() => {
      notify({
        type: 'error',
        title: 'Error modal2 from modal1'
      })
    })
}
</script>

<template>
  <PlaygroundModal title="Modal1">
    <pre>props: {{ props }}</pre>

    <div class="d-flex gap-2">
      <button @click="runModal2(true)" class="btn btn-primary">Replace with modal2</button>
      <button @click="runModal2()" class="btn btn-primary">Open modal2</button>
    </div>

    <template #footer>
      <button @click="close()" class="btn btn-danger">Close</button>
      <button @click="confirm({ test: 'modal1' })" class="btn btn-success">Confirm</button>
    </template>
  </PlaygroundModal>
</template>
