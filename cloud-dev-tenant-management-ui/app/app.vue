<script setup lang="ts">
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "author", content: "Cloud Porsche" },
    { name: "description", content: "Cloud Porsche - Landing Page" },
  ],
  link: [
    { rel: "shortcut icon", href: "/favicon.ico" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon-48x48.png",
      sizes: "48x48",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      prefetch: "true",
      href: "/hero.png",
      as: "image",
    },
    {
      prefetch: "true",
      href: "/hero-light.png",
      as: "image",
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  ogImage: "/hero.png",
  twitterImage: "/hero.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <AppHeader />

  <UMain>
    <NuxtPage />
  </UMain>

  <AppFooter />

  <UNotifications />
</template>
