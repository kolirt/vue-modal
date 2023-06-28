<script setup lang="ts">
import {openModal as masterOpenModal} from '../lib'
import TestModal from './components/TestModal.vue'
import Test2Modal from './components/Test2Modal.vue'
import {notify} from '@kyvg/vue3-notification'


function openModal() {
  masterOpenModal(TestModal, {
    test: 'modal #1'
  })
      .then((data) => {
        notify({
          type: 'success',
          title: 'Success modal #1',
          text: JSON.stringify(data)
        })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Error modal #1'
        })
      })
}

function openModal2() {
  masterOpenModal(Test2Modal, {
    test: 'modal #2'
  })
      .then((data) => {
        notify({
          type: 'success',
          title: 'Success modal #2',
          text: JSON.stringify(data)
        })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Error modal #2'
        })
      })
}
</script>

<template>
  <div class="container py-5">
    <div class="bg-body-secondary p-5 rounded">
      <div class="mb-3 d-grid gap-2 d-sm-flex">
        <img
            src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js"
            alt="vuejs"/>
      </div>

      <iframe src="https://ghbtns.com/github-btn.html?user=kolirt&repo=vue-modal&type=star&count=true&size=large"
              frameborder="0" scrolling="0" width="170" height="30" title="GitHub" class="mb-3">
      </iframe>

      <div class="mb-3 d-grid gap-2 d-sm-flex">
        <a href="https://github.com/kolirt/vue-modal" target="_blank">Github</a>
        <a href="https://www.npmjs.com/package/@kolirt/vue-modal" target="_blank">Npmjs</a>
        <a href="https://github.com/kolirt/vue-modal/blob/master/README.md" target="_blank">Docs</a>
        <a href="https://github.com/kolirt/vue-modal/blob/master/src" target="_blank">Example</a>
      </div>

      <h1>Vue3 modal package</h1>
      <p class="lead">Easy to use and highly customizable Vue3 modal package</p>

      <div class="d-grid gap-2 d-sm-flex">
        <button @click="openModal" class="btn btn-primary">
          Open modal #1
        </button>
        <button @click="openModal2" class="btn btn-primary">
          Open modal #2
        </button>
      </div>
    </div>
  </div>

  <notifications />
  <ModalTarget/>
</template>

<style scoped>
</style>
