import type { Component } from 'vue'

import { addModal, state as stateData } from './data'
import { $emit, $off, $on } from './event'
import type { CloseEventData, OpenModalOptions } from './types'
import { Events } from './types'

export async function openModal<T = unknown>(component: Component, props?: {}, options?: OpenModalOptions) {
  if (options?.force && stateData.modals.length) {
    await closeAllModals(false)
  }

  const index = stateData.modals.length
  addModal(component, props, options)
  $emit(Events.Open)

  return new Promise<T>((resolve, reject) => {
    function onClosed(data: any) {
      if (data.index === index) {
        $off(Events.Closed, onClosed)
        data.success ? resolve(data.data) : reject('Modal closed.')
      }
    }

    $on(Events.Closed, onClosed)
  })
}

export function confirmModal(data?: any): Promise<any> {
  return new Promise((resolve) => {
    function onClosed(data: any) {
      $off(Events.Closed, onClosed)
      resolve(data.data)
    }

    $on(Events.Closed, onClosed)
    $emit(Events.Close, { success: true, data } as CloseEventData)
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
          index: i,
          success: false
        })
      }

      resolve()
    }

    $on(Events.Closed, onClosed)
    $emit(Events.Close, { success: false, forceCloseAll } as CloseEventData)
  })
}
