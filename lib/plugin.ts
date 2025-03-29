import type { Plugin } from 'vue'

import { removeModal } from './data'
import { $on } from './event'
import { setOptions } from './options'
import type { Options } from './types'
import { Events } from './types'

export function createModal(options?: Options): Plugin {
  return {
    install() {
      setOptions(options || {})

      $on(Events.Closed, removeModal)
    }
  }
}
