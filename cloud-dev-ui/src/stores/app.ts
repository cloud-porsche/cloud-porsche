// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: {
      dark: initDark(),
    },
    api: {
      propertyManagement: localStorage.getItem("propertyManagement"),
    },
  }),
  getters: {
    isDark(state) {
      return state.theme.dark;
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
  },
});

function initDark() {
  const localTheme = localStorage.getItem("dark");
  return localTheme !== null
    ? localTheme === "true"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
