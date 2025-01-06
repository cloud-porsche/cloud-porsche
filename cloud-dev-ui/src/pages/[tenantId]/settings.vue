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
              v-else-if="tab.title === 'User Management'"
              class="pa-5"
            >
              <v-list-item-title>User Management</v-list-item-title>
              <v-data-table
                :items="users"
                :headers="userTableHeaders"
                item-value="email"
                class="elevation-1"
              >
                <template #item.action="{ item }">
                  <v-btn color="red" @click="deleteUser(item.email)">
                    Delete
                  </v-btn>
                </template>
              </v-data-table>
            </v-list-item>
            <v-list-item v-else class="pa-5">
              <v-list-item-title>No settings available.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-responsive>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { MaterialVersion } from "@/plugins/vuetify";
import { del, get } from "@/http/http";
import router from "@/router";
import { onMounted } from "vue";

const appStore = useAppStore();
const tabs = computed(() => [
  {
    title: "General",
    text: "General settings for the Cloud Porsche application.",
    selections: [
      {
        title: "Material Design",
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
]);
const activeTab = ref(tabs.value[0]);
const tenantId = (router.currentRoute.value.params as any)["tenantId"];
let users = ref([]);

const userTableHeaders = [
  { text: "Email", value: "email" },
  { text: "Action", value: "action", sortable: false },
];

// Fetch users for the tenant
const fetchUsers = async () => {
  console.log("Tenant ID:", tenantId);
  try {
    users = await (
      await get(`/v1/tenants/${tenantId}/users`, undefined, "tenantManagement")
    ).json();
    console.log("Users fetched:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Delete user by email
const deleteUser = async (email: string) => {
  try {
    await del(
      `/v1/tenants/${tenantId}/users/${email}`,
      undefined,
      "tenantManagement",
    );
    users.value = users.value.filter((user) => user.email !== email);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

onMounted(() => {
  if (tabs.value.some((tab) => tab.title === "User Management")) {
    fetchUsers();
  }
});
</script>

<style scoped></style>
