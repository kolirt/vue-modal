import type { Component } from 'vue'

import { addModal, findModalById, removeModalById, state, type InternalModalItem } from './state'
import type { CloseFlags, CloseModalOptions, ModalGroup, ModalHandle, OpenModalOptions } from './types'
import { nextModalId } from './utils/idCounter'

export class ModalClosedError extends Error {
  constructor() {
    super('Modal closed.')
    this.name = 'ModalClosedError'
  }
}

export async function requestClose<T>(item: InternalModalItem<T>, opts: CloseModalOptions<T>) {
  if (item.isClosing || item.resolved) return

  if (!opts.ignoreGuard) {
    for (const guard of item.beforeCloseGuards.slice()) {
      const result = await guard()
      if (result === false) return
    }
  }

  item.isClosing = true
  item.pendingClose = opts
  item.present = false

  if (opts.instantExit) finalizeModal(item.id)
}

export function finalizeModal(id: number) {
  const item = findModalById(id)
  if (!item || item.resolved) return

  const close = item.pendingClose || { success: false }
  item.resolved = true
  removeModalById(id)
  if (close.success) item.resolve(close.data)
  else item.reject(new ModalClosedError())
}

export function openModal<T = unknown, C extends Component = Component>(
  component: C,
  options?: OpenModalOptions<C>
): ModalHandle<T> {
  const id = nextModalId()
  const componentGroup = (component as { modalGroup?: ModalGroup }).modalGroup
  const group = (options?.group ?? componentGroup) as ModalGroup
  if (!group) {
    throw new Error(
      '[@kolirt/vue-modal] openModal() requires a `group` option (or `defineOptions({ modalGroup: ... })` on the component).'
    )
  }

  let resolveFn!: (v: T) => void
  let rejectFn!: (r?: unknown) => void
  const promise = new Promise<T>((resolve, reject) => {
    resolveFn = resolve
    rejectFn = reject
  })

  const handlers: Record<string, ((...args: any[]) => void)[]> = {}
  const listeners: Record<string, (...args: any[]) => void> = {}

  function syncListener(event: string) {
    listeners[event] = (...args) => {
      for (const fn of handlers[event]?.slice() || []) fn(...args)
    }
  }

  if (options?.on) {
    for (const [event, fn] of Object.entries(options.on)) {
      if (typeof fn === 'function') {
        ;(handlers[event] ||= []).push(fn)
        syncListener(event)
      }
    }
  }

  const item: InternalModalItem<T> = {
    id,
    group,
    component,
    props: (options?.props as Record<string, unknown>) || {},
    listeners,
    present: true,
    isClosing: false,
    instantEnter: options?.instantEnter ?? false,
    resolve: resolveFn,
    reject: rejectFn,
    resolved: false,
    beforeCloseGuards: [],
    pendingClose: null
  }

  addModal(item as InternalModalItem)

  const handle: ModalHandle<T> = Object.assign(promise, {
    id,
    group,
    close(opts?: CloseModalOptions<T>) {
      requestClose(item, opts || {})
    },
    on(event: string, handler: (...args: any[]) => void) {
      ;(handlers[event] ||= []).push(handler)
      if (!listeners[event]) syncListener(event)
    },
    off(event: string, handler: (...args: any[]) => void) {
      const arr = handlers[event]
      if (!arr) return
      const i = arr.indexOf(handler)
      if (i >= 0) arr.splice(i, 1)
    }
  })

  return handle
}

export async function closeModal<T = unknown>(opts?: CloseModalOptions<T> & { group?: ModalGroup }) {
  const pool = opts?.group ? state.modals.filter((m) => m.group === opts.group) : state.modals
  const top = pool[pool.length - 1]
  if (!top) return
  await requestClose(top as InternalModalItem<T>, opts || {})
}

export async function closeModalById<T = unknown>(id: number, opts?: CloseModalOptions<T>) {
  const item = findModalById(id) as InternalModalItem<T> | undefined
  if (!item) return
  await requestClose(item, opts || {})
}

export interface CloseManyResult {
  closed: number
  vetoed: number
}

async function closeMany(items: InternalModalItem[], opts?: CloseFlags): Promise<CloseManyResult> {
  let closed = 0
  let vetoed = 0
  // Snapshot iteration: state.modals can mutate during awaits.
  for (let i = items.length - 1; i >= 0; i--) {
    const before = items[i].isClosing || items[i].resolved
    await requestClose(items[i], { ignoreGuard: opts?.ignoreGuard, instantExit: opts?.instantExit })
    const after = items[i].isClosing || items[i].resolved
    if (!before && after) closed++
    else if (!opts?.ignoreGuard) vetoed++
  }
  return { closed, vetoed }
}

export function closeAllModals(opts?: CloseFlags) {
  return closeMany(state.modals.slice(), opts)
}

export function closeModalsByGroup(group: ModalGroup, opts?: CloseFlags) {
  return closeMany(
    state.modals.filter((m) => m.group === group),
    opts
  )
}

export function replaceModal<T = unknown, C extends Component = Component>(
  component: C,
  options?: OpenModalOptions<C>
): ModalHandle<T> {
  const componentGroup = (component as { modalGroup?: ModalGroup }).modalGroup
  const targetGroup = (options?.group ?? componentGroup) as ModalGroup
  if (!targetGroup) {
    throw new Error(
      '[@kolirt/vue-modal] replaceModal() requires a `group` option (or `defineOptions({ modalGroup: ... })` on the component).'
    )
  }

  for (let i = state.modals.length - 1; i >= 0; i--) {
    if (state.modals[i].group === targetGroup) {
      requestClose(state.modals[i], { ignoreGuard: true, instantExit: true })
      break
    }
  }

  return openModal<T, C>(component, options)
}
