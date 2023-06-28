<script setup lang="ts">
import {closeModal, confirmModal, openModal} from '../../lib'
import {notify} from '@kyvg/vue3-notification'
import Test2Modal from './Test2Modal.vue'

const props = defineProps({
  test: {}
})

function openNextModal() {
  openModal(Test2Modal, {
    test: 'modal #2 from modal #1'
  })
      .then((data) => {
        notify({
          type: 'success',
          title: 'Success modal #2 from modal #1',
          text: JSON.stringify(data)
        })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Error modal #2 from modal #1'
        })
      })
}
</script>

<template>
  <SimpleModal title="Modal #1">
    <pre>props: {{ props }}</pre>

    <template #footer>
      <button @click="openNextModal" class="btn btn-primary">
        Open next modal #2
      </button>

      <button @click="confirmModal({test: 123})" class="btn btn-primary">
        Confirm
      </button>
      <button @click="closeModal()" class="btn btn-primary">
        Close
      </button>
    </template>
  </SimpleModal>
</template>

<style scoped>

</style>