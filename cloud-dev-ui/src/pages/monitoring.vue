<template>
  <v-container>
    <!-- Timeframe Selection Dropdown -->
    <v-row>
      <v-col>
        <v-select
          v-model="selectedTimeframe"
          :items="timeframeOptions"
          label="Select Timeframe"
          @change="fetchData"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col style="border: 1px solid #e0e0e0; border-radius: 4px">
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
import { ref, onMounted } from "vue";
import { get } from "@/http/http";

// Register ApexCharts globally
const selectedTimeframe = ref("monthly");
const timeframeOptions = ["total", "yearly", "monthly", "weekly"];
const sparklineData = ref<number[]>([]);
const categories = ref<string[]>([]);

// Chart configuration
const chartOptions = ref({
  chart: {
    id: "customer-chart",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  xaxis: {
    categories: categories.value, // Dynamic X-axis labels
    title: { text: "Timeframe" },
  },
  yaxis: {
    title: { text: "Number of Customers" },
    labels: {
      formatter: (value: number) => Math.round(value), // Format Y labels
    },
  },
  stroke: {
    curve: "smooth", // Smooth line appearance
    width: 2,
  },
  colors: ["#3F51B5"], // Line color
  grid: { show: true },
});

// Chart series data
const chartSeries = ref([
  {
    name: "Customers",
    data: sparklineData.value,
  },
]);

// Fetch data from API
async function fetchData() {
  try {
    const response = await get(
      "http://localhost:8083/v1/monitoring/customers?timeframe=" +
        selectedTimeframe.value
    );
    const data = await response.json();
    processData(data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function processData(data: Record<string, any>) {
  categories.value = Object.keys(data); // X-axis labels
  sparklineData.value = Object.values(data); // Y-axis data

  // Update the chart series
  chartSeries.value = [
    {
      name: "Customers",
      data: sparklineData.value,
    },
  ];

  // Update chartOptions dynamically
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, categories: categories.value },
  };

  console.log("Processed Data:", chartSeries.value);
}
onMounted(() => {
  fetchData();
});
</script>
