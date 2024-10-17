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
              <v-text-field
                label="Location*"
                v-model="location"
                :rules="[required]"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Short Description*"
                v-model="shortDescription"
                :rules="[required]"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Long Description*"
                v-model="longDescription"
                :rules="[required]"
              />
            </v-col>
            <v-col :cols="patchSubscription ? 6 : 12">
              <v-date-input
                label="Select a date*"
                v-model="defectDate"
                :rules="[required]"
              />
            </v-col>
            <v-col v-if="patchSubscription" cols="6">
              <v-select
                label="Status"
                :items="[
                  DefectState.OPEN,
                  DefectState.IN_WORK,
                  DefectState.DONE,
                  DefectState.REJECTED,
                ]"
                v-model="status"
              >
                <template v-slot:selection="{ item }">
                  <StatusChip :defect="{ status: item.raw }" />
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind:props @click="props.onClick as any">
                    <StatusChip :defect="{ status: item.raw }" />
                  </v-list-item>
                </template>
              </v-select>
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
import { DefectState, IDefect } from "@cloud-porsche/types";

const props = defineProps<{
  defect: Partial<IDefect>;
  patch: boolean;
}>();

const defectSubscription = computed(() => props.defect);
const patchSubscription = computed(() => props.patch ?? false);

watch(defectSubscription, () => {
  defectName.value = props.defect.name ?? "";
  location.value = props.defect.location ?? "";
  shortDescription.value = props.defect.descriptionShort ?? "";
  longDescription.value = props.defect.descriptionLong ?? "";
  defectDate.value = props.defect.reportedDate
    ? new Date(props.defect.reportedDate)
    : new Date();
  status.value = props.defect.status;
});

const defectName = ref(props.defect.name ?? "");
const location = ref(props.defect.location ?? "");
const shortDescription = ref(props.defect.descriptionShort ?? "");
const longDescription = ref(props.defect.descriptionLong ?? "");
const defectDate = ref<Date>(
  props.defect.reportedDate ? new Date(props.defect.reportedDate) : new Date(),
);
const status = ref<DefectState | undefined>(props.defect.status);
const dialog = ref(false);
const valid = ref(false);

const required = (v: string | undefined) => !!v || "This field is required.";

const emit = defineEmits(["save", "patch", "close"]);

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
    reportedDate: toGmt0(defectDate.value),
  };

  if (patchSubscription.value)
    emit("patch", {
      ...newDefect,
      status: status.value,
    });
  else emit("save", newDefect);
  closeDialog();
}

function closeDialog() {
  emit("close");
}

function toGmt0(date: Date): Date {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000);
}
</script>
