// Utilities
import { Firestore } from "firebase/firestore";
import { defineStore } from "pinia";
import { Socket } from "socket.io-client";

export const propertyManagementUrl =
  localStorage.getItem("propertyManagement") ??
  import.meta.env.VITE_PROPERTY_MANAGEMENT_API_URL ??
  "";

export const parkingManagementUrl =
  localStorage.getItem("parkingManagement") ??
  import.meta.env.VITE_PARKING_MANAGEMENT_API_URL ??
  "";

export const tenantId =
  localStorage.getItem("tenantId") ?? null;

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      theme: {
        dark: initDark(),
      },
      api: {
        propertyManagement: propertyManagementUrl,
        parkingManagement: parkingManagementUrl,
        ws: {
          socket: {} as Socket,
          connected: false,
        },
      },
      auth: {
        loading: true,
      },
      firebase: {
        db: {} as Firestore,
      },
      currentUser: {
        tenantId: tenantId,
      }
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
    currentTenantId(state) {
      return state.currentUser.tenantId;
    }
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
    changeParkingManagementApiURL(url: string) {
      this.api.parkingManagement = url;
      localStorage.setItem("parkingManagement", url);
    },
    setAuthLoading(loading: boolean) {
      this.auth.loading = loading;
    },
    setFirestore(firestore: Firestore) {
      this.firebase.db = firestore;
    },
    setTenantId(tenantId: string) {
      this.currentUser.tenantId = tenantId;
      localStorage.setItem("tenantId", tenantId);
    },
    removeTenantId() {
      this.currentUser.tenantId = null;
      localStorage.removeItem("tenantId");
    }
  },
});

function initDark() {
  const localTheme = localStorage.getItem("dark");
  return localTheme !== null
    ? localTheme === "true"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
