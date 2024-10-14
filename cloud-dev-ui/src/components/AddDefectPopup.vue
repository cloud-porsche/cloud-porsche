<template>
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
              v-model="defectName"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Location*"
              v-model="location"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Short Description*"
              v-model="shortDescription"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              label="Long Description*"
              v-model="longDescription"
              required
            />
          </v-col>
          <!-- TODO: Add a textfield that acts as a datepicker here -->
        </v-row>

        <small class="text-caption">*indicates required field</small>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cancel" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveDefect">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { IDefect } from '@cloud-porsche/types';
import { ref } from 'vue'

const defectName = ref('')
const location = ref('')
const shortDescription = ref('')
const longDescription = ref('')
const dialog = ref(false)

function resetForm() {
  defectName.value = '';
  location.value = '';
  shortDescription.value = '';
  longDescription.value = '';
}

// Emit events to parent component
const emit = defineEmits(['save', 'close'])

function saveDefect () {
  
  const newDefect: Partial<IDefect> = {
    name: defectName.value,
    location: location.value,
    descriptionShort: shortDescription.value,
    descriptionLong: longDescription.value,
  }

  emit('save', newDefect)
  closeDialog()
}

function closeDialog () {
  emit('close')
  resetForm()
}

</script>