<script setup lang="ts">
import {closeModal, confirmModal} from '../../lib'

const props = defineProps({
  test: {}
})
</script>

<template>
  <SimpleModal title="Modal #2" size="sm">
    <pre>props: {{ props }}</pre>

    <template #footer>
      <button @click="confirmModal()" class="btn btn-primary">
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