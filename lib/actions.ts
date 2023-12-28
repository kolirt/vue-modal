import type { AllowedComponentProps, Component, VNodeProps } from 'vue'

import { addModal, state as stateData } from './data'
import { $emit, $off, $on } from './event'
import type { CloseEventData, ClosedEventData, OpenModalOptions } from './types'
import { Events } from './types'

export type ExtractComponentProps<TComponent> = TComponent extends new () => { $props: infer P }
  ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps | keyof Array<any>>
  : never

export async function openModal<T = unknown, C extends Component = Component>(
  component: C,
  props: ExtractComponentProps<C> extends Record<string, never> ? {} : ExtractComponentProps<C>,
  options?: OpenModalOptions
) {
  if (options?.force && stateData.modals.length) {
    await closeAllModals(false)
  }

  const currentId = stateData.modals.length
  addModal({
    id: currentId,
    component,
    props,
    options: options || {}
  })
  $emit(Events.Open)

  return new Promise<T>((resolve, reject) => {
    function onClosed(data: ClosedEventData) {
      if (data.id === currentId) {
        $off(Events.Closed, onClosed)
        data.success ? resolve(data.data) : reject('Modal closed.')
      }
    }

    $on(Events.Closed, onClosed)
  })
}

export function confirmModal<T>(data?: T): Promise<T> {
  return new Promise((resolve) => {
    function onClosed(data: any) {
      $off(Events.Closed, onClosed)
      resolve(data.data)
    }

    $on(Events.Closed, onClosed)
    $emit(Events.Close, { success: true, data } as CloseEventData<T>)
  })
}

export function closeModal(): Promise<void> {
  return new Promise((resolve) => {
    function onClosed() {
      $off(Events.Closed, onClosed)
      resolve()
    }

    $on(Events.Closed, onClosed)
    $emit(Events.Close, { success: false } as CloseEventData)
  })
}

export function closeAllModals(forceCloseAll = true): Promise<void> {
  return new Promise((resolve) => {
    function onClosed() {
      $off(Events.Closed, onClosed)

      for (let i = stateData.modals.length - 1; i >= 0; i--) {
        stateData.modals.splice(i, 1)
        $emit(Events.Closed, {
          id: i,
          success: false
        } as ClosedEventData)
      }

      resolve()
    }

    $on(Events.Closed, onClosed)
    $emit(Events.Close, { success: false, forceCloseAll } as CloseEventData)
  })
}
