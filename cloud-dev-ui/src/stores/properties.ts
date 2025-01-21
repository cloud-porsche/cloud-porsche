// Utilities
import { defineStore } from "pinia";
import {
  IParkingProperty,
  ParkingSpot,
  SimulationState,
} from "@cloud-porsche/types";
import { del, get, patchJSON, post, postJSON } from "@/http/http";

interface PropertyStoreState {
  properties: IParkingProperty[];
  loading: boolean;
  error: any;
}

export const usePropertyStore = defineStore("properties", {
  state: (): PropertyStoreState => ({
    properties: [],
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
    async updateProperty(
      propertyId: string,
      property: Partial<IParkingProperty>,
    ) {
      this.$state.loading = true;
      try {
        await patchJSON(`/v1/parking-properties/${propertyId}`, property);
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
        await this.fetchProperty(propertyId);
      }
    },
    async updateParkingSpot(
      propertyId: string,
      spotId: string,
      spot: Partial<ParkingSpot>,
    ) {
      this.$state.loading = true;
      try {
        await patchJSON(`/v1/parking-properties/${propertyId}/${spotId}`, spot);
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
        await this.fetchProperty(propertyId);
      }
    },
    async setSimulationActive(propertyId: string, speed: string) {
      this.$state.loading = true;
      try {
        await postJSON(
          `/v1/simulation/${propertyId}/start`,
          { speed: speed },
          undefined,
          "parkingManagement",
        );
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
    async updateSimulationSpeed(propertyId: string, state: SimulationState) {
      const currentState = this.$state.properties.find(
        (p) => p.id === propertyId,
      )?.simulationState;
      if (
        !currentState ||
        currentState === SimulationState.OFF ||
        state === currentState ||
        state === SimulationState.OFF
      )
        return;
      this.$state.loading = true;
      try {
        await postJSON(
          `/v1/simulation/${propertyId}/update-speed`,
          { speed: state },
          undefined,
          "parkingManagement",
        );
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
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
      }
    },
  },
});
