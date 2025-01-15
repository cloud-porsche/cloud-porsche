<template>
  <div>
    <v-toolbar density="comfortable" class="d-flex align-center pa-1 pl-8 pr-4">
      <h1 class="text-h5 bold">Management Dashboard</h1>
      <v-spacer></v-spacer>
      <v-select
        max-width="200"
        density="comfortable"
        hide-details
        v-model="selectedFilter"
        :items="filters"
        label="Select Timeframe"
        item-title="label"
        @update:model-value="onFilterChange"
      />
    </v-toolbar>
    <v-progress-linear
      :indeterminate="monitoringStore.loading"
      :color="error ? 'error' : undefined"
    ></v-progress-linear>

    <!-- Dashboard Container -->
    <v-responsive v-show="!appStore.authLoading">
      <div id="dashboard_free"></div>
      <ProTier>
        <div id="dashboard_container" style="min-height: 100%;"></div>
      </ProTier>
    </v-responsive>
  </div>
</template>

<script setup lang="ts">
import * as Dashboards from "@highcharts/dashboards";
import Highcharts from "highcharts";
import { computed, ref, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useMonitoringStore } from "@/stores/monitoring";
import { DefectState } from "@cloud-porsche/types";
import router from "@/router";

// Highcharts Configuration
Highcharts.setOptions({
  chart: { styledMode: true },
});

// App Store for Theme
const appStore = useAppStore();
const monitoringStore = useMonitoringStore();
const isDark = computed(() => appStore.isDark);

// Filter Options
const filters = [
  { value: "weekly", label: "Last week" },
  { value: "monthly", label: "Last month" },
  { value: "yearly", label: "Last year" },
  { value: "total", label: "Total" },
];
const selectedFilter = ref(monitoringStore.timeframe);
const error = ref(false);

// Create Custom HTML for Cards
function createCardHTML(
  title: string,
  value: number,
  percentChange: number,
  showChange = true,
) {
  let color = percentChange >= 0 ? "green" : "red";
  if (!showChange) {
    color = "transparent";
  }

  const formatNumber = (num: number) => {
    return num.toFixed(0);
  };

  const changeText =
    percentChange >= 0
      ? `+${formatNumber(percentChange)}%`
      : `${formatNumber(percentChange)}%`;

  return `
    <div class="custom_card">
      <div class="custom_card-header">${title}</div>
      <span class="custom_card-value">${formatNumber(value)}</span>
      <span class="custom_card-subtext" style="color: ${color};">
        ${changeText} vs ${
          filters.find((f) => f.value === selectedFilter.value)?.label || "N/A"
        }
      </span>
    </div>
  `;
}

// Initialize Dashboard
async function initDashBoard() {
  Dashboards.board("dashboard_free", {
    gui: {
      layouts: [
        {
          rows: [
            {
            cells: [
              { id: "row-1", 
                layout: {
                  rows: [
                    {
                      cells: [
                        {id: "card-api-calls-free"},
                        {id: "card-customers-free"}
                      ]
                    }
                  ]
                }
              }
            ]
            }
          ]
        }
      ]
    },
    components: [
      {
        type: "HTML",
        renderTo: "card-api-calls-free",
        html: createCardHTML(
          "Free API Calls left this month",
          monitoringStore.free_data.left_free_api_calls,
          0,
          false,
        )
      },
      {
        type: "HTML",
        renderTo: "card-customers-free",
        html: createCardHTML(
          "Customers",
          monitoringStore.free_data.customer_count_change.current_period_customers,
          monitoringStore.free_data.customer_count_change.percent_change
        )
      }
    ]
  });
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
                                    // { id: "card-customers" },
                                  ],
                                },
                                {
                                  id: "row-1-1B",
                                  cells: [
                                    { id: "card-income" },
                                    // { id: "card-free-api-calls" },
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
          monitoringStore.data.api_calls.current_period_api_calls,
          monitoringStore.data.api_calls.percent_change,
        ),
      },
      // {
      //   type: "HTML",
      //   renderTo: "card-customers",
      //   html: createCardHTML(
      //     "Customers",
      //     monitoringStore.data.customer_count_change.current_period_customers,
      //     monitoringStore.data.customer_count_change.percent_change,
      //   ),
      // },
      {
        type: "HTML",
        renderTo: "card-income",
        html: createCardHTML(
          "Income",
          monitoringStore.data.parking_income.current_period_income,
          monitoringStore.data.parking_income.percent_change,
        ),
      },
      // {
      //   type: "HTML",
      //   renderTo: "card-free-api-calls",
      //   html: createCardHTML(
      //     "Free API Calls this month",
      //     monitoringStore.data.left_free_api_calls,
      //     0,
      //     false,
      //   ),
      // },
      {
        type: "Highcharts",
        renderTo: "chart-line",
        chartOptions: {
          chart: { type: "line" },
          title: { text: "Customer Trends" },
          xAxis: {
            categories: Object.keys(monitoringStore.data.customers),
            title: { text: "Timeframe" },
          },
          yAxis: { title: { text: "Number of Customers" } },
          series: [
            {
              type: "line",
              name: "Customers",
              data: Object.values(monitoringStore.data.customers),
            },
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
              data: Object.keys(monitoringStore.data.customer_distribution).map(
                (label, index) => ({
                  name: label,
                  y: Number(
                    Object.values(monitoringStore.data.customer_distribution)[
                      index
                    ],
                  ),
                }),
              ),
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
              Object.keys(monitoringStore.data.avg_utilization).length > 0
                ? Object.keys(
                    monitoringStore.data.avg_utilization[
                      Object.keys(monitoringStore.data.avg_utilization)[0]
                    ],
                  )
                : Object.keys(monitoringStore.data.customers),
            title: { text: "Date" },
          },
          yAxis: { title: { text: "Utilization in %" } },
          series: Object.keys(monitoringStore.data.avg_utilization).map(
            (key) => ({
              type: "line",
              name: key,
              data: Object.values(monitoringStore.data.avg_utilization[key]),
            }),
          ),
        },
      },
      {
        type: "Highcharts",
        renderTo: "row-2B",
        chartOptions: {
          chart: { type: "column" }, // Vertical bars
          title: { text: "Defect Distribution" },
          xAxis: {
            categories: Object.keys(monitoringStore.data.defect_distribution), // Property names as categories
            title: { text: "Properties" },
          },
          yAxis: {
            min: 0,
            title: { text: "Count" },
            stackLabels: {
              enabled: true,
              style: { fontWeight: "bold", color: "gray" },
            },
          },
          legend: {
            align: "right",
            x: -30,
            verticalAlign: "top",
            y: 25,
            floating: true,
            borderColor: "#CCC",
            borderWidth: 1,
            shadow: false,
          },
          plotOptions: {
            column: {
              stacking: "normal", // Enable stacking
            },
          },
          series: Object.values(DefectState)
            .filter((value) => typeof value === "number")
            .map((key) => ({
              type: "column",
              name: DefectState[key],
              data: Object.keys(monitoringStore.data.defect_distribution).map(
                (property) =>
                  monitoringStore.data.defect_distribution[property][key],
              ),
            })),
        },
      },
    ],
  });
}

async function onFilterChange() {
  monitoringStore.setTimeframe(selectedFilter.value);
  await monitoringStore.fetchAllData();
}

onMounted(async () => {
  watch(
    () => monitoringStore.loading,
    async () => {
      if (
        !monitoringStore.loading &&
        router.currentRoute.value.name === "/[tenantId]/"
      ) {
        try {
          await initDashBoard();
        } catch (e) {
          console.error(e);
        }
      }
    },
  );

  watch(isDark, (newVal) => {
    document.getElementById("dashboard_container")!.className = `highcharts-${
      newVal ? "dark" : "light"
    }`;
  });
  await monitoringStore.fetchAllData();
});
</script>

<style>
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/css/highcharts.css");

.highcharts-dashboards-cell > .highcharts-dashboards-component {
  border-radius: 4px;
}

.highcharts-dashboards-wrapper {
  background-color: transparent;
  padding: 0;
  min-height: 0;
}

#card-customers,
#card-api-calls,
#card-income,
#card-expenses {
  height: 225px;
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
</style>
