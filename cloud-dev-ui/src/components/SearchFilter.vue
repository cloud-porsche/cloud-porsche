<template>
  <h1 class="d-flex w-100 pb-1">
    Defects
    <v-spacer />
    <v-btn prepend-icon="mdi-plus" @click="emit('add')" class="me-2"
      >Add Defect
    </v-btn>
    <v-btn
      prepend-icon="mdi-refresh"
      @click="emit('refresh')"
      :loading="loading"
      >Refresh
    </v-btn>
  </h1>
  <v-divider class="pa-2" thickness="0" />
  <v-text-field
    :loading="loading"
    v-model="search"
    density="comfortable"
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
    <v-chip text="Name" value="name" variant="outlined"></v-chip>
    <v-chip text="Location" value="location" variant="outlined"></v-chip>
    <v-chip text="Date" value="reportedDate" variant="outlined"></v-chip>
  </v-chip-group>
</template>

<script lang="ts" setup>
const search = ref("");
const filter = ref("name");

const emit = defineEmits(["updateList", "refresh", "add"]);

defineProps<{
  loading: boolean;
}>();

function onInputChange() {
  emitUpdate();
}

function onFilterChange() {
  emitUpdate();
}

function emitUpdate() {
  emit("updateList", search.value, filter.value);
}
</script>
