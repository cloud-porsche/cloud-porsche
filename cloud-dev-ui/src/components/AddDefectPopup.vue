<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Add New Defect</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="validateForm">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                label="Defect Name*"
                v-model="defectName"
                :rules="[required]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Location*" v-model="location" :rules="[]" />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Short Description*"
                v-model="shortDescription"
                :rules="[]"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                label="Long Description*"
                v-model="longDescription"
                :rules="[]"
              />
            </v-col>

            <v-col cols="12">
              <v-date-input
                label="Select a date"
                v-model="defectDate"
                :rules="[]"
              />
            </v-col>
          </v-row>

          <small class="text-caption">*indicates required field</small>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cancel" @click="closeDialog">Cancel</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="validateForm">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { IDefect } from "@cloud-porsche/types";

const defectName = ref("");
const location = ref("");
const shortDescription = ref("");
const longDescription = ref("");
const defectDate = ref<Date | undefined>(undefined);
const dialog = ref(false);
const valid = ref(false);

const required = (v: string | undefined) => !!v || "This field is required.";

const emit = defineEmits(["save", "close"]);

function resetForm() {
  defectName.value = "";
  location.value = "";
  shortDescription.value = "";
  longDescription.value = "";
  defectDate.value = undefined;
  valid.value = false;
}

function validateForm() {
  if (valid.value) {
    saveDefect();
  }
}

function saveDefect() {
  const newDefect: Partial<IDefect> = {
    name: defectName.value,
    location: location.value,
    descriptionShort: shortDescription.value,
    descriptionLong: longDescription.value,
    reportedDate: defectDate.value,
  };

  emit("save", newDefect);
  closeDialog();
}

function closeDialog() {
  emit("close");
  resetForm();
}
</script>
