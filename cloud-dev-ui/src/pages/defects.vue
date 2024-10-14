<template>
  <v-responsive>
    <v-container>
      <v-card>
        <SearchFilter @updateList="handleUpdateList" />
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

// Open dialog for adding a defect
function openDialog() {
  dialog.value = true
}

// Handle the save action from AddDefectPopup
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

// Function to handle search/filter update from SearchFilter component
function handleUpdateList(search: String, filter: String) {
  loading.value = true
  fetch(`http://localhost:8080/v1/defects/search?search=${search}&filter=${filter}`)
    .then(response => response.json())
    .then(data => {
      defects.value = data as IDefect[]
      loading.value = false
    })
}

refetch()
</script>
