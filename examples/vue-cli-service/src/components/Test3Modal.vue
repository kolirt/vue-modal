<script setup>
import { closeAllModals, closeModal, confirmModal } from '@kolirt/vue-modal'
import { defineProps } from 'vue'

const props = defineProps({
  test: {}
})
</script>

<template>
  <SimpleModal title="Modal3" size="sm">
    <pre>props: {{ props }}</pre>

    <template #footer>
      <button @click="closeAllModals()" class="btn btn-outline-danger">Close All</button>
      <button @click="closeModal()" class="btn btn-danger">Close</button>
      <button @click="confirmModal({ test: 'modal3' })" class="btn btn-success">Confirm</button>
    </template>
  </SimpleModal>
</template>

<style scoped></style>
