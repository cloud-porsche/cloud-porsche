<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-app-bar
      :title="mobile ? 'P. Software' : 'Porsche Software Premium'"
      density="comfortable"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click="drawerOpen = !drawerOpen"
        ></v-app-bar-nav-icon>
      </template>
      <v-spacer />
      <v-icon
        class="pl-6 pr-6"
        :color="appStore.wsStatus ? 'success' : 'error'"
        v-tooltip="appStore.wsStatus ? 'WS Connected' : 'WS Disconnected'"
        :icon="appStore.wsStatus ? 'mdi-wifi' : 'mdi-wifi-off'"
      ></v-icon>

      <v-btn
        :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        slim
        v-tooltip="'Toggle Theme'"
        @click="appStore.toggleTheme()"
      />
    </v-app-bar>

    <v-navigation-drawer v-model="drawerOpen" elevation="4">
      <v-list nav v-model:opened="openNavigations">
        <v-list-item
          prepend-icon="mdi-monitor-dashboard"
          :to="`/${tenantId}/`"
          title="Dashboard"
          value="dashboard"
          :active="router.currentRoute.value.path === `/${tenantId}/`"
        >
        </v-list-item>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-garage-variant"
              title="Properties"
            ></v-list-item>
          </template>
          <v-list-item
            :to="`/${tenantId}/property`"
            prepend-icon="mdi-view-list"
            title="Management"
            value="properties"
            :active="router.currentRoute.value.path === `/${tenantId}/property`"
          >
          </v-list-item>
          <v-list-item
            v-for="property in propertyStore.properties"
            :to="`/${tenantId}/property/${property.id}`"
            :title="property.name ?? property.id"
            :value="property.id"
            :active="
              router.currentRoute.value.path ===
              `/${tenantId}/property/${property.id}`
            "
          />
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-list nav>
          <v-list-item
            v-if="user"
            :to="`/${tenantId}/profile`"
            title="Profile"
            value="profile"
            prepend-icon="mdi-account-circle"
            :active="router.currentRoute.value.path === `/${tenantId}/profile`"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-cog"
            :to="`/${tenantId}/settings`"
            title="Settings"
            value="settings"
            :active="router.currentRoute.value.path === `${tenantId}/settings`"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <component :is="Component"></component>
                <template #fallback>
                  <v-progress-linear
                    indeterminate
                    color="primary"
                  ></v-progress-linear>
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </v-main>
    <AppFooter />

    <v-bottom-sheet
      :model-value="
        !appStore.authLoading && (!user || verifiedIfPassword(user))
      "
      fullscreen
      :close-on-content-click="false"
      :close-on-back="false"
      persistent
      retain-focus
      :scrim="true"
    >
      <Login />
    </v-bottom-sheet>
    <v-bottom-sheet
      :model-value="
        monitoringStore.free_data.left_free_api_calls === 0 && !user?.tenantId
      "
      fullscreen
      :close-on-content-click="false"
      :close-on-back="false"
      persistent
      retain-focus
      :scrim="true"
    >
      <FreeLock />
    </v-bottom-sheet>
  </v-app>
</template>

<script lang="ts" setup>
import router from "@/router";
import { useDisplay } from "vuetify";
import { useAppStore } from "@/stores/app";
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import Login from "@/components/Login.vue";
import { connectAuthEmulator } from "firebase/auth";
import { verifiedIfPassword } from "@/plugins/verify-user";
import { usePropertyStore } from "@/stores/properties";
import { initWs } from "./stores/ws";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ITenant } from "@cloud-porsche/types";
import { useMonitoringStore } from "./stores/monitoring";

const { mobile } = useDisplay();

const drawerOpen = ref(true);
const openNavigations = ref([]);

const appStore = useAppStore();
const monitoringStore = useMonitoringStore();
const isDark = computed(() => appStore.isDark);

const user = useCurrentUser();

const auth = useFirebaseAuth();
const route = useRoute();
const determineCurrentTenantId = () => {
  const tenantId = (route.params as any)["tenantId"];
  if (!tenantId || !auth) return null;
  auth.tenantId =
    tenantId === (import.meta.env.PROD ? "free-tier" : "free")
      ? null
      : tenantId;
  return tenantId;
};
const tenantId = computed(() => {
  return determineCurrentTenantId();
});

auth?.onAuthStateChanged(async (user) => {
  await router.isReady();
  await determineCurrentTenantId();
  if (user) {
    const token = await useCurrentUser().value?.getIdToken(true)!;
    await fetchTenantInfo(tenantId.value);
    appStore.setCurrUid(user.uid);
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.role) {
      appStore.setCurrUserRole(idTokenResult.claims.role as string);
    } else {
      appStore.setCurrUserRole("user");
    }
    initWs(token, tenantId.value);
    await propertyStore.fetchProperties();
    await monitoringStore.fetchFreeMonitoringData();
    await monitoringStore.fetchMonitoringData();
  }
  appStore.setAuthLoading(false);
});

const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
if (authDomain && auth && authDomain.includes("localhost")) {
  connectAuthEmulator(auth, authDomain);
}

const propertyStore = usePropertyStore();

const fetchTenantInfo = async (tenantId: string) => {
  const db = getFirestore();
  const docRef = doc(db, "Tenants", tenantId);
  const docData = (await getDoc(docRef)).data() as ITenant;
  console.log(docData);
  appStore.setTenantInfo(docData);
};
</script>

<style lang="scss">
* {
  scrollbar-width: thin;
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.5s ease;
}

.v-enter-from {
  transform: translateY(-100%);
}

.v-leave-to {
  transform: translateX(100%);
}

.v-responsive {
  padding: 2em;
}

.v-list-group__items a.v-list-item {
  padding-inline-start: calc(-8px + var(--indent-padding)) !important;
}

// needed for the property page
#spot-container {
  //max-height: 68svh;
  //overflow-y: auto;
  scrollbar-width: thin;
  width: 100%;

  //display: flex;
  //flex-wrap: wrap;
  gap: 0.4em;

  display: grid;
  grid-template-columns: repeat(25, 1fr);

  padding: 1em;
}
</style>
