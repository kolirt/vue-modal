<h1 align="center">Simple Vue3 modal package</h1>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js" />
</p>

Easy to use and highly customizable Vue3 modal package.

**Table of Contents**

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Setup](#setup)
- [Usage](#usage)
  - [Basic usage](#basic-usage)
  - [Advanced usage](#)
- [Options](#options)
- [Demo](#demo)
- [Example](#example)
- [Faq](#faq)
- [License](#license)
- [Other packages](#other-packages)

<a href="https://www.buymeacoffee.com/kolirt" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

# Getting started

## Installation

Use yarn or npm to install the package `@kolirt/vue-modal`.

```bash
npm install --save @kolirt/vue-modal

yarn add @kolirt/vue-modal
```

## Setup

Add dependencies to your `main.js`:

```javascript
import { createApp } from 'vue'
import { createModal } from '@kolirt/vue-modal'

const app = createApp({ ... })

app.use(createModal({
  transitionTime: 200,
  animationType: 'slideDown',
  modalStyle: {
    padding: '5rem 2rem',
    align: 'center',
    'z-index': 201
  },
  overlayStyle: {
    'background-color': 'rgba(0, 0, 0, .5)',
    'backdrop-filter': 'blur(5px)',
    'z-index': 200
  }
}))

app.mount('#app')
```

Add `ModalTarget` to `App.vue`

```vue
<template>
  <ModalTarget />
</template>
```

# Usage

## Basic usage

First, you need to create modal. Instead of `SimpleModal`, you can implement your own wrapper with your own styles.

```vue
<script setup lang="ts">
import { closeModal, confirmModal } from '@kolirt/vue-modal'

const props = defineProps({
  test: {}
})
</script>

<template>
  <SimpleModal title="Test modal" size="sm">
    <pre>props: {{ props }}</pre>

    <template #footer>
      <button @click="confirmModal({ value: 'some values' })" class="btn btn-primary">Confirm</button>
      <button @click="closeModal()" class="btn btn-primary">Close</button>
    </template>
  </SimpleModal>
</template>
```

Then you can use your modal.

```vue
<script setup lang="ts">
import { openModal } from '@kolirt/vue-modal'
import { defineAsyncComponent } from 'vue'

import TestModal from '@/components/modals/TestModal.vue'

function runModal() {
  openModal(TestModal, {
    test: 'some props'
  })
    // runs when modal is closed via confirmModal
    .then((data) => {
      console.log('success', data)
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
      console.log('catch')
    })
}

function runDynamicModal() {
  openModal(
    defineAsyncComponent(() => import('@/components/modals/TestModal.vue')),
    {
      test: 'some props'
    }
  )
    // runs when modal is closed via confirmModal
    .then((data) => {
      console.log('success', data)
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
      console.log('catch')
    })
}
</script>

<template>
  <button @click="runModal">Open modal</button>
</template>
```

## Advanced usage

Open modal with clearing modal history.

```js
openModal(
  TestModal,
  {
    test: 'some props'
  },
  { force: true }
)
  // runs when modal is closed via confirmModal
  .then((data) => {
    console.log('success', data)
  })
  // runs when modal is closed via closeModal or esc
  .catch(() => {
    console.log('catch')
  })
```

# Options

## Component `ModalTarget` props

<table>
<thead>
  <tr>
    <th>Prop name</th>
    <th>Type</th>
    <th>Default value</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>group</td>
    <td>string</td>
    <td>'default'</td>
    <td>Name of the modals holder</td>
  </tr>
  <tr>
    <td>withoutOverlay</td>
    <td>boolean</td>
    <td>false</td>
    <td>Disable overlay</td>
  </tr>
</tbody>
</table>

## Function `openModal` args

<table>
<thead>
  <tr>
    <th>Arg number</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>Component</td>
    <td>vue component</td>
  </tr>
  <tr>
    <td>2</td>
    <td>object</td>
    <td>props for component</td>
  </tr>
  <tr>
    <td>2</td>
    <td>
      <a href='https://github.com/kolirt/vue-modal/blob/master/lib/types.ts#L28'>
        OpenModalOptions
      </a>
    </td>
    <td>options</td>
  </tr>
</tbody>
</table>

# Demo

[Demo here](https://kolirt.github.io/vue-modal/)

# Example

[Example here](https://github.com/kolirt/vue-modal/tree/master/examples)

# FAQ

Check closed [issues](https://github.com/kolirt/vue-modal/issues) with `FAQ` label to get answers for most asked
questions.

# License

[MIT](./LICENSE)

# Other packages

Check out my other projects on my [GitHub profile](https://github.com/kolirt).
