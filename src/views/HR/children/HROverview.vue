<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4">HR Dashboard</h1>
      <p class="text-medium-emphasis">Welcome back, HR Manager</p>
    </div>
    <!-- Stat Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Total Workers</v-card-title><v-card-text><span class="text-h4">5</span></v-card-text></v-card></v-col>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Active Companies</v-card-title><v-card-text><span class="text-h4">4</span></v-card-text></v-card></v-col>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Active Today</v-card-title><v-card-text><span class="text-h4">3</span></v-card-text></v-card></v-col>
      <v-col cols="12" sm="6" md="3"><v-card rounded="lg" class="pa-2"><v-card-title>Departments</v-card-title><v-card-text><span class="text-h4">8</span></v-card-text></v-card></v-col>
    </v-row>

    <!-- Analytics Section -->
    <div class="d-flex align-center mt-8 mb-4">
      <h2 class="text-h5">Analytics</h2>
      <v-spacer></v-spacer>
      <v-select :items="['Daily', 'Weekly', 'Monthly']" model-value="Daily" dense variant="outlined" hide-details style="max-width: 150px;"></v-select>
    </div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card rounded="lg"><v-card-title>Workers by Company</v-card-title><v-card-text><Pie :data="pieData" :options="chartOptions" /></v-card-text></v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card rounded="lg"><v-card-title>Attendance Trends</v-card-title><v-card-text><Bar :data="barData" :options="chartOptions" /></v-card-text></v-card>
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
  labels: ['PCL', 'PUL', 'PPM', 'PDSL'],
  datasets: [{ data: [2, 1, 1, 1], backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#F44336'] }]
};

const barData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ label: 'Attendance', data: [5, 5, 4, 5, 3, 2, 0], backgroundColor: '#2196F3' }]
};
</script>
