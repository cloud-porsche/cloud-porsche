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
import Dashboards from "@highcharts/dashboards";
import Highcharts from "highcharts";
import LayoutModule from "@highcharts/dashboards/modules/layout";
import { initializeFirestore } from "firebase/firestore";
import { useAppStore } from "./stores/app";

const app = createApp(App);
registerPlugins(app);

app.use(vuetify);

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
LayoutModule(Dashboards);

const firebaseApp = initializeApp({
  projectId: "cloud-porsche",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
});
const firestore = initializeFirestore(firebaseApp, {}, 'staging');

useAppStore().setFirestore(firestore);

app.use(VueFire, {
  firebaseApp: firebaseApp,
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
