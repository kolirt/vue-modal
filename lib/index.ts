import ModalTarget from './components/ModalTarget.vue'

export { useLock } from './composables/useLock'

export { openModal, confirmModal, closeModal, closeAllModals } from './actions'

export { isOpened, modals } from './data'

export { $on, $off } from './event'

export { createModal } from './plugin'

export { Events } from './types'

export { ModalTarget }
