<template>
  <v-responsive>
    <SearchFilter
      @updateList="handleUpdateList"
      @refresh="refetch()"
      @add="openDialog"
      :loading="loading"
    />

    <v-data-table
      :items="defects"
      :headers="headers"
      class="data-table"
      show-expand
      multi-sort
    >
      <template v-slot:item.status="{ item }">
        <StatusChip :defect="item" />
      </template>
      <template v-slot:item.reportedDate="{ item }">
        {{ formatDate(item.reportedDate) }}
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="pa-5">
            <div v-for="column in columns" :key="column.value" class="pa-2">
              <strong>{{ column.title }}</strong>
              <div v-if="column.value === 'reportedDate'">
                {{ formatDate(item.reportedDate) }}
              </div>
              <div v-else-if="column.value === 'status'">
                <StatusChip :defect="item" />
              </div>
              <div v-else-if="column.value === 'actions'">
                <v-btn
                  prepend-icon="mdi-delete"
                  color="error"
                  @click="deleteDefect(item.id)"
                  variant="tonal"
                  >Delete
                </v-btn>
              </div>
              <div v-else>{{ item[column.value] }}</div>
              <v-divider v-if="column.title !== ''" class="mt-2" />
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <AddDefectPopup
      v-model="dialog"
      @save="handleSave"
      @close="dialog = false"
    />
  </v-responsive>
</template>

<script lang="ts" setup>
import { del, get, postJSON } from "@/http/http";
import { IDefect } from "@cloud-porsche/types";
import StatusChip from "@/components/StatusChip.vue";

const loading = ref(true);
const defects = ref<IDefect[]>([]);
const dialog = ref(false);

const headers = [
  { title: "ID", value: "id", maxWidth: "100px" },
  { title: "Name", value: "name", maxWidth: "100px" },
  { title: "Location", value: "location", maxWidth: "100px" },
  {
    title: "Description Short",
    value: "descriptionShort",
    maxWidth: "120px",
    nowrap: true,
  },
  {
    title: "Description Long",
    value: "descriptionLong",
    maxWidth: "100px",
    nowrap: true,
  },
  {
    title: "Reported Date",
    value: "reportedDate",
    nowrap: true,
  },
  { title: "Status", value: "status", maxWidth: "100px" },
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

function deleteDefect(id: string) {
  loading.value = true;
  del(`/v1/defects/${id}`).then(() => {
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
