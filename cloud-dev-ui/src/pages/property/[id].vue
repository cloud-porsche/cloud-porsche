<template>
  <v-toolbar
    v-if="property"
    density="compact"
    class="d-flex align-center pa-1 pl-4 pr-4"
  >
    <span
      ><b>Id: {{ property.id ?? "Unknown" }}</b
      >{{ property.name ? " - " + property?.name : "" }}</span
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
        <v-card-title>Legend</v-card-title>
        <v-card-item>
          <span class="d-flex align-center justify-space-evenly">
            <v-card
              v-for="spot in exampleSpots"
              :key="spot.id"
              :color="getStateColor(spot.state)"
              @click="openDialog(spot)"
              border
              flat
              width="1em"
              v-tooltip:bottom="spot.explanation"
              class="spot d-flex align-center justify-center"
            >
              <i
                v-if="spot.electricCharging"
                class="mdi mdi-flash text-yellow"
              ></i></v-card
          ></span>
        </v-card-item>
      </v-card>
      <v-card class="full-grid-row">
        <v-card-title>{{ property.name }}</v-card-title>
        <div id="spot-container" v-if="property.parkingSpots.length > 0">
          <v-card
            v-for="spot in property.parkingSpots"
            :key="spot.id"
            border
            flat
            :color="getStateColor(spot.state)"
            @click="openDialog(spot)"
            class="spot d-flex align-center justify-center"
          >
            <i
              v-if="spot.electricCharging"
              class="mdi mdi-flash text-yellow"
            ></i>
          </v-card>
        </div>
        <v-card-text v-else class="pa-4">
          <i>No parking spots yet.</i>
        </v-card-text>
      </v-card>
    </main>
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
import CounterCard from "@/components/CounterCard.vue";

const inspectDialog = ref(false);
const selectedSpot = ref<ParkingSpot>();

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

const exampleSpots: (ParkingSpot & { explanation: string })[] = [
  {
    id: "Electric",
    state: ParkingSpotState.FREE,
    electricCharging: true,
    lastStateChange: new Date(),
    customer: null,
    explanation: "Electric charging spot",
  },
  {
    id: "Free",
    state: ParkingSpotState.FREE,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    explanation: "Free spot",
  },
  {
    id: "Occupied",
    state: ParkingSpotState.OCCUPIED,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    explanation: "Occupied spot",
  },
  {
    id: "Reserved",
    state: ParkingSpotState.RESERVED,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
    explanation: "Reserved spot",
  },
  {
    id: "Out of Order",
    state: ParkingSpotState.OUT_OF_ORDER,
    electricCharging: false,
    lastStateChange: new Date(),
    customer: null,
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

#spot-container {
  max-height: 68svh;
  overflow-y: auto;
  scrollbar-width: thin;
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;

  padding: 1em;
}

.spot {
  aspect-ratio: 1 / 1.5;
  min-width: 2em;
  max-width: 5em;
  transition: scale 0.2s linear;

  &:hover {
    scale: 1.02;
  }
}
</style>
