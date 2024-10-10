<template>
  <v-card
    class="mx-auto my-4"
    elevation="16"
    max-width="1000"
  >
    <v-card-item>
      <v-card-title>
        {{ msg }}
      </v-card-title>

      <v-card-subtitle>
        {{ descr }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>

  defineProps({
    msg: String,
    descr: String,
  })

</script>
