<template>
  <v-container>
    <!-- Timeframe Selection Dropdown -->
    <v-row>
      <v-col>
        <v-select
          v-model="selectedTimeframe"
          :items="timeframeOptions"
          label="Select Timeframe"
          @update:model-value="fetchData()"
        ></v-select>
      </v-col>
    </v-row>

    {{ selectedTimeframe }}
    <!-- Chart Container -->
    <v-row>
      <v-col>
        <apexchart
          type="line"
          height="300"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { get } from "@/http/http";
import { useAppStore } from "@/stores/app";

// Data and Store
const selectedTimeframe = ref("yearly");
const timeframeOptions = ["total", "yearly", "monthly", "weekly"];
const sparklineData = ref<number[]>([]);
const categories = ref<string[]>([]);
const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

// Chart Options (Reactive)
const chartOptions = ref({
  chart: {
    id: "customer-chart",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  theme: {
    mode: isDark.value ? "dark" : "light",
  },
  xaxis: {
    categories: categories.value,
    title: { text: "Timeframe" },
    labels: {
      show: true,
    },
  },
  yaxis: {
    title: { text: "Number of Customers" },
    labels: {
      formatter: (value: number) => Math.round(value),
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  grid: { show: true },
});

// Chart Series Data
const chartSeries = ref([
  {
    name: "Customers",
    data: sparklineData.value,
  },
]);

// Watch for Theme Changes
watch(isDark, (newVal) => {
  chartOptions.value = {
    ...chartOptions.value,
    theme: { mode: newVal ? "dark" : "light" }, // Update the theme
  };
});

// Fetch Data Function
function fetchData() {
  console.log("test");
  try {
    get(
      "http://localhost:8083/v1/monitoring/customers?timeframe=" +
        selectedTimeframe.value
    ).then(async (response) => {
      const data = await response.json();
      processData(data.data);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Process API Data
function processData(data: Record<string, any>) {
  categories.value = Object.keys(data);
  sparklineData.value = Object.values(data);

  // Update Chart Series
  chartSeries.value = [
    {
      name: "Customers",
      data: sparklineData.value,
    },
  ];

  // Update Chart Options
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, categories: categories.value },
  };

  console.log("Processed Data:", chartSeries.value);
}

// Fetch Data on Mount
onMounted(() => {
  fetchData();
});
</script>
