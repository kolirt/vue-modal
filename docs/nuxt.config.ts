export default defineNuxtConfig({
  extends: ['docus'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  site: {
    name: '@kolirt/vue-modal'
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: `${(process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')}/logo.png`
        }
      ]
    }
  },
  mdc: {
    highlight: {
      shikiEngine: 'javascript'
    }
  },
  image: {
    provider: 'none'
  },
  compatibilityDate: '2025-07-22'
})
