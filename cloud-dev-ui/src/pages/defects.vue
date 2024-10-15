<template>
  <v-responsive>
    <v-container>
      <v-card>
        <v-card-title>
          Defects
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
    </v-container>
  </v-responsive>
</template>

<script lang="ts" setup>
import { IDefect } from '@cloud-porsche/types';
import { ref } from 'vue'

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
