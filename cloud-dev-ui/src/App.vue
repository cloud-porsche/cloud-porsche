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
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          to="/"
          title="Dashboard"
          value=""
          :active="router.currentRoute.value.path === '/'"
        >
        </v-list-item>
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
      :model-value="!user || !user.emailVerified"
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

const { mobile } = useDisplay();

const drawerOpen = ref(true);

const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

const user = useCurrentUser();

const auth = useFirebaseAuth();

const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
if (authDomain && auth && authDomain.includes("localhost")) {
  connectAuthEmulator(auth, authDomain);
}
</script>

<style lang="scss">
:root {
  scrollbar-width: thin;
}

.v-responsive {
  padding: 2em;
}
</style>
