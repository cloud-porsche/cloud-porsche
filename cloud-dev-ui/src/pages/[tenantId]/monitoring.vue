<template>
  <div>
    <!-- Header Section -->
    <div :class="['header', isDark ? 'dark-mode' : 'light-mode']">
      <div class="header-container">
        <h1 class="dashboard-title">Cloud Porsche Management Dashboard</h1>
        <div class="filter-select">
          <v-select
            v-model="selectedFilter"
            :items="filters"
            label="Select Timeframe"
            item-title="label"
            @update:model-value="onFilterChange"
          />
        </div>
      </div>
    </div>

    <!-- Dashboard Container -->
    <div id="dashboard_container"></div>
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
  chart: { styledMode: true },
});

// Reactive Variables
const categories = ref<string[]>([]);
const lineChartData = ref<number[]>([]);
const pieChartData = ref<number[]>([0, 0, 0, 0]);
const pieChartLabels = ref<string[]>([]);
const avgUtilizationData = ref<any>({});
const stats = ref({
  customers: { value: 0, percentChange: 0 },
  apiCalls: { value: 0, percentChange: 0 },
  parkingIncome: { value: 0, percentChange: 0 },
});

// App Store for Theme
const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

// Filter Options
const filters = [
  { value: "weekly", label: "last week" },
  { value: "monthly", label: "last month" },
  { value: "yearly", label: "last year" },
  { value: "total", label: "total" },
];
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
  avgUtilizationData.value = data.avg_utilization;
  stats.value = {
    customers: {
      value: data.customer_count_change.current_period_customers,
      percentChange: data.customer_count_change.percent_change,
    },
    apiCalls: {
      value: data.api_calls.current_period_api_calls,
      percentChange: data.api_calls.percent_change,
    },
    parkingIncome: {
      value: data.parking_income.current_period_income,
      percentChange: data.parking_income.percent_change,
    },
  };
}

// Create Custom HTML for Cards
function createCardHTML(title: string, value: number, percentChange: number) {
  const color = percentChange >= 0 ? "green" : "red";
  const changeText =
    percentChange >= 0
      ? `+${percentChange.toFixed(2)}%`
      : `${percentChange.toFixed(2)}%`;

  return `
    <div class="custom_card">
      <div class="custom_card-header">${title}</div>
      <span class="custom_card-value">${
        value >= 1 ? value.toFixed(0) : value.toFixed(2)
      }</span>
      <span class="custom_card-subtext" style="color: ${color};">
        ${changeText} vs ${
    filters.find((f) => f.value === selectedFilter.value)?.label
  }
      </span>
    </div>
  `;
}

// Initialize Dashboard
async function initDashBoard() {
  Dashboards.board("dashboard_container", {
    gui: {
      layouts: [
        {
          rows: [
            {
              cells: [
                {
                  id: "row-1",
                  layout: {
                    rows: [
                      {
                        cells: [
                          {
                            id: "x",
                            layout: {
                              rows: [
                                {
                                  id: "row-1-1A",
                                  cells: [
                                    { id: "card-api-calls" },
                                    { id: "card-customers" },
                                  ],
                                },
                                {
                                  id: "row-1-1B",
                                  cells: [
                                    { id: "card-income" },
                                    { id: "card-expenses" },
                                  ],
                                },
                              ],
                            },
                          },
                          { id: "chart-pie" },
                          { id: "chart-line" },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "row-2",
              cells: [
                {
                  id: "row-2A",
                },
                {
                  id: "row-2B",
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
        renderTo: "card-api-calls",
        html: createCardHTML(
          "API Calls",
          stats.value.apiCalls.value,
          stats.value.apiCalls.percentChange
        ),
      },
      {
        type: "HTML",
        renderTo: "card-customers",
        html: createCardHTML(
          "Customers",
          stats.value.customers.value,
          stats.value.customers.percentChange
        ),
      },
      {
        type: "HTML",
        renderTo: "card-income",
        html: createCardHTML(
          "Income",
          stats.value.parkingIncome.value,
          stats.value.parkingIncome.percentChange
        ),
      },
      {
        type: "HTML",
        renderTo: "card-expenses",
        html: createCardHTML("Expenses", 1000, -20),
      },
      {
        type: "Highcharts",
        renderTo: "chart-line",
        chartOptions: {
          chart: { type: "line" },
          title: { text: "Customer Trends" },
          xAxis: { categories: categories.value, title: { text: "Timeframe" } },
          yAxis: { title: { text: "Number of Customers" } },
          series: [
            { type: "line", name: "Customers", data: lineChartData.value },
          ],
        },
      },
      {
        type: "Highcharts",
        renderTo: "chart-pie",
        chartOptions: {
          chart: { type: "pie" },
          title: { text: "Customer Distribution" },
          plotOptions: {
            pie: {
              innerSize: "50%",
            },
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
      {
        type: "Highcharts",
        renderTo: "row-2A",
        chartOptions: {
          chart: { type: "line" },
          title: { text: "Average Daily Utilization" },
          xAxis: {
            categories:
              Object.keys(avgUtilizationData).length > 0
                ? Object.keys(
                    avgUtilizationData.value[
                      Object.keys(avgUtilizationData.value)[0]
                    ]
                  )
                : [],
            title: { text: "Date" },
          },
          yAxis: { title: { text: "Utilization in %" } },
          series: Object.keys(avgUtilizationData.value).map((key) => ({
            type: "line",
            name: key,
            data: Object.values(avgUtilizationData.value[key]),
          })),
        },
      },
      {
        type: "Highcharts",
        renderTo: "row-2B",
        chartOptions: {
          chart: { type: "line" },
          title: { text: "MOCK" },
          xAxis: {
            categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            title: { text: "Date" },
          },
          yAxis: { title: { text: "MOCK" } },
          series: [
            {
              type: "line",
              name: "MOCK",
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
          ],
        },
      },
    ],
  });
}

// Watch for Theme Changes
watch(isDark, (newVal) => {
  document.getElementById("dashboard_container")!.className = `highcharts-${
    newVal ? "dark" : "light"
  }`;
});

// Handle Filter Change
function onFilterChange() {
  fetchData(selectedFilter.value).then(initDashBoard);
}

// Fetch Data and Initialize Dashboard on Mount
onMounted(async () => {
  await fetchData(selectedFilter.value);
  initDashBoard();
  document.getElementById("dashboard_container")!.className = `highcharts-${
    isDark.value ? "dark" : "light"
  }`;
});
</script>

<style>
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/css/highcharts.css");

.highcharts-dashboards-wrapper {
  background-color: transparent;
  padding-top: 0;
  height: 100%;
}

#card-customers,
#card-api-calls,
#card-income,
#card-expenses {
  height: 220px;
}

#row-2A,
#row-2B {
  height: 300px;
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
  font-size: clamp(20px, 5vw, 50px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.custom_card-subtext {
  font-size: 14px;
}

.header {
  margin: 8px 20px 0px 20px;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 75px;
}

.header.light-mode {
  background-color: #ffffff;
}

.header.dark-mode {
  background-color: #2b2b2b;
}

.header-container {
  display: flex;
  justify-content: space-between;
  padding: 8px 8px 8px 8px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
}

.filter-select {
  width: 30%;
  min-width: 200px;
}
</style>
