<template>
  <v-responsive>
    <h1>
      <span class="d-flex pa-4"
        >Property Management Page
        <v-spacer></v-spacer>
        <v-btn
          class="ml-4"
          :icon="'mdi-refresh'"
          :color="propertyStore.error ? 'error' : undefined"
          v-tooltip="'Refresh'"
          @click="propertyStore.fetchProperties()"
        />
      </span>
    </h1>
    <v-card>
      <v-card-title>Your Properties:</v-card-title>
      <div id="property-panel-container">
        <v-card
          v-for="property in propertyStore.properties"
          :key="property.id"
          :to="'/property/' + property.id"
          :value="property.id"
          rounded
          :style="{
            backgroundColor: getStateColor(property),
            color: 'white',
          }"
          class="pa-4 d-flex flex-column justify-between align-center"
        >
          <b>{{ property.name }}</b>
          <small>{{ property.location }}</small>
          <v-chip
            >{{
              property.parkingSpots.filter(
                (s) => s.state === ParkingSpotState.OCCUPIED,
              ).length
            }}
            / {{ property.parkingSpots.length }}
          </v-chip>
        </v-card>
      </div>
      <div
        class="d-flex w-100 h-100 align-center justify-center"
        v-if="propertyStore.properties.length <= 0"
      >
        No Property present.
      </div>
    </v-card>
  </v-responsive>
</template>

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import { IParkingProperty, ParkingSpotState } from "@cloud-porsche/types";

const propertyStore = usePropertyStore();

function getStateColor(property: IParkingProperty) {
  if (property.parkingSpots.length <= 0) {
    return "grey";
  }
  const occupied = property.parkingSpots.filter(
    (s) => s.state === ParkingSpotState.OCCUPIED,
  ).length;
  if (occupied === property.parkingSpots.length) {
    return "red";
  }
  return "green";
}
</script>

<style scoped lang="scss">
#property-panel-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  padding: 1em;
}
</style>
