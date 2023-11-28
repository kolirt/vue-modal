<script setup lang="ts">
import { closeAllModals, closeModal, confirmModal, openModal } from '@kolirt/vue-modal'
import { notify } from '@kyvg/vue3-notification'

import Test3Modal from './Test3Modal.vue'

const props = defineProps<{
  test: string
}>()

function runModal3(force = false) {
  openModal(
    Test3Modal,
    {
      test: 'modal3 from modal2'
    },
    {
      force,
      group: 'default2'
    }
  )
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
  <SimpleModal title="Modal2" size="sm">
    <pre>props: {{ props }}</pre>

    <div class="d-flex gap-2">
      <button @click="runModal3(true)" class="btn btn-primary">Force open modal3 without overlay</button>
      <button @click="runModal3()" class="btn btn-primary">Open modal3 without overlay</button>
    </div>

    <template #footer>
      <button @click="closeAllModals()" class="btn btn-outline-danger">Close All</button>
      <button @click="closeModal()" class="btn btn-danger">Close</button>
      <button @click="confirmModal({ test: 'modal2' })" class="btn btn-success">Confirm</button>
    </template>
  </SimpleModal>
</template>

<style scoped></style>
