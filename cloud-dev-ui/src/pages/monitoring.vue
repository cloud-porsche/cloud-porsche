<template>
  <v-container>
    <div id="dashboard_container"></div>
  </v-container>
</template>

<script setup lang="ts">
import * as Dashboards from "@highcharts/dashboards";
import LayoutModule from "@highcharts/dashboards/modules/layout";
LayoutModule(Dashboards);
import { onMounted } from "vue";

async function initDashBoard() {
  await nextTick();
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
                },
                {
                  id: "dashboard-col-1",
                },
              ],
            },
          ],
        },
      ],
    },
    components: [
      {
        type: "HTML",
        renderTo: "dashboard-col-0",
        elements: [
          {
            tagName: "h1",
            textContent: "Your first dashboard",
          },
        ],
      },
      {
        renderTo: "dashboard-col-1",
        type: "Highcharts",
        chartOptions: {
          series: [
            {
              type: "line",
              data: [1, 2, 3, 4],
            },
          ],
        },
      },
    ],
  });
}

onMounted(() => {
  initDashBoard();
});
</script>

<style>
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
</style>
