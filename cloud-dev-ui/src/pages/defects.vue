<template>
  <v-responsive>
    <v-container>
      <v-card>
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
          ></v-text-field>

          <v-chip-group
            v-model="filter"
            selected-class="text-primary"
            mandatory
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
          value="date"
          variant="outlined"
        ></v-chip>
          </v-chip-group>
        </v-card-title>
        <v-card-text>
          <div v-if="!loading">
            <v-expansion-panels>
              <Defect
              v-for="defect in defects"
              :key="defect.id"
              :defect="defect"
              />
            </v-expansion-panels> 
          </div>
          <v-progress-circular v-if="loading" indeterminate />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="refetch()">Refresh</v-btn>
        </v-card-actions>
      </v-card>

      <v-row>
        <v-col class="mt-4 text-left">
          <v-btn @click="openDialog">
            Add Defect
          </v-btn>
        </v-col>
      </v-row>

      <!-- Add the custom component here -->
      <AddDefectPopup
        v-model="dialog"
        @save="handleSave"
        @close="dialog = false"
      />
      {{ filter }}
    </v-container>
  </v-responsive>
</template>

<script lang="ts" setup>
import { IDefect } from '@cloud-porsche/types';
import { ref } from 'vue'

const search = ref('')
const filter = ref('')

const loading = ref(true)
const defects = ref<IDefect[]>([]);
const dialog = ref(false)

function refetch () {
  loading.value = true
  fetch('http://localhost:8080/v1/defects')
    .then(response => response.json())
    .then(data => {
      defects.value = data as IDefect[]
      loading.value = false
    })
}

function openDialog() {
  dialog.value = true
}

function handleSave(newDefect: IDefect) {
  fetch("http://localhost:8080/v1/defects", {
    method: "POST",
    body: JSON.stringify(newDefect),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  defects.value.push(newDefect)

  dialog.value = false
}

refetch()
</script>