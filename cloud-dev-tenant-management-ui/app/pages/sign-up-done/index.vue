<script setup lang="ts"></script>

<template>
  <UContainer class="flex flex-col justify-center items-center p-12 m-12">
    <UCard class="min-w-96 p-4">
      <template #header>
        <h1 class="text-2xl font-bold">Thank you!</h1>
      </template>
      <template #default>
        <p class="text-gray-600 dark:text-gray-400">
          You have successfully signed up for Cloud Porsche. We will sent you an
          email with further instructions, once everything is ready. <br />
          <small>This might take a few minutes.</small>
        </p>
      </template>
    </UCard>
  </UContainer>
</template>
