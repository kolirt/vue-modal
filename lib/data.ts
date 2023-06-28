import type {Component} from 'vue'
import type {Options} from './types'
import {markRaw, reactive} from 'vue'

export const state = reactive<{
    modals: { component: Component, props?: {} | [] }[]
}>({
    modals: []
})

export function addModal(component: Component, props?: {}, options?: Options) {
    state.modals.push(markRaw({component, props, options}))
}

export function removeModal() {
    state.modals.pop()
}
