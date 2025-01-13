// Utilities
import { ITenant, TenantTier } from "@cloud-porsche/types";
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

export const monitoringManagementUrl =
  localStorage.getItem("monitoringManagement") ??
  import.meta.env.VITE_MONITORING_MANAGEMENT_API_URL ??
  "";

export const tenantManagementUrl =
  localStorage.getItem("tenantManagement") ??
  import.meta.env.VITE_TENANT_MANAGEMENT_API_URL ??
  "";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      theme: {
        dark: initDark(),
      },
      api: {
        propertyManagement: propertyManagementUrl,
        parkingManagement: parkingManagementUrl,
        monitoringManagement: monitoringManagementUrl,
        tenantManagement: tenantManagementUrl,
        ws: {
          socket: {} as Socket,
          connected: false,
        },
      },
      auth: {
        loading: true,
      },
      tenant: {
        info: null as null | ITenant,
      },
      currUser: {
        role: "",
        uid: "",
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
    hasAdminAccess(state) {
      return (
        state.tenant.info?.tier === TenantTier.FREE ||
        state.currUser.role === "admin"
      );
    },
    isUserRole(state) {
      return (
        state.tenant.info?.tier !== TenantTier.FREE &&
        state.currUser.role === "user"
      );
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
    changeParkingManagementApiURL(url: string) {
      this.api.parkingManagement = url;
      localStorage.setItem("parkingManagement", url);
    },
    changeMonitoringManagementApiURL(url: string) {
      this.api.monitoringManagement = url;
      localStorage.setItem("monitoringManagement", url);
    },
    setAuthLoading(loading: boolean) {
      this.auth.loading = loading;
    },
    setTenantInfo(info: ITenant) {
      if (import.meta.env.PROD) {
        this.changePropertyManagementApiURL(
          `https://${info.ip}/property-management`,
        );
        this.changeParkingManagementApiURL(
          `https://${info.ip}/parking-management`,
        );
        this.changeMonitoringManagementApiURL(
          `https://${info.ip}/monitoring-management`,
        );
      }
      this.tenant.info = info;
    },
    setCurrUserRole(role: string) {
      this.currUser.role = role;
    },
    setCurrUid(uid: string) {
      this.currUser.uid = uid;
    },
    removeCurrUserRole() {
      this.currUser.role = "";
    },
  },
});

function initDark() {
  const localTheme = localStorage.getItem("dark");
  return localTheme !== null
    ? localTheme === "true"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
