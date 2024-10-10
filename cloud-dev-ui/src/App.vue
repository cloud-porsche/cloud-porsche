<template>
  <v-app :theme="theme">
    <v-app-bar title="Porsche Software Premium">
      <v-spacer />

      <v-btn
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        slim
        text="Toggle Theme"
        @click="onClick"
      />
    </v-app-bar>

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item prepend-icon="mdi-account-multiple" title="Dashboard" value="" @click="navigateTo('/')" />
        <v-list-item prepend-icon="mdi-trash" title="Defects" value="defects" @click="navigateTo('/defects')" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  import router from '@/router'

  const theme = ref('light')

  function onClick () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function navigateTo (path: string) {
    router.push({ path })
  }
</script>

<style lang="scss">
RouterLink {
  text-decoration: none;
}
</style>
