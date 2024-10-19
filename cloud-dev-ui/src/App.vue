<template>
  <v-app :theme="theme">
    <v-app-bar
      :title="mobile ? 'PSP' : 'Porsche Software Premium'"
      density="comfortable"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click="drawerOpen = !drawerOpen"
        ></v-app-bar-nav-icon>
      </template>
      <v-spacer />

      <v-btn
        :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        slim
        v-tooltip="'Toggle Theme'"
        @click="onClick"
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
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import router from "@/router";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const localTheme = localStorage.getItem("theme");
const theme = ref(
  localTheme !== null
    ? localTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
);
const drawerOpen = ref(true);

function onClick() {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
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
