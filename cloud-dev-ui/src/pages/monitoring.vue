<template>
  <div
    id="dashboard_container"
    class="highcharts-light"
    style="height: 100%"
  ></div>
</template>

<script setup lang="ts">
import * as Dashboards from "@highcharts/dashboards";
import Highcharts from "highcharts";
import { ref, onMounted, computed, watch } from "vue";
import { get } from "@/http/http";
import { useAppStore } from "@/stores/app";

Highcharts.setOptions({
  chart: {
    styledMode: true,
  },
});

// Reactive Variables
const categories = ref<string[]>([]); // For the x-axis (timeframe)
const lineChartData = ref<number[]>([]); // For the line chart (customers)
const pieChartData = ref<number[]>([0, 0, 0, 0]); // Mock initial pie chart data

// Labels for Pie Chart
const pieChartLabels = [
  "New Customers",
  "Returning Customers",
  "Active Customers",
  "Inactive Customers",
];

// App Store for Theme
const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

// Fetch Data Function
async function fetchData(timeframe: string) {
  try {
    const response = await get(
      `http://localhost:8083/v1/monitoring/customers?timeframe=${timeframe}`
    );
    const data = await response.json();
    processData(data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Process API Data
function processData(data: Record<string, any>) {
  categories.value = Object.keys(data);
  lineChartData.value = Object.values(data);

  // Example mock data for pie chart (modify based on API response if needed)
  pieChartData.value = [45, 25, 15, 15];
  console.log(lineChartData);
}

// Initialize Dashboard
async function initDashBoard() {
  Dashboards.board("dashboard_container", {
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
                                { cells: [{ id: "dashboard-col-0-row-2B-1" }] },
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
        type: "HTML",
        renderTo: "dashboard-col-0-row-2B-1",
        elements: [
          {
            tagName: "p",
            style: {
              "text-align": "center",
            },
            textContent: "dashboard-col-0-row-2B-1",
          },
        ],
      },
      {
        renderTo: "dashboard-col-0-row-2B-2A",
        type: "HTML",
        title: "test",
        elements: [
          {
            tagName: "p",
            style: {
              "text-align": "center",
            },
            textContent: "dashboard-col-0-row-2B-2A",
          },
        ],
      },
      {
        type: "HTML",
        renderTo: "dashboard-col-0-row-2B-2B",
        elements: [
          {
            tagName: "p",
            style: {
              "text-align": "center",
            },
            textContent: "dashboard-col-0-row-2B-2B",
          },
        ],
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
              data: pieChartLabels.map((label, index) => ({
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
  const theme = newVal ? "dark" : "light";
  document.getElementById(
    "dashboard_container"
  )!.className = `highcharts-${theme}`;
});

// Fetch Data and Initialize Dashboard on Mount
onMounted(async () => {
  await fetchData("monthly"); // Default timeframe
  initDashBoard();
});
</script>

<style>
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
@import url("https://code.highcharts.com/css/highcharts.css");
</style>
