/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";
import { createWebHashHistory } from "vue-router";
import { getCurrentUser } from "vuefire";
import { verifiedIfPassword } from "@/plugins/verify-user";
import { getAuth, signOut } from "firebase/auth";
import { useAppStore } from "@/stores/app";
import { useMonitoringStore } from "@/stores/monitoring";
import { usePropertyStore } from "@/stores/properties";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// Redirect to login page if the user is not logged in or their email is not verified
router.beforeEach(async (to, from) => {
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;
  const tenantId = (to.params as any)["tenantId"];

  if (!tenantId && to.name !== "/[tenantId]/") {
    return {
      name: "/[tenantId]/",
      params: {
        tenantId: import.meta.env.PROD ? "free-tier" : "free",
      },
    };
  }
  if (
    (!isLoggedIn || verifiedIfPassword(currentUser)) &&
    to.name !== `/[tenantId]/profile`
  ) {
    return {
      name: `/[tenantId]/profile`,
      params: {
        tenantId: tenantId,
      },
      query: {
        // Store the intended path to redirect after successful login and verification
        redirect: to.fullPath,
      },
    };
  }
  if (
    isLoggedIn &&
    (from.params as any)["tenantId"] &&
    tenantId !== (from.params as any)["tenantId"]
  ) {
    const auth = getAuth();
    const appStore = useAppStore();
    if (appStore.api.ws.connected) {
      appStore.api.ws.socket.disconnect();
    }
    appStore.$reset();
    usePropertyStore().$reset();
    useMonitoringStore().$reset();
    useUserStore().$reset();
    await signOut(auth!);
    return {
      name: "/[tenantId]/",
      params: {
        tenantId: tenantId,
      },
    };
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      window.location.reload();
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
