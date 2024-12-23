<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { activeHeadings, updateHeadings } = useScrollspy();

const router = useRouter();

const links = computed(() =>
  router.currentRoute.value.path === "/"
    ? [
        {
          label: "Features",
          to: "#features",
          icon: "i-heroicons-cube-transparent",
          active:
            activeHeadings.value.includes("features") &&
            !activeHeadings.value.includes("pricing"),
        },
        {
          label: "Pricing",
          to: "#pricing",
          icon: "i-heroicons-credit-card",
          active:
            activeHeadings.value.includes("pricing") &&
            !activeHeadings.value.includes("testimonials"),
        },
        {
          label: "Testimonials",
          to: "#testimonials",
          icon: "i-heroicons-academic-cap",
          active: activeHeadings.value.includes("testimonials"),
        },
        {
          label: "FAQ",
          to: "#faq",
          icon: "i-heroicons-question-mark-circle",
          active: activeHeadings.value.includes("faq"),
        },
      ]
    : [],
);

nuxtApp.hooks.hookOnce("page:finish", () => {
  updateHeadings([
    document.querySelector("#features"),
    document.querySelector("#pricing"),
    document.querySelector("#testimonials"),
    document.querySelector("#faq"),
  ]);
});
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Cloud Porsche
      <UBadge label="Landing" variant="subtle" class="mb-0.5" />
    </template>

    <template #right>
      <UColorModeButton size="md" />
    </template>

    <template #panel>
      <UAsideLinks :links="links" v-if="onLandingPage" />

      <UDivider class="my-6" />

      <UButton label="Sign in" color="white" block class="mb-3" />
      <UButton label="Get started" block />
    </template>
  </UHeader>
</template>
