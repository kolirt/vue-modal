import type { ModalBehaviorOptions, ModalGroup } from '../../types'

/**
 * Props for `<ModalTarget>` — the mount point for a group's modal stack.
 * Renders `div[data-modal-region]` at `position: fixed; inset: 0` with zero
 * specificity and no built-in `z-index`; set stacking via `[data-modal-region]`
 * in your CSS if another fixed element overlaps the modal.
 */
export interface ModalTargetProps extends ModalBehaviorOptions {
  group: ModalGroup
}
