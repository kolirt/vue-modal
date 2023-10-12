import EventBus from 'js-event-bus'

import type { Events } from './types'

const eventBus = new EventBus()

export function $emit(event: Events, ...args: any[]) {
  eventBus.emit(event, null, ...args)
}

export function $on(event: Events, callback: (...args: any) => void) {
  eventBus.on(event, callback)
}

export function $off(event: Events, callback: (...args: any) => void) {
  eventBus.detach(event, callback)
}
