// Utilities
import { defineStore } from "pinia";
import { IParkingProperty } from "@cloud-porsche/types";
import { del, get, post, postJSON } from "@/http/http";

interface PropertyStoreState {
  properties: IParkingProperty[];
  simulationActive: string[];
  loading: boolean;
  error: any;
}

export const usePropertyStore = defineStore("properties", {
  state: (): PropertyStoreState => ({
    properties: [],
    simulationActive: [],
    loading: true,
    error: null,
  }),
  getters: {
    parkingSpots: (state) => (propertyId: string) => {
      const property = state.properties.find((p) => p.id === propertyId);
      return (
        property?.layers
          .flatMap((layer) => layer.parkingSpots)
          .filter((s) => !s.placeholder) ?? []
      );
    },
  },
  actions: {
    async fetchProperties() {
      this.$state.loading = true;
      try {
        this.$state.properties = await (
          await get("/v1/parking-properties")
        ).json();
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
    async fetchProperty(propertyId: string) {
      this.$state.loading = true;
      try {
        const newProperty = await (
          await get("/v1/parking-properties/" + propertyId)
        ).json();
        this.$state.properties = this.$state.properties.map((property) =>
          property.id === propertyId ? newProperty : property,
        );
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
    setProperties(properties: IParkingProperty[]) {
      this.$state.properties = properties;
    },
    async addProperty(
      property: Omit<IParkingProperty, "id" | "customers" | "parkingSpots">,
    ) {
      this.$state.loading = true;
      try {
        await postJSON("/v1/parking-properties", property);
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
        await this.fetchProperties();
      }
    },
    async deleteProperty(propertyId: string) {
      this.$state.loading = true;
      try {
        await del(`/v1/parking-properties/${propertyId}`);
        this.$state.properties = this.$state.properties.filter(
          (property) => property.id !== propertyId,
        );
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
    async setSimulationActive(propertyId: string) {
      this.$state.loading = true;
      try {
        await post(
          `/v1/simulation/${propertyId}/start`,
          undefined,
          undefined,
          "parkingManagement",
        );
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
        await this.fetchSimulationStatus(propertyId);
      }
    },
    async setSimulationInactive(propertyId: string) {
      this.$state.loading = true;
      try {
        await post(
          `/v1/simulation/${propertyId}/stop`,
          undefined,
          undefined,
          "parkingManagement",
        );
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
        await this.fetchSimulationStatus(propertyId);
      }
    },
    async fetchSimulationStatus(propertyId: string) {
      this.$state.loading = true;
      try {
        const isRunning =
          (await get(
            `/v1/simulation/${propertyId}/status`,
            undefined,
            "parkingManagement",
          ).json()) === "true";
        if (isRunning && !this.$state.simulationActive.includes(propertyId)) {
          this.$state.simulationActive = [
            ...this.$state.simulationActive,
            propertyId,
          ];
        } else if (!isRunning) {
          this.$state.simulationActive = this.$state.simulationActive.filter(
            (id) => id !== propertyId,
          );
        }
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
  },
});
