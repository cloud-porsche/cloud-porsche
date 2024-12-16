<template>
  <v-container>
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
      <v-col>
        <pre>{{ sparklineData }}</pre>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="border: 1px solid #e0e0e0; border-radius: 4px">
        <v-sparkline
          :model-value="sparklineData"
          color="blue"
          :padding="8"
          line-width="2"
          fill
        ></v-sparkline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { get } from "@/http/http";

export default {
  setup() {
    const selectedTimeframe = ref("monthly");
    const timeframeOptions = ["total", "yearly", "monthly", "weekly"];
    const sparklineData = ref([]);

    const fetchData = async () => {
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
    };

    const processData = (data) => {
      sparklineData.value = Object.values(data);
    };

    onMounted(() => {
      console.log("Mounted");
      fetchData();
    });

    return {
      selectedTimeframe,
      timeframeOptions,
      sparklineData,
      fetchData,
    };
  },
};
</script>
