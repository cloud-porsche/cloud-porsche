<template>
  <div>
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
      <v-divider class="pa-4"></v-divider>
      <v-card :loading="propertyStore.loading || newLoading">
        <v-card-title>Your Properties:</v-card-title>
        <div id="property-panel-container">
          <v-card
            v-for="property in propertyStore.properties"
            :key="property.id"
            :to="'/property/' + property.id"
            :value="property.id"
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
                usePropertyStore()
                  .parkingSpots(property.id)
                  .filter((s) => s.state === ParkingSpotState.OCCUPIED).length
              }}
              / {{ usePropertyStore().parkingSpots(property.id).length }}
            </v-chip>
          </v-card>
        </div>
        <div
          class="d-flex pb-8 w-100 h-100 align-center justify-center"
          v-if="propertyStore.properties.length <= 0"
        >
          No Property present.
        </div>
      </v-card>
    </v-responsive>

    <v-dialog v-model="newPropertyDialog" :persistent="step !== 1">
      <v-stepper
        v-model="step"
        :items="stepperPages"
        :mobile="mobile"
        show-actions
      >
        <v-stepper-window>
          <v-stepper-window-item :value="1">
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
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <v-form
              class="pa-2"
              validate-on="eager"
              v-model="valid"
              ref="layer-form"
              @submit.prevent="validateForm"
            >
              <v-input
                v-if="newLayers.length <= 0"
                class="pb-2 d-flex justify-center align-center"
                :rules="[minimumOneLayerExists]"
                disabled
              ></v-input>
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
                  ></v-number-input>
                </v-col>
                <v-col>
                  <v-number-input
                    v-model="layer.spotCount"
                    label="Number of spots in this layer"
                    required
                    variant="outlined"
                    :rules="[required]"
                    validate-on="eager"
                    :min="1"
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
                  <v-divider v-if="newLayers.length > 0"></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-btn
                    prepend-icon="mdi-plus"
                    @click="
                      newLayers.push({
                        floor: newLayers.length + 1,
                        name: '',
                        description: '',
                        spotCount: 100,
                        columns: 25,
                        idPattern: '${layer}-${index}',
                        parkingSpots: [],
                      })
                    "
                    >Add Layer
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item
            v-for="layer in newLayers"
            :key="layer.floor"
            :name="'Layer ' + layer.floor"
            :value="layer.floor + 2"
          >
            <v-form class="pa-2" v-model="valid" @submit.prevent="validateForm">
              <v-row>
                <v-col
                  v-tooltip:bottom="
                    newProperty.parkingType === ParkingPropertyType.TRACK_TOTAL
                      ? 'This field is disabled when tracking total parking spots.'
                      : undefined
                  "
                >
                  <v-text-field
                    :disabled="
                      newProperty.parkingType ===
                      ParkingPropertyType.TRACK_TOTAL
                    "
                    v-model="layer.idPattern"
                    label="Spot Id Generation Pattern (f.e. 'PS-${index}', '${index}')"
                    required
                    variant="outlined"
                    :rules="[required]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-divider></v-divider>
                  <small
                    class="pa-2 d-flex justify-center align-center text-grey text-center"
                    >Left click a spot to replace it with a placeholder.<br />
                    Right click to mark it as electric charger.</small
                  ></v-col
                >
              </v-row>
              <v-row>
                <v-col>
                  <div
                    id="spot-container"
                    :style="{
                      gridTemplateColumns: `repeat(${layer.columns}, 1fr)`,
                    }"
                  >
                    <Suspense>
                      <ParkingSpotComponent
                        v-for="spot in layer.parkingSpots"
                        :key="spot.id"
                        :spot="spot"
                        disable-dialog
                        @click="togglePlaceholder(layer, spot)"
                        @contextmenu.prevent="
                          spot.electricCharging = !spot.electricCharging
                        "
                      ></ParkingSpotComponent>
                      <template v-slot:fallback>
                        <v-progress-circular
                          indeterminate
                        ></v-progress-circular>
                      </template>
                    </Suspense>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="stepperPages.length">
            <v-card :loading="newLoading">
              <v-row>
                <v-col>
                  <v-data-table
                    :items="Object.entries(newProperty)"
                    density="compact"
                    disable-sort
                    hide-default-header
                    hide-default-footer
                    dense
                  >
                    <template v-slot:top>
                      <v-toolbar flat rounded>
                        <v-toolbar-title>Property Details</v-toolbar-title>
                      </v-toolbar>
                    </template>
                    <template v-slot:body.prepend>
                      <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                      </tr>
                    </template>
                    <template v-slot:body>
                      <tr>
                        <td>Name</td>
                        <td>{{ newProperty.name }}</td>
                      </tr>
                      <tr>
                        <td>Description</td>
                        <td>{{ newProperty.description }}</td>
                      </tr>
                      <tr>
                        <td>Location</td>
                        <td>{{ newProperty.location }}</td>
                      </tr>
                      <tr>
                        <td>Price / h</td>
                        <td>{{ newProperty.pricePerHour }} €</td>
                      </tr>
                      <tr>
                        <td>Spot counting</td>
                        <td>
                          {{ toParkingTypeText(newProperty.parkingType) }}
                        </td>
                      </tr>
                    </template>
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
                    <template v-slot:top>
                      <v-toolbar flat rounded>
                        <v-toolbar-title>Layers</v-toolbar-title>
                      </v-toolbar>
                    </template>
                    <template v-slot:body.prepend>
                      <tr>
                        <th>Layer</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Columns</th>
                        <th>Spot Count</th>
                      </tr>
                    </template>
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>{{ item.floor }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.description }}</td>
                        <td>{{ item.columns }}</td>
                        <td>{{ item.spotCount }}</td>
                      </tr>
                    </template>
                    <template v-slot:body.append>
                      <v-divider></v-divider>
                      <tr>
                        <td>
                          {{ newLayers.length }}

                          layers in total
                        </td>
                        <td colspan="3"></td>
                        <td>
                          {{
                            newLayers.reduce(
                              (acc, layer) => acc + layer.spotCount,
                              0,
                            )
                          }}
                          spots in total
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
          </v-stepper-window-item>
        </v-stepper-window>

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

    <v-dialog v-model="deleteDialog" max-width="50%">
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
  </div>
</template>

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import {
  IParkingProperty,
  ParkingPropertyType,
  ParkingSpot,
  ParkingSpotLayer,
  ParkingSpotState,
} from "@cloud-porsche/types";
import { useDisplay } from "vuetify";
import { ref } from "vue";

const mobile = useDisplay().mobile;
const propertyStore = usePropertyStore();
const required = (v: string | undefined) => !!v || "This field is required.";
const minimumOneLayerExists = computed(() => {
  return (_: string | undefined) =>
    newLayers.length > 0 || "At least one layer must exist.";
});

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

const stepperPages = computed(() => [
  "General Information",
  "Parking Spots",
  ...newLayers.map((layer) => `Layer ${layer.floor}`),
  "Confirm",
]);
const newPropertyDialog = ref(false);
const step = ref(1); // index start at 1 for stepper
const valid = ref(false);
const validateForm = () => {
  if (valid.value) {
    if (step.value === stepperPages.value.length) {
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
let newLayers = reactive<ParkingSpotLayer[]>([]);

const formRef = useTemplateRef("layer-form");
watch(newLayers, () => {
  if (formRef.value) {
    formRef.value.validate();
  }
});

function nextOrGenerate(next: () => void) {
  if (step.value === 2) {
    newLayers.map((layer) => {
      layer.parkingSpots = generateParkingSpots(layer.spotCount);
    });
  } else if (
    step.value + 1 === stepperPages.value.length &&
    newProperty.parkingType === ParkingPropertyType.TRACK_INDIVIDUAL
  ) {
    newLayers.forEach((layer) =>
      layer.parkingSpots.map((spot, index) => {
        spot.id = spot.placeholder
          ? crypto.randomUUID()
          : layer.idPattern
              .replace("${index}", index.toString())
              .replace("${layer}", layer.floor.toString());
        return spot;
      }),
    );
  }
  next();
}

function generateParkingSpots(length: number) {
  return Array.from({ length: length }, (_) => {
    return {
      id: crypto.randomUUID(),
      state: ParkingSpotState.FREE,
      electricCharging: false,
      placeholder: false,
      customer: null,
      lastStateChange: new Date(),
    };
  });
}

function togglePlaceholder(layer: ParkingSpotLayer, spot: ParkingSpot) {
  spot.electricCharging = false;
  if (spot.placeholder) {
    layer.parkingSpots = layer.parkingSpots.filter(
      (s) => s.placeholder || s.id !== spot.id,
    );
    spot.placeholder = !spot.placeholder;
  } else {
    const newSpot = Object.assign({}, spot);
    spot.placeholder = !spot.placeholder;
    layer.parkingSpots.push(newSpot);
  }
}

const newLoading = ref(false);

async function saveNewProperty() {
  newLoading.value = true;
  const finalProperty: Omit<
    IParkingProperty,
    "id" | "customers" | "parkingSpots"
  > = {
    ...newProperty,
    lastModified: new Date(),
    layers: newLayers,
  };

  await propertyStore.addProperty(finalProperty);

  newPropertyDialog.value = false;
  newProperty = { ...startingNewProperty };
  newLayers = [];
  step.value = 1;
  newLoading.value = false;
}

function getStateColor(property: IParkingProperty) {
  const spots = usePropertyStore().parkingSpots(property.id);
  if (spots.length <= 0) {
    return undefined;
  }
  const occupied = spots.filter(
    (s) => s.state === ParkingSpotState.OCCUPIED,
  ).length;
  if (occupied === spots.length) {
    return "tomato";
  }
  if (occupied >= spots.length * 0.65) {
    return "darkgoldenrod";
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
