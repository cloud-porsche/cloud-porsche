<template>
  <v-card
    :color="getStateColor(spot.state)"
    @click="disableDialog ? openDialog(spot) : undefined"
    :disabled="spot.placeholder"
    border
    flat
    width="1em"
    v-tooltip:bottom="explanation?.length! > 0 ? explanation : undefined"
    :class="spot.placeholder ? 'disabled-spot' : ''"
    class="spot d-flex align-center justify-center"
  >
    <i v-if="spot.electricCharging" class="mdi mdi-flash text-yellow"></i
  ></v-card>

  <v-dialog v-model="inspectDialog" max-width="50%" max-height="80%">
    <v-card rounded class="overflow-hidden">
      <v-card-title>
        <span class="d-flex text-center align-center"
          >Parking Spot
          <v-spacer />
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn></span
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-data-table
          v-if="selectedSpot"
          :items="Object.entries(selectedSpot)"
          density="compact"
          hide-default-header
          hide-default-footer
        >
        </v-data-table>
        <v-row v-else>
          <v-col> No parking spot selected.</v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ParkingSpot, ParkingSpotState } from "@cloud-porsche/types";

defineProps<{
  spot: ParkingSpot;
  disableDialog?: boolean;
  explanation?: string;
}>();

const inspectDialog = ref(false);
const selectedSpot = ref<ParkingSpot>();

function getStateColor(state: ParkingSpotState) {
  switch (state) {
    case ParkingSpotState.FREE:
      return undefined;
    case ParkingSpotState.OCCUPIED:
      return "green";
    case ParkingSpotState.RESERVED:
      return "yellow";
    case ParkingSpotState.OUT_OF_ORDER:
      return "red";
    default:
      return "black";
  }
}

function openDialog(spot: ParkingSpot) {
  inspectDialog.value = true;
  selectedSpot.value = spot;
}

function closeDialog() {
  inspectDialog.value = false;
  setTimeout(() => (selectedSpot.value = undefined), 200);
}
</script>

<style scoped lang="scss">
.spot {
  aspect-ratio: 1 / 1.5;
  min-width: 2em;
  max-width: 5em;
  transition: scale 0.2s linear;

  &:hover {
    scale: 1.02;
  }
}

.disabled-spot {
  border: 0;
  background-color: transparent !important;
}
</style>
