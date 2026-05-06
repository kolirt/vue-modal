import type { Plugin } from 'vue'

import { setGroupConfigs } from './options'
import type { ModalGroupsConfig } from './types'

export interface CreateModalOptions {
  groups?: ModalGroupsConfig
}

export function createModal(options?: CreateModalOptions): Plugin {
  if (options?.groups) setGroupConfigs(options.groups)
  return {
    install() {}
  }
}
