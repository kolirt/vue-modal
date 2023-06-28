import type {Component} from 'vue'
// import type {Options} from './types'
import {Events} from './types'
import {addModal, state as stateData} from './data'
import {$emit, $off, $on} from './event'

export function openModal(component: Component, props?: {}/*, options?: Options*/) {
    const index = stateData.modals.length
    addModal(component, props/*, options*/)

    return new Promise((resolve, reject) => {
        function onClosed(data: any) {
            if (data.index === index) {
                $off(Events.Closed, onClosed)
                if (data.success) {
                    resolve(data.data)
                } else {
                    reject()
                }
            }
        }

        $on(Events.Closed, onClosed)
    })
}

export function closeModal() {
    $emit(Events.Close, {success: false})
}

export function confirmModal(data?: any) {
    $emit(Events.Close, {success: true, data})
}
