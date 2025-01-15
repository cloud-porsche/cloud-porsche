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
              :key="selection.title"
              class="pa-5"
            >
              <v-list-item-title
                >{{
                  (selection.advanced ? "Disabled: " : "") + selection.title
                }}
              </v-list-item-title>
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
            <ProTier
              v-else-if="
                tab.title === 'User Management' && useAppStore().hasAdminAccess
              "
            >
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
          <v-expansion-panels v-if="tab.migration" rounded class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-list-item>
                  <v-list-item-title>Data Migration</v-list-item-title>
                  <v-list-item-subtitle>
                    Migrating from a different tenant? Enter your details below
                    and start the migration process.
                  </v-list-item-subtitle>
                </v-list-item>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-form @submit="doMigration()" class="ma-2">
                  <v-text-field
                    v-model="oldTenantId"
                    label="Old Tenant ID"
                    required
                  >
                    <template #append>
                      <v-icon
                        v-tooltip:top="
                          'You can find your tenant id in the path of your URL (e.g. yourname-y71nc)'
                        "
                        >mdi-help-circle-outline
                      </v-icon>
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-model="oldEmail"
                    label="Old Tenant Email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="oldPassword"
                    label="Old Tenant Password"
                    required
                    type="password"
                  ></v-text-field>
                  <v-divider class="pb-4" />
                  <span>
                    <v-btn
                      @click="doMigration"
                      :color="migrationError ? 'error' : 'primary'"
                      :loading="migrationLoading"
                      :disabled="!oldTenantId || !oldEmail || !oldPassword"
                    >
                      Confirm & Start Migration
                    </v-btn>
                    <span v-if="migrationLong" class="pl-4">{{
                      migrationLong
                    }}</span>
                  </span>
                </v-form>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
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
    <v-alert
      v-if="migrationSuccess || migrationError"
      closable
      :type="migrationSuccess ? 'success' : 'error'"
      class="ms-8 me-8 mb-8"
      >{{ migrationSuccess || migrationError }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { MaterialVersion } from "@/plugins/vuetify";
import router from "@/router";
import { post } from "@/http/http";
import { useFirebaseAuth } from "vuefire";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { usePropertyStore } from "@/stores/properties";

const auth = useFirebaseAuth();
const appStore = useAppStore();
const userStore = useUserStore();
const propertyStore = usePropertyStore();
const tenantId = computed(
  () => (router.currentRoute.value.params as any).tenantId,
);
const dialog = ref(false);
const deleteUserDialog = ref(false);
const newUserEmail = ref("");
const newUserRole = ref("user");
const oldUserRole = ref("");
const editingUID = ref("");
const deleteUserUid = ref("");
const deleteUserMail = ref("");

const oldTenantId = ref("");
const oldEmail = ref("");
const oldPassword = ref("");
const migrationError = ref<string | undefined>(undefined);
const migrationLoading = ref(false);
const migrationLong = ref<string | undefined>(undefined);
const migrationSuccess = ref<string | undefined>(undefined);

const doMigration = async () => {
  if (!auth) return;
  migrationSuccess.value = undefined;
  migrationLoading.value = true;
  setTimeout(() => {
    if (migrationLoading.value) {
      migrationLong.value =
        "Migration is taking longer than expected. Please be patient.";
    }
  }, 15000);
  migrationError.value = undefined;
  try {
    const currentToken = await auth.currentUser?.getIdToken();
    if (!currentToken) {
      console.error("Currently not logged in!");
      return;
    }
    const tempApp = initializeApp(
      {
        projectId: "cloud-porsche",
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      },
      "temp",
    );
    const tempAuth = getAuth(tempApp);
    tempAuth.tenantId = oldTenantId.value;
    const oldUser = await signInWithEmailAndPassword(
      tempAuth,
      oldEmail.value,
      oldPassword.value,
    );
    const oldAuthToken = await oldUser.user.getIdToken();
    const headers = new Headers();
    headers.set("authorization-old", oldAuthToken);
    headers.set("authorization-new", currentToken);
    await post(
      `/v1/tenants/${oldTenantId.value}/migrate/${tenantId.value}`,
      undefined,
      {
        headers: headers,
      },
      "tenantManagement",
    );
    migrationSuccess.value = "Migration successful!";
    await propertyStore.fetchProperties();
  } catch (error) {
    migrationError.value = "Migration failed: " + error;
  } finally {
    migrationLong.value = undefined;
    migrationLoading.value = false;
  }
};

const userTableHeaders = [
  { title: "Email", key: "email" },
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
    migration: !["free-tier", "free"].includes(tenantId.value),
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
  {
    title: "Tenant Management",
    text: "Settings for the Tenant Management Module.",
    selections: [
      {
        title: "API Endpoint",
        advanced: import.meta.env.PROD,
        text: "This will be the communication endpoint for tenant management.",
        options: [
          ...new Set<string>([
            ...(import.meta.env.VITE_TENANT_MANAGEMENT_API_OPTIONS ?? "").split(
              ",",
            ),
            import.meta.env.VITE_TENANT_MANAGEMENT_API_URL,
            appStore.api.tenantManagement,
          ]),
        ],
        initial: appStore.api.tenantManagement,
        valueChange: (value: string) => {
          appStore.changeTenantManagementApiURL(value);
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
      await userStore.addUser(
        tenantId.value,
        newUserEmail.value,
        newUserRole.value,
      );
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
