// Utilities
import { defineStore } from "pinia";
import { IParkingProperty } from "@cloud-porsche/types";
import { get } from "@/http/http";

interface PropertyStoreState {
  properties: IParkingProperty[];
  error: any;
}

export const usePropertyStore = defineStore("properties", {
  state: (): PropertyStoreState => ({
    properties: [],
    error: null,
  }),
  actions: {
    async fetchProperties() {
      try {
        this.$state.properties = await (
          await get("/v1/parking-properties")
        ).json();
      } catch (error) {
        this.$state.error = error;
      } finally {
        this.$state.error = null;
      }
    },
    setProperties(properties: IParkingProperty[]) {
      this.$state.properties = properties;
    },
  },
});
