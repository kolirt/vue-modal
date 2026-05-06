<script setup lang="ts">
const appConfig = useAppConfig()
const { forced: forcedColorMode } = useDocusColorMode()

const { isEnabled: isAssistantEnabled } = useAssistant()
const { isEnabled, locales } = useDocusI18n()
const { subNavigationMode } = useSubNavigation()

const links = computed(() => {
  const out: Array<Record<string, string>> = []

  const buymeacoffee = appConfig.socials?.buymeacoffee as string | undefined
  if (buymeacoffee) {
    out.push({
      icon: 'i-simple-icons-buymeacoffee',
      to: buymeacoffee,
      target: '_blank',
      'aria-label': 'Buy me a coffee'
    })
  }

  if (appConfig.github && appConfig.github.url) {
    out.push({
      icon: 'i-simple-icons-github',
      to: appConfig.github.url,
      target: '_blank',
      'aria-label': 'GitHub'
    })
  }

  return out
})
</script>

<template>
  <UHeader :class="{ 'flex flex-col': subNavigationMode === 'header' }" :ui="{ center: 'flex-1' }">
    <AppHeaderCenter />

    <template #left>
      <AppHeaderLeft />
    </template>

    <template #right>
      <template v-if="isAssistantEnabled">
        <AssistantChat />
      </template>

      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>

        <USeparator orientation="vertical" class="h-8" />
      </template>

      <UContentSearchButton class="lg:hidden" />

      <template v-if="links?.length">
        <UButton v-for="(link, index) of links" :key="index" v-bind="{ color: 'neutral', variant: 'ghost', ...link }" />
      </template>

      <ClientOnly v-if="!forcedColorMode">
        <UColorModeButton />

        <template #fallback>
          <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        </template>
      </ClientOnly>
    </template>

    <template #toggle="{ open, toggle }">
      <IconMenuToggle @click="toggle" :open="open" class="lg:hidden" />
    </template>

    <template #body>
      <AppHeaderBody />
    </template>

    <template v-if="subNavigationMode === 'header'" #bottom>
      <AppHeaderBottom />
    </template>
  </UHeader>
</template>
