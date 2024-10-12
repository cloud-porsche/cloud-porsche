<template>
  <v-footer app height="40">
    <a
      v-for="item in items"
      :key="item.title"
      class="d-inline-block mx-2 social-link"
      :href="item.href"
      rel="noopener noreferrer"
      target="_blank"
      :title="item.title"
    >
      {{ item.title }}
      <v-icon
        :icon="item.icon"
      />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; 2024-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Cloud Porsche AG</span>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  const items = [
    {
      title: 'Timo Haas',
      icon: `mdi-github`,
      href: 'https://github.com/haasentimo',
    },
    {
      title: 'Oskar Borkenhagen',
      icon: `mdi-github`,
      href: 'https://github.com/Ostabo',
    },
    {
      title: 'Lars Bürger',
      icon: `mdi-github`,
      href: 'https://github.com/LarsBuergerr',
    },
  ]
</script>

<style scoped lang="sass">
  a
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
