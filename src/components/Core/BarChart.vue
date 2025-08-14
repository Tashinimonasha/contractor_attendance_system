<template>
  <div class="bar-chart-wrapper">
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: { type: Object, required: true }
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    x: { beginAtZero: true },
    y: { beginAtZero: true }
  }
};
</script>

<style scoped>
.bar-chart-wrapper {
  max-width: 260px;
  margin: 0 auto;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
