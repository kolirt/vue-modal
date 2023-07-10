import type {Component} from 'vue'
import type {Options} from './types'
import {computed, markRaw, reactive} from 'vue'

export const state = reactive<{
    modals: { component: Component, props?: {} | [] }[]
}>({
    modals: []
})

export const isOpened = computed(() => state.modals.length > 0)

export function addModal(component: Component, props?: {}, options?: Options) {
    state.modals.push(markRaw({component, props, options}))
}

export function removeModal() {
    state.modals.pop()
}
