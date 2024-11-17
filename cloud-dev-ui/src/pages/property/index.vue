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
      <v-card-title>Properties</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="property in propertyStore.properties"
            :key="property.id"
            :to="'/property/' + property.id"
            :title="property.name ?? property.id"
            :value="property.id"
            :active="
              router.currentRoute.value.path === '/property/' + property.id
            "
          />
        </v-list>
        <div
          class="d-flex w-100 h-100 align-center justify-center"
          v-if="propertyStore.properties.length <= 0"
        >
          No Property present.
        </div>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script lang="ts" setup>
import { usePropertyStore } from "@/stores/properties";
import router from "@/router";

const propertyStore = usePropertyStore();
</script>

<style scoped>
/* Optional: Add styles as needed */
</style>
