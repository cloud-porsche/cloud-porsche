<template>
  <div>
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
          rows: [
            {
              cells: [
                {
                  id: "col-1-row-1",
                  layout: {
                    rows: [
                      {
                        id: "col-1-row-1",
                        cells: [
                          { id: "col-1-row-1A" },
                          { id: "col-1-row-1B" },
                          { id: "col-1-row-1C" },
                          { id: "col-1-row-1D" },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              cells: [
                {
                  id: "col-1-row-2", // Second row with Pie and Line charts
                  layout: {
                    rows: [
                      {
                        cells: [{ id: "col-1-row-2A" }, { id: "col-1-row-2B" }],
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
        renderTo: "col-1-row-1A",
        html: `
              <div class="custom_card">
                <div class="custom_card-header">Total API Calls</div>
                <span class="custom_card-value">${apiCalls.value}</span>
                <span class="custom_card-subtext">+10% vs last Month</span>
            </div>
              `,
      },
      {
        type: "HTML",
        renderTo: "col-1-row-1B",
        html: `
              <div class="custom_card">
                <div class="custom_card-header">Expenses</div>
                <span class="custom_card-value">1000</span>
                <span class="custom_card-subtext" style="color": red>-5% vs last Month</span>
            </div>
              `,
      },
      {
        type: "HTML",
        renderTo: "col-1-row-1C",
        html: `
              <div class="custom_card">
                <div class="custom_card-header">MOCK</div>
                <span class="custom_card-value">696969</span>
                <span class="custom_card-subtext">This is the description</span>
            </div>
              `,
      },
      {
        type: "HTML",
        renderTo: "col-1-row-1D",
        html: `
              <div class="custom_card">
                <div class="custom_card-header">Total Customers</div>
                <span class="custom_card-value">${totalCustomers.value}</span>
                <span class="custom_card-subtext">This is the description</span>
            </div>
              `,
      },
      {
        renderTo: "col-1-row-2C",
        type: "KPI",
        title: "Total Customers",
        value: totalCustomers.value,
      },
      {
        renderTo: "col-1-row-2B",
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
        renderTo: "col-1-row-2A",
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
@import url("https://code.highcharts.com/css/highcharts.css");

#col-1-row-1 {
  height: 250px;
}

.custom_card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  align-items: center;
}

.custom_card-value {
  font-size: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* Ensures it does not exceed the container width */
  display: block;

  /* Dynamically adjust font size for overflow */
  font-size: clamp(20px, 5vw, 50px);
}

.custom_card-subtext {
  font-size: 14px;
  color: green;
}
</style>
