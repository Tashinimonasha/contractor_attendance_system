<template>
  <div>
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5">Analytics Overview</h2>
      <v-select
        v-model="selectedPeriod"
        :items="['Daily', 'Weekly', 'Monthly']"
        label="Period"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 150px;"
      />
    </div>

    <!-- Statistics Cards -->
    <v-row>
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card rounded="lg" class="pa-2 stat-card">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="small" class="mr-2 text-medium-emphasis">{{ stat.icon }}</v-icon>
              <div class="text-subtitle-1 text-medium-emphasis">{{ stat.title }}</div>
            </div>
            <div class="d-flex align-baseline mt-2">
              <p class="text-h4 font-weight-bold">{{ stat.value }}</p>
              <p v-if="stat.change" class="text-caption ml-2" :class="stat.change.startsWith('+') ? 'text-success' : 'text-error'">
                {{ stat.change }}
              </p>
            </div>
            <p class="text-caption text-medium-emphasis mt-1">{{ stat.subtitle }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Charts Section -->
    <v-row class="mt-4">
      <!-- Workers by Company -->
      <v-col cols="12" lg="6">
        <v-card rounded="lg">
          <v-card-title><v-icon left class="mr-2">mdi-chart-pie</v-icon>Workers by Company</v-card-title>
          <v-card-text style="height: 350px;">
            <Doughnut :data="companyData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Workers by Department -->
      <v-col cols="12" lg="6">
        <v-card rounded="lg">
          <v-card-title><v-icon left class="mr-2">mdi-chart-bar</v-icon>Workers by Department</v-card-title>
          <v-card-text style="height: 350px;">
            <Bar :data="departmentData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Workers by Contractor -->
      <v-col cols="12" lg="6">
        <v-card rounded="lg">
          <v-card-title><v-icon left class="mr-2">mdi-chart-pie</v-icon>Workers by Contractor</v-card-title>
          <v-card-text style="height: 350px;">
            <Doughnut :data="contractorData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Current Status -->
      <v-col cols="12" lg="6">
        <v-card rounded="lg">
          <v-card-title><v-icon left class="mr-2">mdi-check-circle-outline</v-icon>Current Status</v-card-title>
          <v-card-text style="height: 350px;">
            <Doughnut :data="statusData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 1. Import the chart components from vue-chartjs
import { Doughnut, Bar } from 'vue-chartjs';
// 2. Import all the necessary parts from chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// 3. Register the components with ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const selectedPeriod = ref('Monthly');

// --- DATA (In a real app, this would be fetched from your backend) ---

// Data for the Stat Cards
const stats = ref([
  { title: 'Total Workers', icon: 'mdi-account-group-outline', value: 5, change: '+2 from last week', subtitle: 'All contractors' },
  { title: 'Active Companies', icon: 'mdi-domain', value: 4, subtitle: 'Across all departments' },
  { title: 'Active Today', icon: 'mdi-chart-line', value: 3, subtitle: 'Currently checked in' },
  { title: 'Departments', icon: 'mdi-office-building-outline', value: 8, subtitle: 'Across 4 companies' },
]);

// Options for all charts
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

// Data for the "Workers by Company" Doughnut Chart
const companyData = {
  labels: ['PCL (40.0%)', 'PDSL (20.0%)', 'PPM (20.0%)', 'PUL (20.0%)'],
  datasets: [{
    label: 'Workers',
    data: [2, 1, 1, 1], // The raw numbers
    backgroundColor: ['#2E7D32', '#D32F2F', '#FF8F00', '#1976D2'],
  }],
};

// Data for the "Workers by Department" Bar Chart
const departmentData = {
  labels: ['Printing', 'Design', 'Sales', 'Design', 'Sales'],
  datasets: [{
    label: 'Workers',
    data: [1, 1, 1, 1, 1],
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  }],
};

// Data for the "Workers by Contractor" Doughnut Chart
const contractorData = {
  labels: ['ABC (1)', 'Professional (1)', 'Elite (1)', 'Quick (1)', 'XYZ (1)'],
  datasets: [{
    label: 'Workers',
    data: [1, 1, 1, 1, 1],
    backgroundColor: ['#2E7D32', '#8E24AA', '#D81B60', '#FF8F00', '#1976D2'],
  }],
};

// Data for the "Current Status" Doughnut Chart
const statusData = {
  labels: ['Checked In: 3', 'Checked Out: 2'],
  datasets: [{
    label: 'Status',
    data: [3, 2],
    backgroundColor: ['#2E7D32', '#D32F2F'],
  }],
};
</script>

<style scoped>
.stat-card {
  transition: all 0.2s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
</style>