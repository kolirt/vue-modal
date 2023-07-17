<script setup lang="ts">
import {notify} from '@kyvg/vue3-notification'
import {ModalTarget, openModal} from '../lib'
import Test2Modal from './components/Test2Modal.vue'
import Test3Modal from './components/Test3Modal.vue'
import {defineAsyncComponent} from 'vue'

function runModal1() {
  openModal(defineAsyncComponent(() => import('@/components/Test1Modal.vue')), {
    test: 'modal1'
  }, {
    modalStyle: {
      align: 'top',
    }
  })
      .then((data) => {
        notify({
          type: 'success',
          title: 'Success modal1',
          text: JSON.stringify(data)
        })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Error modal1'
        })
      })
}

function runModal2() {
  openModal(Test2Modal, {
    test: 'modal2'
  })
      .then((data) => {
        notify({
          type: 'success',
          title: 'Success modal2',
          text: JSON.stringify(data)
        })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Error modal2'
        })
      })
}

function runModal3() {
  openModal(Test3Modal, {
    test: 'modal3'
  })
      .then((data) => {
        notify({
          type: 'success',
          title: 'Success modal3',
          text: JSON.stringify(data)
        })
      })
      .catch(() => {
        notify({
          type: 'error',
          title: 'Error modal3'
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
        <button @click="runModal1" class="btn btn-primary">
          Open modal1
        </button>
        <button @click="runModal2" class="btn btn-primary">
          Open modal2
        </button>
        <button @click="runModal3" class="btn btn-primary">
          Open modal3
        </button>
      </div>
    </div>
  </div>

  <notifications class="notifications"/>
  <ModalTarget/>
</template>

<style scoped>
.notifications {
  position: fixed;
  right: unset !important;
  left: 100vw;
  transform: translateX(-100%);
  margin-left: -15px;
}
</style>
