const baseURL = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  },
  seo: {
    title: '@kolirt/vue-modal',
    description: 'Promise-based, headless Vue 3 modal library built on reka-ui.'
  },
  header: {
    title: '@kolirt/vue-modal',
    logo: {
      light: `${baseURL}/logo.png`,
      dark: `${baseURL}/logo.png`,
      alt: '@kolirt/vue-modal'
    }
  },
  socials: {
    buymeacoffee: 'https://buymeacoffee.com/kolirt'
  },
  github: {
    url: 'https://github.com/kolirt/vue-modal',
    branch: 'master',
    rootDir: 'docs'
  },
  docus: {
    locale: 'en'
  }
})
