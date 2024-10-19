<template>
  <v-footer app height="40">
    <span class="w-75 overflow-hidden d-inline-flex">
      <a
        v-for="item in items"
        :key="item.title"
        class="d-inline-flex mx-2 social-link flex-nowrap text-no-wrap"
        :href="item.href"
        rel="noopener noreferrer"
        target="_blank"
        :title="item.title"
      >
        {{ item.title }}
        <v-icon :icon="item.icon" class="ms-2" />
      </a>
    </span>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px"
    >
      &copy; {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">Cloud Porsche AG</span>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const items = computed(() => {
  return [
    {
      title: mobile.value ? "T.H." : "Timo Haas",
      icon: `mdi-github`,
      href: "https://github.com/haasentimo",
    },
    {
      title: mobile.value ? "O.B." : "Oskar Borkenhagen",
      icon: `mdi-github`,
      href: "https://github.com/Ostabo",
    },
    {
      title: mobile.value ? "L.B." : "Lars Bürger",
      icon: `mdi-github`,
      href: "https://github.com/LarsBuergerr",
    },
  ];
});
</script>

<style scoped lang="sass">
a
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
