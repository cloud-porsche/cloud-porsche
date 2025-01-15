<template>
  <div>
    <v-toolbar density="comfortable">
      <v-tabs v-model="activeTab">
        <v-tab v-for="tab in tabs" :key="tab.title" :value="tab.title">
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item
        v-for="tab in tabs"
        :key="tab.title"
        :value="tab.title"
      >
        <v-responsive>
          <p class="pb-4">{{ tab.text }}</p>
          <v-divider class="pa-2" />
          <v-list rounded>
            <v-list-item
              v-if="tab.selections"
              v-for="selection in tab.selections"
              :disabled="selection.advanced"
              v-tooltip:center="
                selection.advanced ? 'Advanced Setting blocked' : ''
              "
              :key="selection.title"
              class="pa-5"
            >
              <v-list-item-title>{{ selection.title }}</v-list-item-title>
              <v-list-item-subtitle class="d-block pb-5"
                >{{ selection.text }}
              </v-list-item-subtitle>
              <v-select
                :model-value="selection.initial"
                @update:model-value="selection.valueChange"
                :items="selection.options"
                outlined
              >
              </v-select>
            </v-list-item>
            <ProTier v-else-if="
                tab.title === 'User Management' && useAppStore().hasAdminAccess
              ">
              <v-list-item class="pa-5">
                <div class="d-flex justify-space-between pb-10">
                  <h2>User Management</h2>
                  <div class="d-flex justify-end">
                    <v-btn
                      color="primary"
                      @click="
                        userStore.fetchUsers(tenantId, appStore.currUser.uid)
                      "
                    >
                      Refresh
                    </v-btn>
                    <v-spacer class="pl-5"></v-spacer>
                    <v-btn color="primary" @click="openAddUserDialog">
                      Add User
                    </v-btn>
                  </div>
                </div>
                <v-data-table
                  class="data-table rounded"
                  density="comfortable"
                  :items="userStore.users"
                  :headers="userTableHeaders"
                  :items-per-page-options="[
                    { value: 5, title: '5' },
                    { value: 10, title: '10' },
                    { value: 25, title: '25' },
                    { value: -1, title: 'All' },
                  ]"
                  item-value="email"
                  dense
                  outlined
                >
                  <template #item.email="{ item }">
                    {{ item.email }}
                  </template>
                  <template #item.uid="{ item }">
                    {{ item.uid }}
                  </template>
                  <template #item.role="{ item }">
                    {{ item.role }}
                  </template>
                  <template #item.action="{ item }">
                    <div>
                      <v-icon class="me-3" @click="openEditUserDialog(item)">
                        mdi-pencil
                      </v-icon>
                      <v-icon color="red" @click="openDeleteUserDialog(item)">
                        mdi-delete
                      </v-icon>
                    </div>
                  </template>
                </v-data-table>
              </v-list-item>
            </ProTier>
            <v-list-item v-else class="pa-5">
              <v-list-item-title>No settings available.</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">
                  {{ editingUID ? "Edit User Role" : "Add New User" }}
                </span>
              </v-card-title>

              <v-card-text>
                <v-text-field
                  v-if="!editingUID"
                  v-model="newUserEmail"
                  label="User Email"
                  outlined
                  required
                  editable="true"
                  :rules="[
                    (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                  ]"
                ></v-text-field>
                <v-select
                  v-model="newUserRole"
                  label="Role"
                  :items="['admin', 'user', 'manager']"
                  outlined
                  required
                ></v-select>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="dialog = false"> Cancel</v-btn>
                <v-btn
                  color="primary"
                  :disabled="
                    (!!editingUID && oldUserRole === newUserRole) ||
                    (!editingUID && !/.+@.+\..+/.test(newUserEmail))
                  "
                  @click="handleAddOrUpdateUser"
                >
                  {{ editingUID ? "Update" : "Add User" }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deleteUserDialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Delete User</span>
              </v-card-title>

              <v-card-text>
                <p>
                  Are you sure you want to delete the user {{ deleteUserMail }}?
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue" @click="deleteUserDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="red" @click="handleDeleteUser">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-responsive>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { MaterialVersion } from "@/plugins/vuetify";
import router from "@/router";

const appStore = useAppStore();
const userStore = useUserStore();
const tenantId = computed(() => (router.currentRoute.value.params as any).tenantId);
const dialog = ref(false);
const deleteUserDialog = ref(false);
const newUserEmail = ref("");
const newUserRole = ref("user");
const oldUserRole = ref("");
const editingUID = ref("");
const deleteUserUid = ref("");
const deleteUserMail = ref("");

const userTableHeaders = [
  { title: "Email", key: "email"},
  { title: "UID", key: "uid" },
  { title: "Current Role", key: "role" },
  { title: "Actions", key: "action", sortable: false, maxWidth: "100px" },
];
const tabs = computed(() => [
  {
    title: "General",
    text: "General settings for the Cloud Porsche application.",
    selections: [
      {
        title: "Material Design",
        advanced: false,
        text: "You can choose between the 3 Material Design variants of Googles Material Design.",
        chips: true,
        options: [
          MaterialVersion.NONE,
          MaterialVersion.MD1,
          MaterialVersion.MD2,
          MaterialVersion.MD3,
        ],
        initial: localStorage.getItem("material") ?? MaterialVersion.NONE,
        valueChange: (value: MaterialVersion) => {
          localStorage.setItem("material", value);
          window.location.reload();
        },
      },
    ],
  },
  {
    title: "User Management",
    text: "Manage users for the current tenant.",
  },
  {
    title: "Property Management",
    text: "Settings for the Property Management Module.",
    selections: [
      {
        title: "API Endpoint",
        advanced: import.meta.env.PROD,
        text: "This will be the communication endpoint for Defects.",
        options: [
          ...new Set<string>([
            ...(
              import.meta.env.VITE_PROPERTY_MANAGEMENT_API_OPTIONS ?? ""
            ).split(","),
            import.meta.env.VITE_PROPERTY_MANAGEMENT_API_URL,
            appStore.api.propertyManagement,
          ]),
        ],
        initial: appStore.api.propertyManagement,
        valueChange: (value: string) => {
          appStore.changePropertyManagementApiURL(value);
        },
      },
    ],
  },
  {
    title: "Parking Management",
    text: "Settings for the Parking Management Module.",
    selections: [
      {
        title: "API Endpoint",
        advanced: import.meta.env.PROD,
        text: "This will be the communication endpoint for Parking spots.",
        options: [
          ...new Set<string>([
            ...(
              import.meta.env.VITE_PARKING_MANAGEMENT_API_OPTIONS ?? ""
            ).split(","),
            import.meta.env.VITE_PARKING_MANAGEMENT_API_URL,
            appStore.api.parkingManagement,
          ]),
        ],
        initial: appStore.api.parkingManagement,
        valueChange: (value: string) => {
          appStore.changeParkingManagementApiURL(value);
        },
      },
    ],
  },
  {
    title: "Monitoring Management",
    text: "Settings for the Monitoring Management Module.",
    selections: [
      {
        title: "API Endpoint",
        advanced: import.meta.env.PROD,
        text: "This will be the communication endpoint for the Monitoring.",
        options: [
          ...new Set<string>([
            ...(
              import.meta.env.VITE_MONITORING_MANAGEMENT_API_OPTIONS ?? ""
            ).split(","),
            import.meta.env.VITE_MONITORING_MANAGEMENT_API_URL,
            appStore.api.monitoringManagement,
          ]),
        ],
        initial: appStore.api.monitoringManagement,
        valueChange: (value: string) => {
          appStore.changeMonitoringManagementApiURL(value);
        },
      },
    ],
  },
]);
const activeTab = ref(tabs.value[0]);

const openEditUserDialog = (user: {
  uid: string;
  email: string;
  role: string;
}) => {
  dialog.value = true;
  editingUID.value = user.uid;
  newUserEmail.value = user.email;
  newUserRole.value = user.role;
  oldUserRole.value = user.role;
};

const openDeleteUserDialog = (user: {
  uid: string;
  email: string;
  role: string;
}) => {
  deleteUserDialog.value = true;
  deleteUserUid.value = user.uid;
  deleteUserMail.value = user.email;
};

const handleAddOrUpdateUser = async () => {
  try {
    if (editingUID.value) {
      await userStore.updateUserRole(
        tenantId.value,
        editingUID.value,
        newUserRole.value,
      );
    } else {
      await userStore.addUser(tenantId.value, newUserEmail.value, newUserRole.value);
    }
  } catch (error) {
    console.error("Error in adding or updating user:", error);
  } finally {
    dialog.value = false;
  }
};

const handleDeleteUser = async () => {
  try {
    await userStore.deleteUser(tenantId.value, deleteUserUid.value);
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    deleteUserDialog.value = false;
  }
};

const openAddUserDialog = () => {
  newUserEmail.value = "";
  newUserRole.value = "user";
  editingUID.value = "";
  dialog.value = true;
};
</script>

<style scoped></style>
