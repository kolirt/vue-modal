import type { ModalBehaviorOptions, ModalEffectiveOptions, ModalGroup, ModalGroupsConfig } from './types'

export const HARDCODED_DEFAULTS: Required<ModalBehaviorOptions> = {
  enableInteractOutside: false,
  disableCloseOnInteractOutside: false,
  disableCloseOnInteractOverlay: false,
  disableLockBodyScroll: false,
  disableCloseOnEscape: false
}

const groupConfigs = new Map<ModalGroup, ModalBehaviorOptions>()

export function setGroupConfigs(configs: ModalGroupsConfig) {
  for (const key of Object.keys(configs) as ModalGroup[]) {
    const opts = configs[key]
    if (opts) groupConfigs.set(key, opts)
  }
}

export function getGroupConfig(group: ModalGroup): ModalBehaviorOptions | undefined {
  return groupConfigs.get(group)
}

// Cascade: target props → group config → hardcoded. Returns positive form.
export function resolveBehaviorOptions(
  groupProps: ModalBehaviorOptions | undefined,
  registered: ModalBehaviorOptions | undefined
): ModalEffectiveOptions {
  const pick = <K extends keyof Required<ModalBehaviorOptions>>(key: K): boolean =>
    (groupProps?.[key] ?? registered?.[key] ?? HARDCODED_DEFAULTS[key]) as boolean
  return {
    interactOutside: pick('enableInteractOutside'),
    closeOnInteractOutside: !pick('disableCloseOnInteractOutside'),
    closeOnInteractOverlay: !pick('disableCloseOnInteractOverlay'),
    lockBodyScroll: !pick('disableLockBodyScroll'),
    closeOnEscape: !pick('disableCloseOnEscape')
  }
}
