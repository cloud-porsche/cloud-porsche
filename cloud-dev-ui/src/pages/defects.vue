<template>
  <v-responsive>
    <v-container>
      <v-card>
        <v-card-title>
          Defects
        </v-card-title>
        <v-card-text>
          <v-list
            v-if="!loading"
          >
            <v-list-item
              v-for="defect in defects"
              :key="defect.id"
            >
              <v-list-item-title>
                {{ defect.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ defect.location }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-progress-circular
            v-if="loading"
            indeterminate
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="refetch()"
          >
            Refresh
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-responsive>
</template>

<script lang="ts" setup>
  const loading = ref(true)
  const defects = ref([])

  refetch()

  function refetch () {
    loading.value = true
    fetch('http://localhost:8080/defects')
      .then(response => response.json())
      .then(data => {
        defects.value = data
        loading.value = false
      })
  }
</script>
