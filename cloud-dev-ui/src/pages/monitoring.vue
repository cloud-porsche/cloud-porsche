<template>
  <div>
    <!-- Filter Chips Section -->
    <!-- <v-chip-group selected-class="text-primary">
      <v-chip
        v-for="filter in filters"
        :key="filter"
        @click="onFilterClick(filter)"
      >
        {{ filter }}
      </v-chip>
    </v-chip-group> -->

    <!-- Dashboard Container -->
    <div
      id="dashboard_container"
      class="highcharts-light"
      style="height: 100%"
    ></div>
  </div>
</template>

<script setup lang="ts">
import * as Dashboards from "@highcharts/dashboards";
import Highcharts from "highcharts";
import { ref, onMounted, computed, watch } from "vue";
import { get } from "@/http/http";
import { useAppStore } from "@/stores/app";

// Highcharts Configuration
Highcharts.setOptions({
  chart: {
    styledMode: true,
  },
});

// Reactive Variables
const categories = ref<string[]>([]); // For the x-axis (timeframe)
const lineChartData = ref<number[]>([]); // For the line chart (customers)
const pieChartData = ref<number[]>([0, 0, 0, 0]); // Mock initial pie chart data
const pieChartLabels = ref<string[]>([]); // Labels for Pie Chart
const totalCustomers = ref(0); // Total Customers
const apiCalls = ref(0);

// App Store for Theme
const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

// Filter Options
const filters = ref(["weekly", "monthly", "yearly", "total"]);
const selectedFilter = ref("weekly");

// Fetch Data Function
async function fetchData(timeframe: string) {
  try {
    const response = await get(
      `http://localhost:8083/v1/monitoring/data?timeframe=${timeframe}`
    );
    const data = await response.json();
    processData(data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Process API Data
function processData(data: Record<string, any>) {
  categories.value = Object.keys(data.customers);
  lineChartData.value = Object.values(data.customers);
  pieChartData.value = Object.values(data.customer_distribution);
  pieChartLabels.value = Object.keys(data.customer_distribution);
  totalCustomers.value = data.total_customers;
  apiCalls.value = data.api_calls;
}

// Initialize Dashboard
async function initDashBoard() {
  Dashboards.board("dashboard_container", {
    editMode: {
      enabled: true,
      contextMenu: {
        enabled: true,
      },
    },
    gui: {
      layouts: [
        {
          id: "layout-1",
          rows: [
            {
              cells: [
                {
                  id: "dashboard-col-0",
                  layout: {
                    rows: [
                      { cells: [{ id: "dashboard-col-0-row-1" }] },
                      {
                        cells: [
                          {
                            id: "dashboard-col-0-row-2A",
                          },
                          {
                            id: "dashboard-col-0-row-2B",
                            layout: {
                              rows: [
                                {
                                  cells: [
                                    { id: "dashboard-col-0-row-2B-1" },
                                    { id: "dashboard-col-0-row-2B-2" },
                                  ],
                                },
                                {
                                  cells: [
                                    { id: "dashboard-col-0-row-2B-2A" },
                                    { id: "dashboard-col-0-row-2B-2B" },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      enabled: true,
    },
    components: [
      {
        renderTo: "dashboard-col-0-row-2B-1",
        type: "KPI",
        title: "Total API Calls",
        value: apiCalls.value,
      },
      {
        renderTo: "dashboard-col-0-row-2B-2",
        type: "KPI",
        title: "All Time Customers",
        value: "MOCK",
      },
      {
        renderTo: "dashboard-col-0-row-2B-2A",
        type: "HTML",
        title: "All Time Customers",
        elements: [
          {
            tagName: "h1",
            style: {
              "text-align": "center",
            },
            textContent: totalCustomers.value.toString(),
          },
        ],
      },
      {
        type: "HTML",
        renderTo: "dashboard-col-0-row-2B-2B",
        html: `<p>Total Customers: ${totalCustomers.value}</p>`,
      },

      {
        renderTo: "dashboard-col-0-row-1",
        type: "Highcharts",
        chartOptions: {
          colors: ["#7cb5ec"],
          chart: {
            type: "line",
          },
          title: {
            text: "Customer Trends",
          },
          xAxis: {
            categories: categories.value,
            title: { text: "Timeframe" },
          },
          yAxis: {
            title: { text: "Number of Customers" },
          },
          series: [
            {
              type: "line",
              name: "Customers",
              data: lineChartData.value,
            },
          ],
        },
      },
      {
        renderTo: "dashboard-col-0-row-2A",
        type: "Highcharts",
        chartOptions: {
          chart: {
            type: "pie",
          },
          title: {
            text: "Customer Distribution",
          },
          series: [
            {
              type: "pie",
              name: "Customers",
              data: pieChartLabels.value.map((label, index) => ({
                name: label,
                y: pieChartData.value[index],
              })),
            },
          ],
        },
      },
    ],
  });
}

// Watch for Theme Changes
watch(isDark, (newVal) => {
  setTheme(newVal);
});

function setTheme(isDark?: boolean) {
  const theme = isDark ? "dark" : "light";
  document.getElementById(
    "dashboard_container"
  )!.className = `highcharts-${theme}`;
}

// Handle Filter Click to Fetch Data and Update Dashboard
function onFilterClick(filter: string) {
  selectedFilter.value = filter;
  fetchData(filter).then(() => {
    // After data fetch, reinitialize the dashboard with new data
    initDashBoard();
  });
}

// Fetch Data and Initialize Dashboard on Mount
onMounted(async () => {
  await fetchData(selectedFilter.value); // Default timeframe
  await initDashBoard();
  setTheme(isDark.value);
});
</script>

<style>
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
@import url("https://code.highcharts.com/css/highcharts.css");
</style>
