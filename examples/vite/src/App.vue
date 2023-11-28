<script setup lang="ts">
import { ModalTarget, openModal } from '@kolirt/vue-modal'
import { notify } from '@kyvg/vue3-notification'
import { defineAsyncComponent } from 'vue'

import Test2Modal from './components/Test2Modal.vue'
import Test3Modal from './components/Test3Modal.vue'

function runModal1() {
  openModal(
    defineAsyncComponent(() => import('@/components/Test1Modal.vue')),
    {
      test: 'modal1'
    },
    {
      modalStyle: {
        align: 'top'
      }
    }
  )
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
  openModal(
    Test3Modal,
    {
      test: 'modal3'
    },
    {
      group: 'default2'
    }
  )
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
    <div class="bg-body-secondary rounded p-5">
      <div class="d-grid d-sm-flex mb-3 gap-2">
        <img
          src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js"
          alt="vuejs"
        />
      </div>

      <iframe
        src="https://ghbtns.com/github-btn.html?user=kolirt&repo=vue-modal&type=star&count=true&size=large"
        frameborder="0"
        scrolling="0"
        width="170"
        height="30"
        title="GitHub"
        class="mb-3"
      >
      </iframe>

      <div class="d-grid d-sm-flex mb-3 gap-2">
        <a href="https://github.com/kolirt/vue-modal" target="_blank">Github</a>
        <a href="https://www.npmjs.com/package/@kolirt/vue-modal" target="_blank">Npmjs</a>
        <a href="https://github.com/kolirt/vue-modal/blob/master/README.md" target="_blank">Docs</a>
        <a href="https://github.com/kolirt/vue-modal/tree/master/examples" target="_blank">Example</a>
      </div>

      <h1>Vue3 modal package</h1>
      <p class="lead">Easy to use and highly customizable Vue3 modal package</p>

      <h5 class="h5">Default group</h5>
      <div class="d-grid d-sm-flex mb-3 gap-2">
        <button @click="runModal1" class="btn btn-primary">Open modal1</button>
        <button @click="runModal2" class="btn btn-primary">Open modal2</button>
      </div>

      <h5 class="h5">Default2 group without overlay</h5>
      <div class="d-grid d-sm-flex gap-2">
        <button @click="runModal3" class="btn btn-primary">Open modal3 without overlay</button>
      </div>
    </div>
  </div>

  <notifications class="notifications" />
  <ModalTarget group="default" />
  <ModalTarget group="default2" without-overlay />
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
