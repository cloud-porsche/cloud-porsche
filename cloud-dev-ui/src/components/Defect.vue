<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
          <v-row no-gutters>
            <v-col class="d-flex justify-start" cols="6">
              <span class="font-weight-bold">{{ defect.name }}</span>
            </v-col>
            <v-col cols="6" class="text-right">
              <span> {{ defect.descriptionShort }} </span>
            </v-col>
          </v-row>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row no-gutters>
          <v-col cols="12">
            <p><strong>Long Description:</strong> {{ defect.descriptionLong }}</p>
            <p><strong>Location:</strong> {{ defect.location }}</p>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
const props = defineProps({
  defect: Object
})
</script>

<style scoped>
.defect-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow for better visibility */
  border-radius: 8px; /* Rounded corners */
  transition: all 0.3s ease-in-out; /* Smooth hover effect */
  margin-bottom: 16px; /* Spacing between cards */
}

.v-card-title {
  cursor: pointer;
  padding: 16px;
  border-radius: 8px 8px 0 0; /* Rounded top corners */
}

.v-card-text {
  padding: 16px;
}

.v-divider {
  margin-top: 0;
}

.card-details {
  padding-top: 0;
}

.v-btn {
  transition: transform 0.3s ease; /* Smooth button animation */
}

.v-btn:hover {
  transform: scale(1.1); /* Slightly enlarge button on hover */
}

.v-expand-transition {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; /* Smoother expansion */
}
</style>
