<template>
  <v-card
    width="100%"
    height="100%"
    class="d-flex flex-column justify-center align-center"
  >
    <div class="text-center px-4">
      <h1 class="mb-3">Monthly API Limit Reached</h1>
      <p class="mb-5">
        You have reached your monthly limit of free API calls. To continue using
        the service, you can wait until your quota resets next month or upgrade
        to a paid plan.
      </p>
      <v-btn
        color="primary"
        class="mb-3"
        @click="signOut(getAuth()).then(() => router.push('/'))"
        >Sign Out
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";

const router = useRouter();
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
