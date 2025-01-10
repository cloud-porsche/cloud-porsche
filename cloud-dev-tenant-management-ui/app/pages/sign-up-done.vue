<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const plan = computed(() => router.currentRoute.value.query.plan);
const tenantId = computed(() => router.currentRoute.value.query.tenantId);
const badgeUrl = computed(() => {
  const url = router.currentRoute.value.query.badgeUrl;
  return Array.isArray(url) ? url[0] : url;
});

const baseUrl = "https://cloud-porsche.github.io/cloud-porsche/#/";
</script>

<template>
  <ULandingSection class="p-12 m-12">
    <UCard class="min-w-96 p-4">
      <template #header>
        <h1 class="text-2xl font-bold">Thank you!</h1>
      </template>
      <template #default>
        <p class="text-gray-600 dark:text-gray-400">
          You have successfully signed up for Cloud Porsche. Come here to check
          on your application status. <br />
          <span class="flex items-center">
            Workflow:
            <a
              href="https://github.com/cloud-porsche/cloud-porsche/actions/workflows/terraform.yml"
            >
              <nuxt-img
                :src="badgeUrl"
                alt="Status Badge"
                class="min-w-48 object-cover border-gradient rounded-xl p-4"
              ></nuxt-img
            ></a>
          </span>
          Once everything is ready you can access the application at:
          <br />
          <a :href="`${baseUrl}${tenantId}`" class="underline text-blue-500"
            >{{ baseUrl }}{{ tenantId }}</a
          >
        </p>
      </template>
      <template #footer>
        <small>
          The registering process might take a few minutes.<br />
          <span class="flex items-center text-center align-middle">
            Should any issues arise, please contact us at:
            <a
              class="p-2 flex items-center"
              href="https://github.com/cloud-porsche/cloud-porsche/issues"
            >
              <UIcon name="i-simple-icons-github"></UIcon>
            </a>
          </span>
        </small>
      </template>
    </UCard>
  </ULandingSection>
</template>
