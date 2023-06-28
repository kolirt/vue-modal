import {createApp} from 'vue'
import Notifications from '@kyvg/vue3-notification'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import {createModal} from '../lib'

const app = createApp(App)

app.use(Notifications)

app.use(createModal({
    transitionTime: 200,
    animationType: 'slideUp',
    overlayStyle: {
        'background-color': 'rgba(0,0,0,.3)'
    }
}))

app.mount('#app')
