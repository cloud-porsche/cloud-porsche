<template>
  <v-responsive>
    <h1>
      <span class="d-flex pa-4"
        >Property Page with id: {{ property?.id ?? "Unknown" }}
        <v-spacer></v-spacer>
        <v-btn
          class="ml-4"
          :icon="'mdi-refresh'"
          v-tooltip="'Refresh'"
          @click="propertyStore.fetchProperties()"
        />
      </span>
    </h1>
    <v-card v-if="property">
      <v-card-title>{{ property.name }}</v-card-title>
      <div id="spot-container">
        <v-card
          v-for="spot in property.parkingSpots"
          :key="spot.id"
          :color="getStateColor(spot.state)"
          @click="openDialog(spot)"
          class="spot"
        ></v-card>
      </div>
    </v-card>
  </v-responsive>

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

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import { ParkingSpot, ParkingSpotState } from "@cloud-porsche/types";
import { useRoute } from "vue-router";

const inspectDialog = ref(false);
const selectedSpot = ref<ParkingSpot>();

const route = useRoute();
const id = (route.params as any)["id"];

const propertyStore = usePropertyStore();
const property = computed(() =>
  propertyStore.properties.find((property) => property.id === id),
);

function getStateColor(state: ParkingSpotState) {
  switch (state) {
    case ParkingSpotState.FREE:
      return "grey";
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
#spot-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(1em, 1fr));
  gap: 0.2em;

  padding: 1em;
}

.spot {
  aspect-ratio: 1 / 1.5;
  min-width: 1em;
  max-width: 5em;
  transition: scale 0.2s linear;

  &:hover {
    scale: 1.02;
  }
}
</style>
