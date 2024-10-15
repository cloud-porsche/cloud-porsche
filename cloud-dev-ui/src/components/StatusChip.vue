<template>
  <v-chip
    :color="toStatusColor(defect.status)"
    :text="toStatusText(defect.status)"
    class="text-uppercase"
    size="small"
    label
  />
</template>

<script setup lang="ts">
import { DefectState, IDefect } from "@cloud-porsche/types";

defineProps<{
  defect: Pick<IDefect, "status">;
}>();

function toStatusText(status: DefectState) {
  switch (status) {
    case DefectState.OPEN:
      return "Open";
    case DefectState.IN_WORK:
      return "In Work";
    case DefectState.REJECTED:
      return "Rejected";
    case DefectState.DONE:
      return "Done";
    default:
      return "Unknown";
  }
}

function toStatusColor(status: DefectState) {
  switch (status) {
    case DefectState.OPEN:
      return "green";
    case DefectState.IN_WORK:
      return "blue";
    case DefectState.REJECTED:
      return "red";
    case DefectState.DONE:
      return "grey";
    default:
      return "black";
  }
}
</script>

<style scoped></style>
