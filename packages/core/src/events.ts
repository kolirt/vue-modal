import type { ModalGroup, ModalItem } from './types'

export type ModalOpenHandler = (modal: ModalItem) => void
export type ModalCloseHandler = (modal: ModalItem) => void

interface EventChannel<H> {
  global: H[]
  groups: Map<PropertyKey, H[]>
}

function createChannel<H>(): EventChannel<H> {
  return { global: [], groups: new Map<PropertyKey, H[]>() }
}

function subscribe<H>(
  channel: EventChannel<H>,
  groupOrHandler: ModalGroup | H,
  maybeHandler: H | undefined
): () => void {
  if (typeof groupOrHandler === 'function') {
    const handler = groupOrHandler as H
    channel.global.push(handler)
    return () => {
      const i = channel.global.indexOf(handler)
      if (i >= 0) channel.global.splice(i, 1)
    }
  }

  const group = groupOrHandler as PropertyKey
  const handler = maybeHandler as H
  let arr = channel.groups.get(group)
  if (!arr) {
    arr = []
    channel.groups.set(group, arr)
  }
  arr.push(handler)
  return () => {
    const list = channel.groups.get(group)
    if (!list) return
    const i = list.indexOf(handler)
    if (i < 0) return
    list.splice(i, 1)
    if (list.length === 0) channel.groups.delete(group)
  }
}

function emit(channel: EventChannel<(modal: ModalItem) => void>, modal: ModalItem, label: string) {
  for (const fn of channel.global.slice()) {
    try {
      fn(modal)
    } catch (err) {
      console.error(`[@kolirt/vue-modal] ${label} handler error:`, err)
    }
  }
  const arr = channel.groups.get(modal.group as PropertyKey)
  if (!arr) return
  for (const fn of arr.slice()) {
    try {
      fn(modal)
    } catch (err) {
      console.error(`[@kolirt/vue-modal] ${label} handler error:`, err)
    }
  }
}

const openChannel = createChannel<ModalOpenHandler>()
const closeChannel = createChannel<ModalCloseHandler>()

/**
 * Subscribe to modal-open events, globally or for one `group`.
 * Returns an unsubscribe function. Handler errors are caught and logged.
 */
export function onModalOpen(handler: ModalOpenHandler): () => void
export function onModalOpen(group: ModalGroup, handler: ModalOpenHandler): () => void
export function onModalOpen(
  groupOrHandler: ModalGroup | ModalOpenHandler,
  maybeHandler?: ModalOpenHandler
): () => void {
  return subscribe(openChannel, groupOrHandler, maybeHandler)
}

/**
 * Subscribe to modal-close events, globally or for one `group`.
 * Returns an unsubscribe function. Handler errors are caught and logged.
 */
export function onModalClose(handler: ModalCloseHandler): () => void
export function onModalClose(group: ModalGroup, handler: ModalCloseHandler): () => void
export function onModalClose(
  groupOrHandler: ModalGroup | ModalCloseHandler,
  maybeHandler?: ModalCloseHandler
): () => void {
  return subscribe(closeChannel, groupOrHandler, maybeHandler)
}

export function emitModalOpen(modal: ModalItem) {
  emit(openChannel, modal, 'onModalOpen')
}

export function emitModalClose(modal: ModalItem) {
  emit(closeChannel, modal, 'onModalClose')
}
