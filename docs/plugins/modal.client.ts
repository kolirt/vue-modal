import { createModal, type DefineGroups } from '@kolirt/vue-modal'

declare module '@kolirt/vue-modal' {
  interface ModalGroupRegistry extends DefineGroups<['demo']> {}
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createModal({
      groups: {
        demo: {}
      }
    })
  )
})
