<template>
  <v-responsive>
    <h1>Nothing here</h1>
    <p>You will be redirected to the home page in {{ counter }} seconds.</p>
  </v-responsive>
</template>

<script lang="ts" setup>
const counter = ref(5);

setInterval(() => {
  counter.value -= 1;
  if (counter.value === 0) {
    window.location.href = "/#/";
  }
}, 1000);
</script>
