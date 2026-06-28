import type { Plugin } from 'vue'

import { setGroupConfigs } from './options'
import type { ModalGroupsConfig } from './types'

/** Options for {@link createModal}. */
export interface CreateModalOptions {
  groups?: ModalGroupsConfig
}

/**
 * Create the Vue plugin. Register it with `app.use(createModal({ groups }))`.
 * `groups` seeds per-group behavior defaults (scroll lock, close-on-escape,
 * interact-outside, etc.). Registering groups here does not by itself render
 * anything — you still mount a `<ModalTarget group="...">` per group.
 */
export function createModal(options?: CreateModalOptions): Plugin {
  if (options?.groups) setGroupConfigs(options.groups)
  return {
    install() {}
  }
}
