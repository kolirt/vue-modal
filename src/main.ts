import App from './App.vue'

import Notifications from '@kyvg/vue3-notification'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'

import { createModal } from '../lib'

const app = createApp(App)

app.use(Notifications)

app.use(
  createModal({
    transitionTime: 200,
    animationType: 'slideUp',
    modalStyle: {
      padding: '2rem 1rem'
    },
    overlayStyle: {
      'background-color': 'rgba(0,0,0,.3)'
    }
  })
)

app.mount('#app')
