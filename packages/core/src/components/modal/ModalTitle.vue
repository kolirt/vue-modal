<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'reka-ui'

defineProps<DialogTitleProps>()
</script>

<template>
  <!-- Accessible dialog title; renders [data-modal-title]. -->
  <DialogTitle data-modal-title v-bind="$props">
    <slot />
  </DialogTitle>
</template>
