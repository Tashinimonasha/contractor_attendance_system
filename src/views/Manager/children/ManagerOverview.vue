<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4">Manager Dashboard</h1>
      <p class="text-medium-emphasis">Welcome back, Department Manager</p>
    </div>
    <!-- Stat Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Department Workers</v-card-title><v-card-text><span class="text-h4">5</span></v-card-text></v-card></v-col>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Active Today</v-card-title><v-card-text><span class="text-h4">3</span></v-card-text></v-card></v-col>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Contractors</v-card-title><v-card-text><span class="text-h4">3</span></v-card-text></v-card></v-col>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Avg. Hours/Week</v-card-title><v-card-text><span class="text-h4">38</span></v-card-text></v-card></v-col>
    </v-row>

    <!-- Analytics Section -->
    <div class="d-flex align-center mt-8 mb-4">
      <h2 class="text-h5">Analytics</h2>
      <v-spacer></v-spacer>
      <v-select :items="['Daily', 'Weekly', 'Monthly']" model-value="Daily" dense variant="outlined" hide-details style="max-width: 150px;"></v-select>
    </div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card rounded="lg"><v-card-title>Workers by Contractor</v-card-title><v-card-text><Pie :data="pieData" :options="chartOptions" /></v-card-text></v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card rounded="lg"><v-card-title>Department Performance</v-card-title><v-card-text><Bar :data="barData" :options="chartOptions" /></v-card-text></v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const authStore = useAuthStore();

const chartOptions = { responsive: true, maintainAspectRatio: false };

const pieData = {
  labels: ['ABC Contractors', 'XYZ Services', 'Quick Solutions'],
  datasets: [{ data: [2, 2, 1], backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'] }]
};

const barData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{ label: 'Efficiency (%)', data: [85, 90, 88, 92], backgroundColor: '#FF9800' }]
};
</script>
