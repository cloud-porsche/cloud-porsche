<template>
  <v-responsive>
    <v-container>
      <v-card>
        <v-card-title>
          Defects
        </v-card-title>
        <v-card-text>
          <div v-if="!loading">
            <Defect
              v-for="defect in defects"
              :key="defect.id"
              :defect="defect"
            />
          </div>
          <v-progress-circular v-if="loading" indeterminate />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="refetch()">Refresh</v-btn>
        </v-card-actions>
      </v-card>

      <v-row>
        <v-col class="mt-4 text-left">
          <v-btn @click="dialog = true">
            Add Defect
          </v-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>
            Add New Defect
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Defect Name*"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Location*"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Short Description*"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Long Description*"
                  required
                />
              </v-col>
              <!-- TODO: Add a textfield that acts as datepicker here -->
            </v-row>

            <small class="text-caption">*indicates required field</small>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn text="Cancel" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveDefect">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-responsive>
</template>

<script lang="ts" setup>
  const loading = ref(true)
  const defects = ref([])
  const dialog = ref(false)

  refetch()

  function saveDefect () {
    dialog.value = false
  }

  function refetch () {
    loading.value = true
    fetch('http://localhost:8080/v1/defects')
      .then(response => response.json())
      .then(data => {
        defects.value = data
        loading.value = false
      })
  }
</script>
