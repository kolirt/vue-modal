export default defineNuxtConfig({
  extends: ['docus'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  site: {
    name: '@kolirt/vue-modal'
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }]
    }
  },
  mdc: {
    highlight: {
      shikiEngine: 'javascript'
    }
  },
  compatibilityDate: '2025-07-22'
})
