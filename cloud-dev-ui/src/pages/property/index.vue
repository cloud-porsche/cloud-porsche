<template>
  <v-responsive id="property-management-page">
    <h1>
      <span class="d-flex pa-4"
        >Property Management Page
        <v-spacer></v-spacer>
        <v-btn
          class="ml-4"
          :icon="'mdi-plus'"
          v-tooltip="'Add new Property'"
          @click="newPropertyDialog = true"
        />
        <v-btn
          class="ml-4"
          :icon="'mdi-refresh'"
          :color="propertyStore.error ? 'error' : undefined"
          v-tooltip="'Refresh'"
          @click="propertyStore.fetchProperties()"
        />
        <v-btn
          class="ml-4"
          :icon="'mdi-delete'"
          color="error"
          v-tooltip="'Delete'"
          :disabled="propertyStore.properties.length <= 0"
          @click="deleteDialog = true"
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
            color: getStateColor(property) ? 'white' : undefined,
          }"
          class="pa-4 d-flex flex-column justify-space-evenly align-center"
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

  <v-dialog
    :model-value="newPropertyDialog"
    retain-focus
    persistent
    attach="#property-management-page"
  >
    <v-stepper
      v-model="step"
      :items="stepperPages"
      :mobile="mobile"
      show-actions
    >
      <template v-slot:item.1>
        <v-form class="pa-2" v-model="valid" @submit.prevent="validateForm">
          <v-row>
            <v-col>
              <v-text-field
                v-model="newProperty.name"
                label="Name"
                required
                variant="outlined"
                :rules="[required]"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="newProperty.location"
                label="Location"
                required
                variant="outlined"
                :rules="[required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="newProperty.description"
                label="Description"
                variant="outlined"
                :rules="[]"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-number-input
                v-model="newProperty.pricePerHour"
                label="Price per Hour"
                :min="1"
                variant="outlined"
                :rules="[required]"
              ></v-number-input>
            </v-col>
            <v-col>
              <v-select
                v-model="newProperty.parkingType"
                label="Parking Type - Track each spot or total"
                :items="[
                  ParkingPropertyType.TRACK_INDIVIDUAL,
                  ParkingPropertyType.TRACK_TOTAL,
                ]"
                density="comfortable"
                variant="outlined"
                :rules="[]"
              >
                <template v-slot:selection="{ item }">
                  <v-chip>{{ toParkingTypeText(item.raw) }}</v-chip>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" title="">
                    <v-chip>{{ toParkingTypeText(item.raw) }}</v-chip>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </template>

      <template v-slot:item.2>
        <v-form class="pa-2" v-model="valid" @submit.prevent="validateForm">
          <v-row>
            <v-col>
              <v-number-input
                v-model="toGenerate"
                label="Total number of Parking Spots to generate (including visual placeholders)"
                required
                :min="1"
                variant="outlined"
                :rules="[required]"
              ></v-number-input>
            </v-col>
            <v-col
              v-tooltip:bottom="
                newProperty.parkingType === ParkingPropertyType.TRACK_TOTAL
                  ? 'This field is disabled when tracking total parking spots.'
                  : undefined
              "
            >
              <v-text-field
                :disabled="
                  newProperty.parkingType === ParkingPropertyType.TRACK_TOTAL
                "
                v-model="spotGenerationPattern"
                label="Spot Id Generation Pattern (f.e. 'PS-${index}', '${index}')"
                required
                variant="outlined"
                :rules="[required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <!--<v-row>
            <v-col class="d-flex align-center justify-space-between">
              <v-divider></v-divider>
              <v-btn @click="generateParkingSpots">Generate</v-btn>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div id="spot-container">
                <ParkingSpotComponent
                  v-for="spot in newParkingSpots"
                  :spot="spot"
                />
              </div>
            </v-col>
          </v-row>-->
        </v-form>
      </template>

      <template v-slot:item.3>
        <v-form
          class="pa-2"
          validate-on="eager"
          v-model="valid"
          @submit.prevent="validateForm"
        >
          <v-row v-for="layer in newLayers" :key="layer.floor">
            <v-col
              class="d-flex flex-grow-0 text-no-wrap justify-center align-center"
            >
              <span class="pl-2 pb-8 text-h6">Layer {{ layer.floor }}</span>
            </v-col>
            <v-col>
              <v-text-field
                v-model="layer.name"
                label="Name"
                required
                variant="outlined"
                :rules="[required]"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="layer.description"
                label="Description"
                variant="outlined"
                :rules="[]"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-number-input
                v-model="layer.columns"
                label="Number of columns"
                required
                variant="outlined"
                :rules="[required]"
                hide-details
                :min="1"
                :max="100"
              ></v-number-input>
            </v-col>
            <v-col>
              <v-number-input
                v-model="layer.spotCount"
                label="Number of spots in this layer"
                required
                variant="outlined"
                :rules="[required, mustMatchTotalSpots]"
                :min="1"
                :max="newParkingSpots.length"
              ></v-number-input>
            </v-col>
            <v-col class="flex-grow-0 align-center">
              <v-btn
                icon="mdi-delete"
                variant="outlined"
                color="error"
                v-tooltip:bottom="'Delete this layer'"
                @click="newLayers.splice(newLayers.indexOf(layer), 1)"
              >
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn
                prepend-icon="mdi-plus"
                @click="
                  newLayers.push({
                    floor: newLayers.length,
                    name: '',
                    description: '',
                    spotCount: 1,
                    columns: 1,
                  })
                "
                >Add Layer
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template v-slot:item.4>
        <v-card>
          <v-card-title>Confirm</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col>
                <v-data-table
                  :items="[
                    ...Object.entries(newProperty),
                    ['Parking Spots', newParkingSpots.length],
                    [
                      'Parking Spot Id Generation Pattern',
                      spotGenerationPattern,
                    ],
                  ]"
                  density="compact"
                  disable-sort
                  hide-default-header
                  hide-default-footer
                  dense
                >
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  :items="newLayers"
                  hide-default-header
                  hide-default-footer
                  dense
                >
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <template v-slot:actions="{ next, prev }">
        <span class="d-flex justify-space-between pa-4">
          <v-btn @click="prev" v-if="step > 1">Previous</v-btn>
          <v-btn @click="newPropertyDialog = false" v-else-if="step <= 1"
            >Cancel
          </v-btn>
          <v-btn
            :disabled="!valid"
            @click="nextOrGenerate(next)"
            v-if="step < stepperPages.length"
            >Next</v-btn
          >
          <v-btn
            :disabled="!valid"
            @click="saveNewProperty()"
            v-else-if="step >= stepperPages.length"
            >Save</v-btn
          ></span
        >
      </template>
    </v-stepper>
  </v-dialog>

  <v-dialog
    v-model="deleteDialog"
    persistent
    retain-focus
    max-width="50%"
    attach="#property-management-page"
  >
    <v-card>
      <v-card-title>Delete Properties</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-select
              v-model="toDelete"
              :items="propertyStore.properties.map((p) => p.name)"
              label="Select Property to delete"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          @click="
            deleteDialog = false;
            toDelete = '';
          "
          >Cancel
        </v-btn>
        <v-btn
          variant="tonal"
          color="error"
          :disabled="toDelete?.length <= 0"
          @click="deleteProperty(toDelete)"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import {
  IParkingProperty,
  ParkingPropertyType,
  ParkingSpot,
  ParkingSpotLayers,
  ParkingSpotState,
} from "@cloud-porsche/types";
import { useDisplay } from "vuetify";
import { ref } from "vue";

const mobile = useDisplay().mobile;
const propertyStore = usePropertyStore();
const required = (v: string | undefined) => !!v || "This field is required.";
const mustMatchTotalSpots = (_: number | undefined) =>
  newLayers.value.reduce((acc, l) => acc + l.spotCount, 0) ===
    newParkingSpots.value.length ||
  "Total spots must match the sum of all layers. (Total: " +
    newParkingSpots.value.length +
    ")";

const deleteDialog = ref(false);
const toDelete = ref<string>("");

function deleteProperty(name: string) {
  const property = propertyStore.properties.find((p) => p.name === name);
  if (property) {
    propertyStore.deleteProperty(property.id);
  } else propertyStore.error = true;
  toDelete.value = "";
  deleteDialog.value = false;
}

const stepperPages = [
  "General Information",
  "Parking Spots",
  "Layer Creation",
  "Confirm",
];
const newPropertyDialog = ref(false);
const step = ref(1); // index start at 1 for stepper
const valid = ref(false);
const validateForm = () => {
  if (valid.value) {
    if (step.value === stepperPages.length) {
      saveNewProperty();
    } else step.value += 1;
  }
};

const startingNewProperty = {
  name: "",
  location: "",
  description: "",
  pricePerHour: 1,
  parkingType: ParkingPropertyType.TRACK_INDIVIDUAL,
};
let newProperty = reactive<
  Pick<
    IParkingProperty,
    "name" | "location" | "description" | "pricePerHour" | "parkingType"
  >
>({ ...startingNewProperty });
const spotGenerationPattern = ref("${index}");
const toGenerate = ref(100);
const newParkingSpots = ref<ParkingSpot[]>([]);
const newLayers = ref<ParkingSpotLayers[]>([]);

function nextOrGenerate(next: () => void) {
  if (step.value === 2) {
    generateParkingSpots();
  }
  next();
}

function generateParkingSpots() {
  newParkingSpots.value = Array.from(
    { length: toGenerate.value },
    (_, index) => {
      return {
        id:
          newProperty.parkingType === ParkingPropertyType.TRACK_INDIVIDUAL
            ? spotGenerationPattern.value.replace("${index}", index.toString())
            : crypto.randomUUID(),
        state: ParkingSpotState.FREE,
        electricCharging: false,
        placeholder: false,
        customer: null,
        lastStateChange: new Date(),
      };
    },
  );
}

async function saveNewProperty() {
  const finalProperty: Omit<IParkingProperty, "id" | "customers"> = {
    ...newProperty,
    parkingSpots: newParkingSpots.value,
    lastModified: new Date(),
    visualLayers: newLayers.value,
  };

  await propertyStore.addProperty(finalProperty);

  newPropertyDialog.value = false;
  newProperty = { ...startingNewProperty };
  spotGenerationPattern.value = "${index}";
  toGenerate.value = 100;
  newParkingSpots.value = [];
  newLayers.value = [];
}

function getStateColor(property: IParkingProperty) {
  if (property.parkingSpots.length <= 0) {
    return undefined;
  }
  const occupied = property.parkingSpots.filter(
    (s) => s.state === ParkingSpotState.OCCUPIED,
  ).length;
  if (occupied === property.parkingSpots.length) {
    return "red";
  }
  return "green";
}

function toParkingTypeText(item: ParkingPropertyType) {
  switch (item) {
    case ParkingPropertyType.TRACK_INDIVIDUAL:
      return "Individual";
    case ParkingPropertyType.TRACK_TOTAL:
      return "Total";
    default:
      return "Unknown";
  }
}

window.onbeforeunload = () => {
  if (newPropertyDialog.value) {
    return "Progress will be lost! Are you sure?";
  }
};
</script>

<style scoped lang="scss">
#property-panel-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  padding: 1em;
}
</style>
