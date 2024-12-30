<template>
  <div>
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
        :no-data-text="
          error ? 'A network error occurred ⚡' : 'No defects found'
        "
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
          {{ useDateFormat(item.reportedDate, "MM.DD.YYYY") }}
        </template>
        <template v-slot:item.signedImage="{ item }">
          <v-img
            v-if="item.signedImage?.length > 0"
            :src="item.signedImage"
            class="cursor-pointer"
            aspect-ratio="1"
            contain
            @click="inspectedImage = { open: true, src: item.signedImage }"
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
                  {{ useDateFormat(item.reportedDate, "MM.DD.YYYY HH:mm") }}
                </div>
                <div v-else-if="column.value === 'status'">
                  <StatusChip :defect="item" />
                </div>
                <div v-else-if="column.value === 'signedImage'">
                  <v-img
                    v-if="item.signedImage?.length > 0"
                    :src="item.signedImage"
                    class="cursor-pointer"
                    contain
                    position="left"
                    max-height="300"
                    @click="
                      inspectedImage = { open: true, src: item.signedImage }
                    "
                  >
                    <template v-slot:error>
                      <div
                        class="d-flex align-center justify-start fill-height"
                      >
                        <v-icon
                          color="error"
                          size="50"
                          icon="mdi-image-broken-variant"
                          v-tooltip="'Corrupted or missing Image'"
                        ></v-icon>
                      </div>
                    </template>
                    <template v-slot:placeholder>
                      <div
                        class="d-flex align-center justify-start fill-height"
                      >
                        <v-progress-circular
                          indeterminate
                        ></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                  <i v-else>No image.</i>
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
                    variant="flat"
                    >Delete
                  </v-btn>
                </div>
                <div v-else>{{ item[column.value as keyof SignedDefect] }}</div>
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
            min-height="300"
            rounded
            @click="inspectedImage = { open: false, src: undefined }"
          >
            <template v-slot:error>
              <div
                class="d-flex flex-column align-center justify-center fill-height"
              >
                <v-icon
                  color="error"
                  size="100"
                  icon="mdi-image-broken-variant"
                ></v-icon>
                <i class="pa-2 text-red-lighten-3"
                  >Corrupted or missing Image.</i
                >
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
        @patch="patchDefect(activeDefect.id!, $event[0], $event[1], $event[2])"
      />
    </v-responsive>
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-subtitle>Defect name: {{ toDelete!.name }}</v-card-subtitle>
        <v-card-text>Are you sure you want to delete this defect?</v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deleteDefect(toDelete!.id)"
            autofocus
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { del, get, patch, patchJSON, post, postJSON } from "@/http/http";
import { IDefect } from "@cloud-porsche/types";
import StatusChip from "@/components/StatusChip.vue";
import { useDisplay } from "vuetify";
import { useDateFormat } from "@vueuse/core";
import { ref } from "vue";
import { useRoute } from "vue-router";

export type SignedDefect = IDefect & { signedImage: string };

const { mobile } = useDisplay();

const loading = ref(true);
const error = ref(false);
const defects = ref<SignedDefect[]>([]);
const dialog = ref(false);
const confirmDialog = ref(false);

const route = useRoute();
const id = computed(() => (route.params as any)["id"]);

const inspectedImage = ref<{ open: boolean; src?: string }>({
  open: false,
  src: undefined,
});

watch(dialog, (newVal) => {
  if (!newVal) {
    closeDialog();
  }
});

const activeDefect = ref<Partial<SignedDefect>>({});
const toDelete = ref<SignedDefect | undefined>(undefined);

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
    nowrap: true,
  },
  {
    title: "Location",
    value: "location",
    sortable: true,
    maxWidth: "100px",
    nowrap: true,
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
    value: "signedImage",
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

watch(id, () => {
  refetch();
});

function errHandler(_: Error) {
  loading.value = false;
  error.value = true;
}

function refetch() {
  if (!id.value) {
    console.error("Property ID is missing");
    return;
  }

  loading.value = true;
  get(`/v1/defects?propertyId=${id.value}`)
    .json()
    .then(async (data) => {
      defects.value = await Promise.all(
        (data as SignedDefect[]).map(async (defect) => {
          // Fetch the image URL and assign it to the defect object
          defect.signedImage = await fetchImage(defect.image); // Replace with actual image filename as needed
          return defect;
        })
      );
      loading.value = false;
      error.value = false;
    })
    .catch(errHandler);
}

async function fetchImage(fileName: string) {
  if (!fileName) return "";
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

function editDialog(defect: SignedDefect) {
  activeDefect.value = defect;
  dialog.value = true;
}

function initiateDeletion(defect: SignedDefect | undefined) {
  if (!defect) {
    console.error("No defect to delete");
    return;
  }
  toDelete.value = defect;
  confirmDialog.value = true;
}

// Handle the save action from AddDefectPopup
function handleSave(newDefect: IDefect, image?: File) {
  newDefect.propertyId = id.value;
  console.log(newDefect);
  loading.value = true;
  if (image) {
    const newFile = new File([image], newDefect.image, { type: image.type });

    const formData = new FormData();
    formData.append("file", newFile);
    // need to wait for the image to be uploaded before refetching
    post("/v1/storage/upload", formData)
      .then(() =>
        postJSON("/v1/defects", newDefect).then(() => {
          refetch();
        })
      )
      .catch(errHandler);
  } else {
    postJSON("/v1/defects", newDefect)
      .then(() => {
        refetch();
      })
      .catch(errHandler);
  }
  dialog.value = false;
}

// Function to handle search/filter update from SearchFilter component
function handleUpdateList(search: string, filter: string) {
  if (!id.value) {
    console.error("Property ID is missing");
    return;
  }

  loading.value = true;
  get(
    `/v1/defects/search?search=${search}&filter=${filter}&propertyId=${id.value}`
  )
    .json()
    .then(async (data) => {
      defects.value = await Promise.all(
        (data as SignedDefect[]).map(async (defect) => {
          // Fetch the image URL and assign it to the defect object
          defect.signedImage = await fetchImage(defect.image); // Replace with actual image filename as needed
          return defect;
        })
      );
      loading.value = false;
      error.value = false;
    })
    .catch(errHandler);
}

function deleteDefect(id: string | number) {
  loading.value = true;
  del(`/v1/defects/${id}`).then(() => {
    refetch();
  });
  confirmDialog.value = false;
}

function patchDefect(
  id: string,
  defect: Partial<SignedDefect>,
  image?: File,
  oldId?: string
) {
  loading.value = true;
  if (image && defect.image && oldId !== defect.image) {
    const newFile = new File([image], defect.image, { type: image.type });

    const formData = new FormData();
    formData.append("file", newFile);
    // need to wait for the image to be uploaded before refetching
    (oldId
      ? patch(`/v1/storage/upload/${oldId}`, formData)
      : post(`/v1/storage/upload`, formData)
    )
      .then(() =>
        patchJSON(`/v1/defects/${id}`, defect).then(() => {
          refetch();
        })
      )
      .catch(errHandler);
  } else if (!image && oldId) {
    del(`/v1/storage/${oldId}`)
      .then(() => {
        patchJSON(`/v1/defects/${id}`, defect).then(() => {
          refetch();
        });
      })
      .catch(errHandler);
  } else {
    patchJSON(`/v1/defects/${id}`, defect)
      .then(() => {
        refetch();
      })
      .catch(errHandler);
  }
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
