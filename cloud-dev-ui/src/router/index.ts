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

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// redirect to login page if the user is not logged in
router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser();
  // if the user is not logged in, redirect to the login page
  if (!currentUser && to.path !== "/profile") {
    return {
      path: "/profile",
      query: {
        // we keep the current path in the query so we can
        // redirect to it after login with
        // `router.push(route.query.redirect || '/')`
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
