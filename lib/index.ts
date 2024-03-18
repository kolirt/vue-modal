import ModalTarget from './components/ModalTarget.vue'

export { closeAllModals, closeModal, confirmModal, openModal } from './actions'
export { useLock } from './composables/useLock'
export { isOpened, modals } from './data'
export { $off, $on } from './event'
export { createModal } from './plugin'
export { Events } from './types'
export { ModalTarget }
