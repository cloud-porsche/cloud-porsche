/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";
import { createWebHashHistory, useRoute } from "vue-router";
import { getCurrentUser } from "vuefire";
import { verifiedIfPassword } from "@/plugins/verify-user";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// Redirect to login page if the user is not logged in or their email is not verified
router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;
  const tenantId = (to.params as any)["tenantId"];


  if(!tenantId) {
    return {
      path: "/free/"
    }
  }
  if (
    (!isLoggedIn || verifiedIfPassword(currentUser)) &&
    to.path !== `/${tenantId}/profile`
  ) {
      return {
        path: `${tenantId}/profile`,
        query: {
          // Store the intended path to redirect after successful login and verification
          redirect: to.fullPath,
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
      location.assign(to.fullPath);
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
