// Utilities
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { usePropertyStore } from "@/stores/properties";

export const useAppStore = defineStore("app", {
  state: () => {
    const url =
      localStorage.getItem("propertyManagement") ??
      import.meta.env.VITE_PROPERTY_MANAGEMENT_API_URL ??
      "";

    const socket = io(url);
    socket.on("connect", function () {
      console.log("WS Connected");
    });
    socket.on("disconnect", function () {
      console.log("WS Disconnected");
    });
    socket.on("pong", function () {
      setTimeout(() => {
        socket.emit("ping");
      }, 10000);
    });
    socket.on("parking-properties", function (data) {
      if (data && data.length > 0) usePropertyStore().setProperties(data);
    });
    return {
      theme: {
        dark: initDark(),
      },
      api: {
        propertyManagement: url,
        ws: socket,
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
