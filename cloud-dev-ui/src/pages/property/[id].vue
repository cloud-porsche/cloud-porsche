<template>
  <v-toolbar
    v-if="property"
    density="compact"
    class="d-flex align-center pa-1 pl-4 pr-4"
  >
    <span
      ><b>Id: {{ property.id ?? "Unknown" }}</b></span
    >
    <v-btn
      class="ml-4"
      density="comfortable"
      :icon="'mdi-sync'"
      v-tooltip="'Refresh'"
      @click="
        propertyStore.fetchProperty(property.id);
        propertyStore.fetchSimulationStatus(property.id);
      "
    />
    <v-spacer></v-spacer>
    <v-btn
      density="comfortable"
      :append-icon="simulationState ? 'mdi-pause' : 'mdi-play'"
      text="Simulation"
      @click="
        simulationState
          ? propertyStore.setSimulationInactive(property.id)
          : propertyStore.setSimulationActive(property.id)
      "
    />
  </v-toolbar>
  <v-progress-linear
    :indeterminate="propertyStore.loading"
    :color="propertyStore.error ? 'error' : undefined"
  ></v-progress-linear>
  <v-responsive v-if="property">
    <main class="property-main">
      <CounterCard
        name="FREE"
        :current="freeSpots.length"
        :total="totalSpots"
        colors="invert"
      ></CounterCard>
      <CounterCard
        name="OCCUPIED"
        :current="occupiedSpots.length"
        :total="totalSpots"
        colors="default"
      ></CounterCard>
      <CounterCard
        name="RESERVED"
        :current="reservedSpots.length"
        :total="totalSpots"
        colors="none"
      ></CounterCard>
      <CounterCard
        name="OUT OF ORDER"
        :current="outOfOrderSpots.length"
        colors="none"
      ></CounterCard>
      <CounterCard
        name="CUSTOMERS"
        v-tooltip:bottom="'Count of total daily customers'"
        :current="customers.length"
        colors="none"
      ></CounterCard>
      <v-card class="legend">
        <v-card-title class="d-flex ga-2 align-center"
          >Legend
          <v-icon
            size="sm"
            v-tooltip:top="'Hover to see what each spot represents'"
            >mdi-information-outline
          </v-icon>
        </v-card-title>
        <v-card-item>
          <span class="d-flex align-center justify-space-evenly">
            <ParkingSpotComponent
              v-for="spot in exampleSpots"
              :key="spot.id"
              :spot="spot"
              :explanation="spot.explanation"
            ></ParkingSpotComponent>
          </span>
        </v-card-item>
      </v-card>
      <v-card class="full-grid-row">
        <v-card-title>{{ property.name }}</v-card-title>
        <div
          id="spot-container"
          v-if="property.parkingSpots.length > 0"
          :style="
            property.visualLayers?.length > 0
              ? {
                  gridTemplateColumns: `repeat(${property.visualLayers[0].columns}, 1fr)`,
                }
              : {}
          "
        >
          <ParkingSpotComponent
            v-for="spot in property.parkingSpots"
            :key="spot.id"
            :spot="spot"
          ></ParkingSpotComponent>
        </div>
        <v-card-text v-else class="pa-4">
          <i>No parking spots yet.</i>
        </v-card-text>
      </v-card>
    </main>
  </v-responsive>
</template>

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import { ParkingSpot, ParkingSpotState } from "@cloud-porsche/types";
import { useRoute } from "vue-router";
import CounterCard from "@/components/CounterCard.vue";
import ParkingSpotComponent from "@/components/ParkingSpotComponent.vue";

const propertyStore = usePropertyStore();
const route = useRoute();
const id = computed(() => (route.params as any)["id"]);
onMounted(() => propertyStore.fetchSimulationStatus(id.value));

const simulationState = computed(() =>
  propertyStore.simulationActive.includes(id.value),
);
const property = computed(() =>
  propertyStore.properties.find((property) => property.id === id.value),
);

const totalSpots = computed(() => property.value?.parkingSpots.length ?? 0);
const freeSpots = computed(
  () =>
    property.value?.parkingSpots.filter(
      (s) => s.state === ParkingSpotState.FREE,
    ) ?? [],
);
const occupiedSpots = computed(
  () =>
    property.value?.parkingSpots.filter(
      (s) => s.state === ParkingSpotState.OCCUPIED,
    ) ?? [],
);
const reservedSpots = computed(
  () =>
    property.value?.parkingSpots.filter(
      (s) => s.state === ParkingSpotState.RESERVED,
    ) ?? [],
);
const outOfOrderSpots = computed(
  () =>
    property.value?.parkingSpots.filter(
      (s) => s.state === ParkingSpotState.OUT_OF_ORDER,
    ) ?? [],
);

const customers = computed(() => property.value?.customers ?? []);

const exampleSpots: (ParkingSpot & { explanation: string })[] = [
  {
    id: "Electric",
    state: ParkingSpotState.FREE,
    electricCharging: true,
    lastStateChange: new Date(),
    customer: null,
    placeholder: false,
    explanation: "Electric charging spot",
  },
  {
    id: "Free",
    state: ParkingSpotState.FREE,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    placeholder: false,
    explanation: "Free spot",
  },
  {
    id: "Occupied",
    state: ParkingSpotState.OCCUPIED,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    placeholder: false,
    explanation: "Occupied spot",
  },
  {
    id: "Reserved",
    state: ParkingSpotState.RESERVED,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    placeholder: false,
    explanation: "Reserved spot",
  },
  {
    id: "Out of Order",
    state: ParkingSpotState.OUT_OF_ORDER,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    placeholder: false,
    explanation: "Spot out of order",
  },
];
</script>

<style scoped lang="scss">
.property-main {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto auto;
  gap: 1em;

  & .full-grid-row {
    grid-column: 1 / -1;
  }

  & .legend {
    grid-column: 6 / -1;
  }
}
</style>
