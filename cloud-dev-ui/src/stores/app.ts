// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: {
      dark: initDark(),
    },
    api: {
      propertyManagement:
        localStorage.getItem("propertyManagement") ??
        import.meta.env.VITE_PROPERTY_MANAGEMENT_API_URL ??
        "",
    },
    auth: {
      loading: true,
    },
  }),
  getters: {
    isDark(state) {
      return state.theme.dark;
    },
    authLoading(state) {
      return state.auth.loading;
    },
  },
  actions: {
    toggleTheme() {
      this.theme.dark = !this.theme.dark;
      localStorage.setItem("dark", this.theme.dark.toString());
    },
    changePropertyManagementApiURL(url: string) {
      this.api.propertyManagement = url;
      localStorage.setItem("propertyManagement", url);
    },
    setAuthLoading(loading: boolean) {
      this.auth.loading = loading;
    },
  },
});

function initDark() {
  const localTheme = localStorage.getItem("dark");
  return localTheme !== null
    ? localTheme === "true"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
