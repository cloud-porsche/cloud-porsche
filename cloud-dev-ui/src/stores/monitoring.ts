import { get } from "@/http/http";
import { defineStore } from "pinia";

export const timeframe = localStorage.getItem("timeframe") ?? "weekly";

interface MonitoringStoreState {
  free_data: any,
  data: any;
  timeframe: string;
  loading: boolean;
  error: any;
}

export const useMonitoringStore = defineStore("monitoring", {
  state: (): MonitoringStoreState => ({
    free_data: {
      left_free_api_calls: Infinity,
      customer_count_change: {
        current_period_customers: 0,
        percent_change: 0,
      },
    },
    data: {
      customers: {},
      customer_distribution: {},
      avg_utilization: {},
      api_calls: {
        current_period_api_calls: 0,
        percent_change: 0,
      },
      parking_income: {
        current_period_income: 0,
        percent_change: 0,
      },
      defect_distribution: {},
    },
    timeframe: timeframe,
    loading: false,
    error: null as any,
  }),
  actions: {
    async fetchFreeMonitoringData() {
      this.$state.loading = true;
      try {
        const res = await (
          await get(
            `/v1/monitoring/free_data?timeframe=${this.$state.timeframe}`,
            undefined,
            "monitoringManagement",
          )
        ).json();
        this.$state.free_data = res.data;
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
    async fetchMonitoringData() {
      this.$state.loading = true;
      try {
        const res = await (
          await get(
            `/v1/monitoring/data?timeframe=${this.$state.timeframe}`,
            undefined,
            "monitoringManagement",
          )
        ).json();
        this.$state.data = res.data;
      } catch (error) {
        this.$state.loading = false;
        this.$state.error = error;
      } finally {
        this.$state.loading = false;
        this.$state.error = null;
      }
    },
    setTimeframe(timeframe: string) {
      this.$state.timeframe = timeframe;
      localStorage.setItem("timeframe", timeframe);
    },
  },
});
