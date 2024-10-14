<template>
    <v-card-title class="d-flex align-center pe-2">
      Defects
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        class="pe-2"
        max-width="400"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        @input="onInputChange"
      ></v-text-field>
  
      <v-chip-group
        v-model="filter"
        selected-class="text-primary"
        mandatory
        @change="onFilterChange"
      >
        <v-chip
          text="Name"
          value="name"
          variant="outlined"
        ></v-chip>
        <v-chip
          text="Location"
          value="location"
          variant="outlined"
        ></v-chip>
        <v-chip
          text="Date"
          value="reportedDate"
          variant="outlined"
        ></v-chip>
      </v-chip-group>
    </v-card-title>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const search = ref('')
  const filter = ref('name')

  const emit = defineEmits(['updateList'])

  function onInputChange() {
    emitUpdate()
  }
  function onFilterChange() {
    emitUpdate()
  }
  
  function emitUpdate() {
    emit('updateList', search.value, filter.value)
  }
  </script>
  