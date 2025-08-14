<template>
  <div class="pie-chart-wrapper">
    <Pie :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  chartData: { type: Object, required: true }
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false }
  }
};
</script>

<style scoped>
.pie-chart-wrapper {
  max-width: 260px;
  margin: 0 auto;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
