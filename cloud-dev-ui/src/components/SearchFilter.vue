<template>
  <h1 class="d-flex w-100 pb-1">
    Defects
    <v-spacer />
    <v-btn
      :prepend-icon="mobile ? undefined : 'mdi-plus'"
      :icon="mobile ? 'mdi-plus' : undefined"
      @click="emit('add')"
      class="me-2"
      v-tooltip="'Add Defect'"
      :text="mobile ? '' : 'Add Defect'"
    >
    </v-btn>
    <v-btn
      :prepend-icon="mobile ? undefined : 'mdi-refresh'"
      :icon="mobile ? 'mdi-refresh' : undefined"
      @click="emit('refresh')"
      :loading="loading"
      :color="error ? 'error' : 'primary'"
      v-tooltip="'Refresh'"
      :text="mobile ? '' : 'Refresh'"
    >
    </v-btn>
  </h1>
  <v-divider class="pa-1" thickness="0" />
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
    @keydown.enter="onInputChange"
    clearable
    @click:clear="
      search = '';
      onInputChange();
    "
    :error="error"
  ></v-text-field>
  <v-divider class="pa-1" thickness="0" />
  <v-chip-group
    filter
    v-model="filter"
    selected-class="text-primary"
    mandatory
    @change="onFilterChange"
  >
    <v-chip text="ID" value="id" variant="outlined"></v-chip>
    <v-chip text="Name" value="name" variant="outlined"></v-chip>
    <v-chip text="Location" value="location" variant="outlined"></v-chip>
    <!--<v-chip text="Date" value="reportedDate" variant="outlined"></v-chip>-->
  </v-chip-group>

  <v-divider class="pa-1" thickness="0" />
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const search = ref("");
const filter = ref("name");

const emit = defineEmits(["updateList", "refresh", "add"]);

const props = defineProps<{
  loading: boolean;
  error: boolean;
}>();

const error = computed(() => props.error);

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
