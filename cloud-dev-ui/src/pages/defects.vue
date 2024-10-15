<template>
  <v-responsive>
    <SearchFilter
      @updateList="handleUpdateList"
      @refresh="refetch()"
      @add="openDialog"
      :loading="loading"
    />

    <v-data-table
      class="data-table rounded"
      density="comfortable"
      :items="defects"
      :headers="headers"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 25, title: '25' },
        { value: -1, title: 'All' },
      ]"
      show-expand
      multi-sort
    >
      <template v-slot:item.status="{ item }">
        <StatusChip :defect="item" />
      </template>
      <template v-slot:item.reportedDate="{ item }">
        {{ formatDate(item.reportedDate) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" @click="editDialog(item)" variant="plain">
        </v-btn>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="pa-5">
            <div
              v-for="column in columns"
              :key="column.value as string"
              class="pa-2"
            >
              <strong>{{ column.title }}</strong>
              <div v-if="column.value === 'reportedDate'">
                {{ formatDate(item.reportedDate) }}
              </div>
              <div v-else-if="column.value === 'status'">
                <StatusChip :defect="item" />
              </div>
              <div v-else-if="column.value === 'actions'">
                <v-btn
                  prepend-icon="mdi-pencil"
                  class="me-2"
                  @click="editDialog(item)"
                  variant="tonal"
                  >Edit
                </v-btn>
                <v-btn
                  prepend-icon="mdi-delete"
                  color="error"
                  @click="initiateDeletion(item)"
                  variant="tonal"
                  >Delete
                </v-btn>
              </div>
              <div v-else>{{ item[column.value as keyof IDefect] }}</div>
              <v-divider v-if="column.title !== ''" class="mt-2" />
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <AddDefectPopup
      v-model="dialog"
      :defect="activeDefect"
      :patch="!!activeDefect.id"
      @save="handleSave"
      @patch="patchDefect(activeDefect.id!, $event)"
      @close="closeDialog"
    />
  </v-responsive>
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title>Confirm Delete</v-card-title>
      <v-card-subtitle>Defect name: {{ toDelete!.name }}</v-card-subtitle>
      <v-card-text> Are you sure you want to delete this defect?</v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
        <v-btn color="error" @click="deleteDefect(toDelete!.id)">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { del, get, patchJSON, postJSON } from "@/http/http";
import { IDefect } from "@cloud-porsche/types";
import StatusChip from "@/components/StatusChip.vue";

const loading = ref(true);
const defects = ref<IDefect[]>([]);
const dialog = ref(false);
const confirmDialog = ref(false);

const activeDefect = ref<Partial<IDefect>>({});
const toDelete = ref<IDefect | undefined>(undefined);

const headers = [
  {
    title: "ID",
    value: "id",
    sortable: true,
    maxWidth: "100px",
  },
  {
    title: "Name",
    value: "name",
    sortable: true,
    maxWidth: "100px",
  },
  {
    title: "Location",
    value: "location",
    sortable: true,
    maxWidth: "100px",
  },
  {
    title: "Description Short",
    value: "descriptionShort",
    sortable: true,
    maxWidth: "120px",
    nowrap: true,
  },
  {
    title: "Description Long",
    value: "descriptionLong",
    sortable: true,
    maxWidth: "100px",
    nowrap: true,
  },
  {
    title: "Reported Date",
    value: "reportedDate",
    nowrap: true,
  },
  {
    title: "Status",
    value: "status",
    sortable: true,
    maxWidth: "100px",
  },
  {
    title: "Actions",
    value: "actions",
    sortable: false,
    nowrap: true,
    maxWidth: "100px",
  },
];

refetch();

function refetch() {
  loading.value = true;
  get("/v1/defects")
    .json()
    .then((data) => {
      defects.value = data as IDefect[];
      loading.value = false;
    });
}

// Open dialog for adding a defect
function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  // offset until transition/animation is done
  setTimeout(() => (activeDefect.value = {}), 100);
}

function editDialog(defect: IDefect) {
  activeDefect.value = defect;
  dialog.value = true;
}

function initiateDeletion(defect: IDefect | undefined) {
  if (!defect) {
    console.error("No defect to delete");
    return;
  }
  toDelete.value = defect;
  confirmDialog.value = true;
}

// Handle the save action from AddDefectPopup
function handleSave(newDefect: IDefect) {
  postJSON("/v1/defects", newDefect).then(() => {
    refetch();
  });
  dialog.value = false;
}

// Function to handle search/filter update from SearchFilter component
function handleUpdateList(search: String, filter: String) {
  loading.value = true;
  get(`/v1/defects/search?search=${search}&filter=${filter}`)
    .json()
    .then((data) => {
      defects.value = data as IDefect[];
      loading.value = false;
    });
}

function deleteDefect(id: string | number) {
  loading.value = true;
  del(`/v1/defects/${id}`).then(() => {
    refetch();
  });
  confirmDialog.value = false;
}

function patchDefect(id: string | number, defect: Partial<IDefect>) {
  loading.value = true;
  patchJSON(`/v1/defects/${id}`, defect).then(() => {
    refetch();
  });
}

function formatDate(date: string | Date) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("de-DE", options).format(new Date(date));
}
</script>

<style>
.data-table td {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
