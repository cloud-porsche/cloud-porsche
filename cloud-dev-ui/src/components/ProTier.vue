<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { TenantTier } from "@cloud-porsche/types";

const locked = computed(
  () => useAppStore().tenant.info?.tier === TenantTier.FREE,
);

const model = defineModel();

watch(locked, (locked) => {
  if (locked) {
    model.value = false;
  }
});
</script>

<template>
  <div v-if="locked" class="ma-1 position-relative locked-border rounded">
    <a
      class="star-anchor"
      target="_blank"
      href="https://tenant-management-750687370557.europe-west4.run.app/#pricing"
    >
      <v-icon
        icon="mdi-shimmer"
        color="primary"
        v-tooltip:top="'Upgrade to Pro to unlock this feature!'"
      ></v-icon>
    </a>
    <div class="pointer-events-none blur opacity-40" v-bind="$attrs">
      <slot></slot>
    </div>
  </div>
  <div v-else v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}

.blur {
  filter: blur(5px);
}

.star-anchor {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0.5rem;
  z-index: 1;

  translate: -50% -50%;
}

.locked-border {
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  position: relative;
  border-radius: 0.5rem;
}
</style>
