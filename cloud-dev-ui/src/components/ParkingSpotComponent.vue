<template>
  <div>
    <v-card
      :color="getStateColor(spot.state)"
      @click="disableDialog ? undefined : openDialog()"
      :disabled="spot.placeholder"
      border
      flat
      :class="spot.placeholder ? 'disabled-spot' : ''"
      class="spot d-flex align-center justify-center"
    >
      <v-tooltip
        v-if="explanation"
        activator="parent"
        :text="explanation"
        location="bottom"
      ></v-tooltip>
      <i v-if="spot.electricCharging" class="mdi mdi-flash text-yellow"></i
    ></v-card>

    <v-dialog v-model="inspectDialog" max-width="50%" max-height="80%">
      <v-card rounded class="overflow-hidden">
        <v-card-title>
          <span class="d-flex text-center align-center"
            >Parking Spot Details
            <v-spacer />
            <v-btn icon @click="closeDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn></span
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
            v-if="spot"
            density="compact"
            hide-default-header
            hide-default-footer
          >
            <template v-slot:body>
              <tr>
                <td>ID</td>
                <td>{{ spot.id }}</td>
              </tr>
              <tr>
                <td>State</td>
                <td>
                  <v-chip
                    :color="getStateColor(spot.state)"
                    :text="toStatusText(spot.state)"
                    class="text-uppercase"
                    size="small"
                    label
                  />
                </td>
              </tr>
              <tr>
                <td>Last State Change</td>
                <td>
                  {{
                    useDateFormat(spot.lastStateChange, "DD.MM.YYYY HH:mm:ss")
                  }}
                </td>
              </tr>
              <tr>
                <td>Is electric charging spot?</td>
                <td>
                  <v-icon :color="spot.electricCharging ? 'green' : 'red'"
                    >{{
                      spot.electricCharging
                        ? "mdi-check-circle"
                        : "mdi-minus-circle"
                    }}
                  </v-icon>
                </td>
              </tr>
              <tr v-if="spot.currentCharge">
                <td>Current charge</td>
                <td>{{ spot.currentCharge }}%</td>
              </tr>
              <tr v-if="spot.customer">
                <td>Parked Car</td>
                <td>
                  {{ spot.customer.licensePlate }}
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-row v-else>
            <v-col> No parking spot selected.</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ParkingSpot, ParkingSpotState } from "@cloud-porsche/types";
import { useDateFormat } from "@vueuse/core";

const props = defineProps<{
  spot: ParkingSpot;
  disableDialog?: boolean;
  explanation?: string;
}>();

const inspectDialog = ref(false);

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

function toStatusText(state: ParkingSpotState) {
  switch (state) {
    case ParkingSpotState.FREE:
      return "Free";
    case ParkingSpotState.OCCUPIED:
      return "Occupied";
    case ParkingSpotState.RESERVED:
      return "Reserved";
    case ParkingSpotState.OUT_OF_ORDER:
      return "Out of Order";
    default:
      return "Unknown";
  }
}

function openDialog() {
  inspectDialog.value = true;
}

function closeDialog() {
  inspectDialog.value = false;
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
