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
            <v-list-item
              v-else-if="tab.title === 'User Management' && useAppStore().currUser.role === 'admin'"
              class="pa-5"
            >
              <v-list-item-title>User Management</v-list-item-title>
              <v-btn color="primary" @click="openAddUserDialog" class="mb-4">
                Add User
              </v-btn>
              <v-data-table
              :items="users"
              :headers="userTableHeaders"
              :items-per-page-options="[
                { value: 5, title: '5' },
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: -1, title: 'All' },
              ]"
              item-value="email"
              class="elevation-1"
              dense
              outlined
            >
              <template #item.role="{ item }">
                {{ item.role }}
              </template>
              <template #item.action="{ item }">
                <v-icon class="me-3" color="blue" @click="openEditUserDialog(item)">
                  mdi-pencil
                </v-icon>
                <v-icon color="red" @click="deleteUser(item.email)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            </v-list-item>
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
                <v-btn color="blue" @click="dialog = false"> Cancel </v-btn>
                <v-btn
                  color="green"
                  @click="editingUID ? updateUserRole() : addUser()"
                >
                  {{ editingUID ? "Update" : "Add User" }}
                </v-btn>
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
import { MaterialVersion } from "@/plugins/vuetify";
import { del, get, postJSON } from "@/http/http";
import router from "@/router";
import { getAuth } from "firebase/auth";

const appStore = useAppStore();
const tenantId = (router.currentRoute.value.params as any)["tenantId"];
const users = ref<Array<{ email: string; uid: string; role: string }>>([]);
const dialog = ref(false);
const newUserEmail = ref("");
const newUserRole = ref("user");
const editingUID = ref("");

const userTableHeaders = [
  { text: "Email", value: "email" },
  { text: "Current Role", value: "role" },
  { text: "UID", value: "uid"},
  { text: "Actions", value: "action", sortable: false, maxWidth: "50px", },
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

const fetchUsers = async () => {
  try {
    const response = await get(
      `/v1/tenants/${tenantId}/users`,
      undefined,
      "tenantManagement"
    );
    const fetchedUsers = await response.json();

    if (Array.isArray(fetchedUsers)) {
      users.value = fetchedUsers.map((user) => ({
        email: user.email,
        uid: user.uid,
        role: user.customClaims?.role,
      }));
    } else {
      console.error("Fetched users data is not an array.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const openEditUserDialog = (user: { uid: string; email: string; role: string }) => {
  editingUID.value = user.uid;
  newUserEmail.value = user.email;
  newUserRole.value = user.role;
  dialog.value = true;
};

const addUser = async () => {
  if (!newUserEmail.value || !newUserRole.value) {
    console.error("Email and Role are required.");
    return;
  }

  try {
    const newUser = {
      email: newUserEmail.value,
      role: newUserRole.value,
    };

    await postJSON(
      `/v1/tenants/${tenantId}/users`,
      newUser,
      undefined,
      "tenantManagement"
    );

    dialog.value = false;
    await fetchUsers();
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const updateUserRole = async () => {
  if (!editingUID.value || !newUserRole.value) {
    console.error("UID and Role are required.");
    return;
  }

  try {
    const updatedUser = {
      uid: editingUID.value,
      role: newUserRole.value,
    };

    await postJSON(
      `/v1/tenants/${tenantId}/users/setRole`,
      updatedUser,
      undefined,
      "tenantManagement"
    );

    dialog.value = false;
    await fetchUsers();
  } catch (error) {
    console.error("Error updating user role:", error);
  }
};

const deleteUser = async (email: string) => {
  const userToDelete = users.value.find((user) => user.email === email);
  if (!userToDelete || !userToDelete.uid) {
    console.error("User not found or missing UID");
    return;
  }

  try {
    await del(
      `/v1/tenants/${tenantId}/users/${userToDelete.uid}`,
      undefined,
      "tenantManagement"
    );
    await fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

getAuth().onAuthStateChanged(async (user) => {
  await router.isReady();
  const token = await user?.getIdTokenResult(true);

  if (token?.claims?.role === "admin") {
    fetchUsers();
  }
});

const openAddUserDialog = () => {
  newUserEmail.value = "";
  newUserRole.value = "user";
  editingUID.value = "";
  dialog.value = true;
};
</script>

<style scoped></style>
