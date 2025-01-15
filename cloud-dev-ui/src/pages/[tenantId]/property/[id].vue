<template>
  <div
    ref="fullscreen"
    @mouseup="dragEnd($event)"
    :style="dragActive ? { cursor: 'all-scroll' } : {}"
  >
    <v-toolbar
      v-if="property"
      density="compact"
      class="d-flex align-center pa-1 pl-4 pr-4"
    >
      <span class="pa-2 pr-8"
        ><b>Id: {{ property.id ?? "Unknown" }}</b></span
      >
      <v-divider vertical inset></v-divider>
      <v-btn
        class="ml-4"
        density="comfortable"
        :to="`/${tenantId}/defects/${property.id}`"
        :icon="'mdi-hammer-screwdriver'"
        v-tooltip="'Defects'"
      />
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
      <v-btn
        class="ml-4 mr-4"
        :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
        @click="toggle"
        v-tooltip="'Toggle Fullscreen Spot View'"
        density="comfortable"
      >
      </v-btn>
      <v-divider vertical inset></v-divider>
      <v-spacer></v-spacer>
      <v-select
        label="Select Simulation Speed"
        :items="['normal', 'fast', 'slow']"
        v-model="selectedSpeed"
        density="comfortable"
        style="height: 40px"
      ></v-select>
      <v-btn
        :disabled="!useAppStore().wsStatus"
        density="comfortable"
        :append-icon="simulationState ? 'mdi-pause' : 'mdi-play'"
        text="Simulation"
        @click="
          simulationState
            ? propertyStore.setSimulationInactive(property.id)
            : propertyStore.setSimulationActive(property.id, selectedSpeed)
        "
      />
    </v-toolbar>
    <v-progress-linear
      :indeterminate="propertyStore.loading"
      :color="propertyStore.error ? 'error' : undefined"
    ></v-progress-linear>
    <v-responsive v-if="property">
      <div class="property-main">
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
          name="CHARGING"
          :current="chargingSpots.length"
          :total="electricSpots.length"
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
        <v-card
          class="full-grid-row"
          v-if="currentLayer"
          @mousedown="dragStart($event)"
          @mousemove="dragMove($event)"
          @mouseup="dragEnd($event)"
          @contextmenu.prevent
        >
          <v-card-title class="d-flex align-center spot-title"
            >{{ property.name }}
            <v-spacer></v-spacer>
            <v-divider vertical inset class="ma-4"></v-divider>
            <ProTier class="d-flex align-center" v-model="isometric">
              <v-switch
                label="Isometric"
                flat
                :color="isometric ? 'primary' : 'default'"
                v-model="isometric"
                v-tooltip="'Toggle Isometric View'"
                hide-details
              ></v-switch>
              <v-btn
                class="ml-2"
                icon="mdi-backup-restore"
                density="comfortable"
                flat
                v-tooltip:bottom="'Reset View Settings to defaults'"
                @click="resetViewSettings()"
              ></v-btn>
              <v-divider vertical inset class="ma-4"></v-divider>
              <v-slider
                v-model="zoom"
                :min="20"
                :max="120"
                :step="1"
                prepend-icon="mdi-magnify-minus"
                append-icon="mdi-magnify-plus"
                :disabled="!isometric"
                density="comfortable"
                thumb-label
                hide-details
              ></v-slider>
              <v-slider
                v-model="xTranslate"
                :min="xMin"
                :max="xMax"
                :step="1"
                prepend-icon="mdi-axis-x-arrow"
                :disabled="!isometric"
                density="comfortable"
                thumb-label
                hide-details
              ></v-slider>
              <v-slider
                v-model="yTranslate"
                :min="yMin"
                :max="yMax"
                :step="1"
                prepend-icon="mdi-axis-z-arrow"
                :disabled="!isometric"
                density="comfortable"
                thumb-label
                hide-details
              ></v-slider>
            </ProTier>
            <v-divider vertical inset class="ma-4"></v-divider>
            <v-pagination
              v-model="page"
              :length="property.layers.length"
              variant="outlined"
              density="comfortable"
            ></v-pagination>
          </v-card-title>
          <v-divider></v-divider>
          <div
            v-if="property.layers.length > 0"
            :style="
              isometric
                ? {
                    transform: `translate3d(${xTranslate}%, ${yTranslate}px, 0)`,
                  }
                : {}
            "
          >
            <div
              v-if="!isometric"
              id="spot-container"
              ref="spot-container"
              :style="
                currentLayer
                  ? {
                      gridTemplateColumns: `repeat(${currentLayer.columns}, minmax(2em, 1fr))`,
                    }
                  : {}
              "
            >
              <Suspense>
                <ParkingSpotComponent
                  v-for="spot in currentLayer.parkingSpots"
                  :key="spot.id"
                  :spot="spot"
                ></ParkingSpotComponent>
                <template v-slot:fallback>
                  <v-progress-circular indeterminate></v-progress-circular>
                </template>
              </Suspense>
            </div>
            <div
              v-else-if="isometric"
              v-for="layer in property.layers"
              id="spot-container"
              ref="spot-container"
              class="isometric"
              :class="
                layer.floor === currentLayer.floor ? 'preferred-isometric' : ''
              "
              :style="{
                gridTemplateColumns: `repeat(${layer.columns}, minmax(2em, 1fr))`,
                top: `${layer.floor * 100}px`,
                zIndex: layer.floor,
                zoom: `${zoom}%`,
              }"
            >
              <Suspense>
                <ParkingSpotComponent
                  v-for="spot in layer.parkingSpots"
                  :key="spot.id"
                  :spot="spot"
                ></ParkingSpotComponent>
                <template v-slot:fallback>
                  <v-progress-circular indeterminate></v-progress-circular>
                </template>
              </Suspense>
            </div>
          </div>
          <v-card-text v-else class="pa-4">
            <i>No parking spots yet.</i>
          </v-card-text>
        </v-card>
      </div>
    </v-responsive>
  </div>
</template>

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import { ParkingSpot, ParkingSpotState } from "@cloud-porsche/types";
import { useRoute } from "vue-router";
import CounterCard from "@/components/CounterCard.vue";
import { useFullscreen, useStorage } from "@vueuse/core";
import { useAppStore } from "@/stores/app";

const ParkingSpotComponent = defineAsyncComponent(
  () => import("@/components/ParkingSpotComponent.vue"),
);

const fullscreenRef = useTemplateRef("fullscreen");
const { isFullscreen, toggle } = useFullscreen(fullscreenRef);

const propertyStore = usePropertyStore();
const route = useRoute();
const id = computed(() => (route.params as any)["id"]);
const tenantId = computed(() => (route.params as any)["tenantId"]);

await propertyStore.fetchSimulationStatus(id.value);

const [isoDefault, xDefault, yDefault, zoomDefault] = [false, 40, -100, 80];
const isometric = useStorage("view-settings-iso", isoDefault);
const xTranslate = useStorage("view-settings-x", xDefault);
const yTranslate = useStorage("view-settings-y", yDefault);
const zoom = useStorage("view-settings-zoom", zoomDefault);

function resetViewSettings() {
  isometric.value = isoDefault;
  xTranslate.value = xDefault;
  yTranslate.value = yDefault;
  zoom.value = zoomDefault;
}

const dragActive = ref(false);

const property = computed(() =>
  propertyStore.properties.find((property) => property.id === id.value),
);
const simulationState = computed(() =>
  propertyStore.simulationActive.includes(id.value),
);
let selectedSpeed = ref("normal");

watch(selectedSpeed, async (newValue) => {
  console.log("Watch New speed:", newValue);
  if (simulationState && id.value) {
    await propertyStore.updateSimulationSpeed(id.value, selectedSpeed.value);
  }
});

const page = ref(1);
const currentLayer = computed(() => property.value?.layers?.[page.value - 1]);

const allSpots = computed(() =>
  property.value?.layers
    .flatMap((l) => l.parkingSpots)
    .filter((spot) => !spot.placeholder),
);
const totalSpots = computed(() => allSpots.value?.length ?? 0);
const freeSpots = computed(
  () => allSpots.value?.filter((s) => s.state === ParkingSpotState.FREE) ?? [],
);
const occupiedSpots = computed(
  () =>
    allSpots.value?.filter(
      (s) =>
        s.state === ParkingSpotState.OCCUPIED ||
        s.state === ParkingSpotState.CHARGING,
    ) ?? [],
);
const reservedSpots = computed(
  () =>
    allSpots.value?.filter((s) => s.state === ParkingSpotState.RESERVED) ?? [],
);
const outOfOrderSpots = computed(
  () =>
    allSpots.value?.filter((s) => s.state === ParkingSpotState.OUT_OF_ORDER) ??
    [],
);
const electricSpots = computed(
  () => allSpots.value?.filter((s) => s.electricCharging) ?? [],
);
const chargingSpots = computed(
  () =>
    allSpots.value?.filter((s) => s.state === ParkingSpotState.CHARGING) ?? [],
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
    id: "Charging",
    state: ParkingSpotState.CHARGING,
    electricCharging: true,
    lastStateChange: new Date(),
    customer: null,
    placeholder: false,
    explanation: "Electric charging spot that is currently charging",
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

const xMin = -100;
const xMax = 150;
const yMin = -1200;
const yMax = 300;

function dragStart(event: MouseEvent) {
  if (event.button !== 2 || !isometric.value) return;
  dragActive.value = true;
}

function dragMove(event: MouseEvent) {
  if (!dragActive.value || !isometric.value) return;
  xTranslate.value += event.movementX / 8;
  yTranslate.value += event.movementY;

  if (xTranslate.value < xMin) xTranslate.value = xMin;
  if (xTranslate.value > xMax) xTranslate.value = xMax;
  if (yTranslate.value < yMin) yTranslate.value = yMin;
  if (yTranslate.value > yMax) yTranslate.value = yMax;
}

function dragEnd(_: MouseEvent) {
  dragActive.value = false;
}
</script>

<style scoped lang="scss">
.property-main {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: auto auto;
  gap: 1em;

  & .full-grid-row {
    grid-column: 1 / -1;
  }

  & .legend {
    grid-column: 7 / -1;
  }
}

.span-full-grid {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.spot-title {
  position: relative;
  z-index: 100;
}

div:has(> .isometric) {
  height: 800px;
}

.isometric {
  background: rgba(var(--v-theme-surface));
  position: absolute;
  top: 0;
  left: 0;

  perspective: 200px;
  transform-style: preserve-3d;
  rotate: z 30deg;
  transform: skewX(-30deg);

  transform-origin: top left;
  zoom: 80%;
  border: 1px dashed darkgray;
  border-radius: 4px;

  width: min-content !important;
  margin-top: 10%;
  margin-bottom: 25%;

  &.preferred-isometric {
    z-index: 99 !important;
  }

  &:not(.preferred-isometric) {
    opacity: 0.5;
  }
}
</style>
