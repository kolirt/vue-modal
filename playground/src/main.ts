import Notifications from '@kyvg/vue3-notification'
import { createApp } from 'vue'

import { createModal, type DefineGroups } from '@kolirt/vue-modal'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'

declare module '@kolirt/vue-modal' {
  interface ModalGroupRegistry extends DefineGroups<['default', 'default2']> {}
}

const app = createApp(App)

app.use(Notifications)
app.use(
  createModal({
    groups: {
      default: {},
      default2: {}
    }
  })
)

app.mount('#app')
