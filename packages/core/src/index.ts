export {
  ModalClosedError,
  closeAllModals,
  closeModal,
  closeModalById,
  closeModalsByGroup,
  openModal,
  replaceModal
} from './actions'
export type { CloseManyResult } from './actions'
export { ModalContent, ModalDescription, ModalRoot, ModalTitle } from './components/modal'
export type { ModalRootProps } from './components/modal'
export { ModalOverlay, ModalTarget } from './components/target'
export type { ModalTargetProps } from './components/target'
export { useModal } from './composables/useModal'
export type { UseModalDefaults } from './composables/useModal'
export { useModalContext } from './composables/useModalContext'
export { createModal } from './plugin'
export type { CreateModalOptions } from './plugin'
export { groupModals, isGroupOpen, isOpened, modals } from './state'
export type {
  BeforeCloseHandler,
  CloseFlags,
  CloseModalOptions,
  DefineGroups,
  ExtractComponentProps,
  ModalBehaviorOptions,
  ModalEffectiveOptions,
  ModalGroup,
  ModalGroupRegistry,
  ModalGroupsConfig,
  ModalHandle,
  ModalItem,
  OpenModalOptions
} from './types'
