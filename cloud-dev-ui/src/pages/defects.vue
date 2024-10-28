<template>
  <v-responsive>
    <SearchFilter
      @updateList="handleUpdateList"
      @refresh="refetch()"
      @add="openDialog"
      :error="error"
      :loading="loading"
    />

    <v-data-table
      class="data-table rounded"
      :mobile="mobile"
      density="comfortable"
      :no-data-text="error ? 'A network error occurred ⚡' : 'No defects found'"
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
      <template v-slot:item.image="{ item }">
        <v-img
          v-if="item.image?.length > 0"
          :src="item.image"
          max-width="10"
          aspect-ratio="1"
          contain
          @click="inspectedImage = { open: true, src: item.image }"
        >
          <template v-slot:error>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon color="error" icon="mdi-image-broken-variant"></v-icon>
            </div>
          </template>
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                size="24"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
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
              class="expanded-defect pa-2"
            >
              <strong>{{ column.title }}</strong>
              <div v-if="column.value === 'reportedDate'">
                {{ formatDate(item.reportedDate) }}
              </div>
              <div v-else-if="column.value === 'status'">
                <StatusChip :defect="item" />
              </div>
              <div v-else-if="column.value === 'image'">
                <v-img
                  v-if="item.image?.length > 0"
                  :src="item.image"
                  contain
                  max-height="300"
                  @click="inspectedImage = { open: true, src: item.image }"
                >
                  <template v-slot:error>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon
                        color="error"
                        icon="mdi-image-broken-variant"
                      ></v-icon>
                    </div>
                  </template>
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate></v-progress-circular>
                    </div>
                  </template>
                </v-img>
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

    <v-dialog v-model="inspectedImage.open" max-width="50%" max-height="80%">
      <v-card rounded class="d-flex flex-row overflow-hidden">
        <v-img
          v-if="inspectedImage.src"
          :src="inspectedImage.src"
          contain
          max-height="100%"
          rounded
          @click="inspectedImage = { open: false, src: undefined }"
        >
          <template v-slot:error>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon color="error" icon="mdi-image-broken-variant"></v-icon>
            </div>
          </template>
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-card>
    </v-dialog>

    <AddDefectPopup
      v-model="dialog"
      :defect="activeDefect"
      :patch="!!activeDefect.id"
      @save="handleSave"
      @patch="patchDefect(activeDefect.id!, $event)"
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
import { del, get, patchJSON, post, postJSON } from "@/http/http";
import { IDefect } from "@cloud-porsche/types";
import StatusChip from "@/components/StatusChip.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const loading = ref(true);
const error = ref(false);
const defects = ref<IDefect[]>([]);
const dialog = ref(false);
const confirmDialog = ref(false);

const inspectedImage = ref<{ open: boolean; src?: string }>({
  open: false,
  src: undefined,
});

watch(dialog, (newVal) => {
  if (!newVal) {
    closeDialog();
  }
});

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
    title: "Image",
    value: "image",
    sortable: false,
    nowrap: true,
    maxWidth: "150px", // Adjust as needed
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

function errHandler(_: Error) {
  loading.value = false;
  error.value = true;
}

function refetch() {
  loading.value = true;
  get("/v1/defects")
    .json()
    .then(async (data) => {
      defects.value = await Promise.all(
        (data as IDefect[]).map(async (defect) => {
          // Fetch the image URL and assign it to the defect object
          defect.image = await fetchImage(defect.image); // Replace with actual image filename as needed
          return defect;
        }),
      );
      loading.value = false;
      error.value = false;
    })
    .catch(errHandler);
}

async function fetchImage(fileName: string) {
  try {
    const response = await get(`/v1/storage/${fileName}`);
    if (!response.ok) throw new Error("Failed to fetch signed URL");
    const { signedUrl } = await response.json();
    return signedUrl;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    return "";
  }
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
function handleSave(newDefect: IDefect, image: File | null) {
  if (image) {
    const randomImageId = crypto.randomUUID() + ".jpg";
    newDefect.image = randomImageId;
    const newFile = new File([image], randomImageId, { type: image.type });

    const formData = new FormData();
    formData.append("file", newFile);
    // need to wait for the image to be uploaded before refetching
    post("/v1/storage/upload", formData).then(() =>
      postJSON("/v1/defects", newDefect).then(() => {
        refetch();
      }),
    );
  } else {
    postJSON("/v1/defects", newDefect).then(() => {
      refetch();
    });
  }
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

.v-data-table__tr--mobile td div:nth-child(2) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expanded-defect {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
