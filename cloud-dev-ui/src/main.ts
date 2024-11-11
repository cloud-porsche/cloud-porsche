/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import vuetify from "@/plugins/vuetify";
import { VueFire, VueFireAuthWithDependencies } from "vuefire";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";

const app = createApp(App);

registerPlugins(app);

app.use(vuetify);

app.use(VueFire, {
  firebaseApp: initializeApp({
    projectId: "cloud-porsche",
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  }),
  modules: [
    VueFireAuthWithDependencies({
      dependencies: {
        persistence: [browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      },
    }),
  ],
});

app.mount("#app");
