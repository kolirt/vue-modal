<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'

defineProps<DialogDescriptionProps>()
</script>

<template>
  <!-- Accessible dialog description; renders [data-modal-description]. -->
  <DialogDescription data-modal-description v-bind="$props">
    <slot />
  </DialogDescription>
</template>
