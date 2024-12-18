<template>
  <v-container>
    <!-- Grid Layout for Cards -->
    <v-row>
      <!-- Revenue Card -->
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>Revenue</v-card-title>
          <v-card-text>
            <div class="text-h4">$123,456</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- All Time Customers Card -->
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>All Time Customers</v-card-title>
          <v-card-text>
            <div class="text-h4">1,234</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Another Card (Example) -->
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>Mock Information</v-card-title>
          <v-card-text>
            <div class="text-h4">Example Data</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Another Card (Example) -->
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>Mock Information</v-card-title>
          <v-card-text>
            <div class="text-h4">Example Data</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
    <v-row>
      <!-- Customer Line Chart -->
      <v-col cols="12" sm="6" md="6">
        <v-card>
          <v-card-title>Customer Chart</v-card-title>
          <v-card-text>
            <apexchart
              type="line"
              height="300"
              :options="chartOptions"
              :series="chartSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Mock Pie Chart -->
      <v-col cols="12" sm="6" md="6">
        <v-card>
          <v-card-title>Customer Distribution (Mock Pie)</v-card-title>
          <v-card-text>
            <apexchart
              type="pie"
              height="300"
              :options="pieChartOptions"
              :series="pieChartSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
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

// Chart Options (Reactive for Line Chart)
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

// Line Chart Series Data
const chartSeries = ref([
  {
    name: "Customers",
    data: sparklineData.value,
  },
]);

// Pie Chart Options (Reactive)
const pieChartOptions = ref({
  chart: {
    id: "customer-pie-chart",
    toolbar: { show: false },
  },
  theme: {
    mode: isDark.value ? "dark" : "light",
  },
  labels: [
    "New Customers",
    "Returning Customers",
    "Active Customers",
    "Inactive Customers",
  ],
});

// Pie Chart Series Data (Mock Data)
const pieChartSeries = ref([45, 25, 15, 15]); // Mock distribution of customers

// Watch for Theme Changes
watch(isDark, (newVal) => {
  chartOptions.value = {
    ...chartOptions.value,
    theme: { mode: newVal ? "dark" : "light" }, // Update the theme for the line chart
  };
  pieChartOptions.value = {
    ...pieChartOptions.value,
    theme: { mode: newVal ? "dark" : "light" }, // Update the theme for the pie chart
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

  // Update Line Chart Series
  chartSeries.value = [
    {
      name: "Customers",
      data: sparklineData.value,
    },
  ];

  // Update Line Chart Options
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
