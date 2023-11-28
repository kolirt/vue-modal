import { createModal } from '@kolirt/vue-modal'
import Notifications from '@kyvg/vue3-notification'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'

import App from './App.vue'

const app = createApp(App)

app.use(Notifications)

app.use(
  createModal({
    transitionTime: 200,
    animationType: 'slideDown',
    modalStyle: {
      padding: '5rem 2rem',
      align: 'center',
      'z-index': 201
    },
    overlayStyle: {
      'background-color': 'rgba(0, 0, 0, .5)',
      'z-index': 200
    }
  })
)

app.mount('#app')
