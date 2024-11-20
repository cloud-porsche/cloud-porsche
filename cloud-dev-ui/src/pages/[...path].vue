<template>
  <v-responsive>
    <h1>Nothing here</h1>
    <p>You will be redirected to the home page in {{ counter }} seconds.</p>
  </v-responsive>
</template>

<script lang="ts" setup>
import router from "@/router";

const counter = ref(5);

setInterval(() => {
  counter.value -= 1;
  if (counter.value === 0) {
    router.push("/");
  } else if (counter.value < 0) {
    counter.value = 0;
  }
}, 1000);
</script>
