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

      <v-btn
        :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        slim
        v-tooltip="'Toggle Theme'"
        @click="appStore.toggleTheme()"
      />
    </v-app-bar>

    <v-navigation-drawer v-model="drawerOpen">
      <v-list nav v-model:opened="openNavigations" class="scroll-bar-thin">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          to="/"
          title="Dashboard"
          value="dashboard"
          :active="router.currentRoute.value.path === '/'"
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
            to="/property"
            prepend-icon="mdi-view-list"
            title="Management"
            value="properties"
            :active="router.currentRoute.value.path === '/property'"
          >
          </v-list-item>
          <v-list-item
            v-for="property in propertyStore.properties"
            :to="'/property/' + property.id"
            :title="property.name ?? property.id"
            :value="property.id"
            :active="
              router.currentRoute.value.path === '/property/' + property.id
            "
          />
        </v-list-group>
        <v-list-item
          prepend-icon="mdi-hammer-screwdriver"
          to="/defects"
          title="Defects"
          value="defects"
          :active="router.currentRoute.value.path === '/defects'"
        />
      </v-list>
      <template v-slot:append>
        <v-list nav>
          <v-list-item
            v-if="user"
            to="/profile"
            title="Profile"
            value="profile"
            prepend-icon="mdi-account-circle"
            :active="router.currentRoute.value.path === '/profile'"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-cog"
            to="/settings"
            title="Settings"
            value="settings"
            :active="router.currentRoute.value.path === '/settings'"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
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

const { mobile } = useDisplay();

const drawerOpen = ref(true);
const openNavigations = ref([]);

const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

const user = useCurrentUser();

const auth = useFirebaseAuth();

auth?.authStateReady().then(() => appStore.setAuthLoading(false));

const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
if (authDomain && auth && authDomain.includes("localhost")) {
  connectAuthEmulator(auth, authDomain);
}

const propertyStore = usePropertyStore();

onMounted(() => {
  propertyStore.fetchProperties();
});
</script>

<style lang="scss">
:root {
  scrollbar-width: thin;
}

.v-responsive {
  padding: 2em;
}

.v-list-group__items a.v-list-item {
  padding-inline-start: calc(-8px + var(--indent-padding)) !important;
}

div:has(.scroll-bar-thin) {
  scrollbar-width: thin;
}
</style>
