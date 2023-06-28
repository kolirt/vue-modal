import type {Plugin} from 'vue'
import type {Options} from './types'
import ModalTarget from './components/ModalTarget.vue'
import SimpleModal from './components/layouts/SimpleModal.vue'
import {setOptions} from './options'
import {$on} from './event'
import {Events} from './types'
import {removeModal} from './data'

export function createModal(options?: Options): Plugin {
    return {
        install(app ) {
            setOptions(options || {})

            // eslint-disable-next-line vue/multi-word-component-names
            app.component('ModalTarget', ModalTarget)
            app.component('SimpleModal', SimpleModal)

            $on(Events.Closed, removeModal)
        }
    }
}
