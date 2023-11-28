<script setup lang="ts">
import { closeModal, confirmModal, openModal } from '@kolirt/vue-modal'
import { notify } from '@kyvg/vue3-notification'

import Test2Modal from './Test2Modal.vue'

const props = defineProps<{
  test: {}
}>()

function runModal2(force = false) {
  openModal(
    Test2Modal,
    {
      test: 'modal2 from modal1'
    },
    { force }
  )
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
  <SimpleModal title="Modal1">
    <pre>props: {{ props }}</pre>

    <div class="d-flex gap-2">
      <button @click="runModal2(true)" class="btn btn-primary">Force open modal2</button>
      <button @click="runModal2()" class="btn btn-primary">Open modal2</button>
    </div>

    <template #footer>
      <button @click="closeModal()" class="btn btn-danger">Close</button>
      <button @click="confirmModal({ test: 'modal1' })" class="btn btn-success">Confirm</button>
    </template>
  </SimpleModal>
</template>

<style scoped></style>
