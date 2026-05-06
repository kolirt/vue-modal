<script setup lang="ts">
import { closeAllModals, useModalContext } from '@kolirt/vue-modal'
import PlaygroundModal from './PlaygroundModal.vue'

defineOptions({ modalGroup: 'default2' })

const emits = defineEmits(['confirm', 'close'])

const props = defineProps<{
  test: string
}>()

const { close, confirm } = useModalContext<{ test: string }>()
</script>

<template>
  <PlaygroundModal title="Modal3" size="sm">
    <pre>props: {{ props }}</pre>

    <template #footer>
      <button @click="closeAllModals()" class="btn btn-outline-danger">Close All</button>
      <button @click="close()" class="btn btn-danger">Close</button>
      <button @click="confirm({ test: 'modal3' })" class="btn btn-success">Confirm</button>
    </template>
  </PlaygroundModal>
</template>
