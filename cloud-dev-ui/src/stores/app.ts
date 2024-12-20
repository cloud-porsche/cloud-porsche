// Utilities
import { defineStore } from "pinia";
import { Socket } from "socket.io-client";

export const propertyManagementUrl =
  localStorage.getItem("propertyManagement") ??
  import.meta.env.VITE_PROPERTY_MANAGEMENT_API_URL ??
  "";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      theme: {
        dark: initDark(),
      },
      api: {
        propertyManagement: propertyManagementUrl,
        ws: {
          socket: {} as Socket,
          connected: false,
        },
      },
      auth: {
        loading: true,
      },
    };
  },
  getters: {
    isDark(state) {
      return state.theme.dark;
    },
    authLoading(state) {
      return state.auth.loading;
    },
    wsStatus(state) {
      return state.api.ws.connected;
    },
  },
  actions: {
    updateWsConnection(socket: Socket) {
      this.api.ws.socket = socket;
      this.api.ws.connected = socket.connected;
    },
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
