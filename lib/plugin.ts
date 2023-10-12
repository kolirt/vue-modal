import type { Plugin } from 'vue'

import ModalTarget from './components/ModalTarget.vue'
import SimpleModal from './components/layouts/SimpleModal.vue'
import { removeModal } from './data'
import { $on } from './event'
import { setOptions } from './options'
import type { Options } from './types'
import { Events } from './types'

export function createModal(options?: Options): Plugin {
  return {
    install(app) {
      setOptions(options || {})

      // eslint-disable-next-line vue/multi-word-component-names
      app.component('ModalTarget', ModalTarget)
      app.component('SimpleModal', SimpleModal)

      $on(Events.Closed, removeModal)
    }
  }
}
