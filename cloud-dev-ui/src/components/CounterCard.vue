<template>
  <v-card
    :style="{
      backgroundColor: getCountColor(current, colors, total),
      color: getCountColor(current, colors, total) ? 'white' : undefined,
    }"
    class="pa-4 d-flex flex-column justify-space-evenly align-center text-center"
  >
    <b class="pb-1">{{ name }}</b>
    <span>
      <v-chip class="larger">{{
        current + (total ? " / " + total : "")
      }}</v-chip>
    </span>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  current: number;
  total?: number;
  colors: "default" | "invert" | "none";
}>();

function getCountColor(
  current: number,
  colors: "default" | "invert" | "none",
  total?: number,
) {
  if (!total || colors === "none") return undefined;
  if (current === 0 || total === 0) {
    return colors === "invert" ? "red" : undefined;
  }
  if (current === total) {
    return colors === "invert" ? undefined : "red";
  }
  if (colors === "invert" ? current >= total / 0.65 : current >= total / 1.35) {
    return "yellow";
  }
  return "green";
}
</script>

<style scoped>
.larger {
  scale: 1.2;
}
</style>
