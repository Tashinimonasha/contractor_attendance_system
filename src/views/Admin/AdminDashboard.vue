<template>
  <div>
    <div class="d-flex">
      <AppNavDrawer />
      <div class="flex-grow-1 px-2 px-md-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-h4">Admin Dashboard</h1>
          <p class="text-medium-emphasis">{{ authStore.welcomeMessage }}</p>
        </div>

        <!-- Stat Cards -->
        <v-row>
          <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
            <v-card class="pa-2" rounded="lg">
              <v-card-title class="text-subtitle-1 font-weight-regular text-medium-emphasis">{{ stat.title }}</v-card-title>
              <v-card-text class="d-flex align-center">
                <span class="text-h4 font-weight-bold">{{ stat.value }}</span>
                <v-chip v-if="stat.chip" size="small" :color="stat.chipColor" class="ml-auto">{{ stat.chip }}</v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- User Lists and Actions -->
        <v-row class="mt-4">
          <v-col cols="12" md="7">
            <v-card rounded="lg">
              <v-card-title>Recent System Users</v-card-title>
              <!-- A list of users would go here -->
            </v-card>
          </v-col>
          <v-col cols="12" md="5">
            <v-card rounded="lg" color="warning" variant="tonal">
              <v-card-title>Actions Required</v-card-title>
              <!-- List of actions, like password resets -->
            </v-card>
          </v-col>
        </v-row>
  <!-- ...charts removed, only Worker Management table will show... -->
  <!-- ...Worker Management table removed, only shown in WorkerManagement.vue... -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import AppTopBar from '@/components/App/AppTopBar.vue';
import AppNavDrawer from '@/components/App/AppNavDrawer.vue';
import PieChart from '@/components/Core/PieChart.vue';
import BarChart from '@/components/Core/BarChart.vue';
const authStore = useAuthStore();
const stats = [
  { title: 'System Users', value: '3', chip: '3 active', chipColor: 'success' },
  { title: 'Contractors', value: '3', chip: '3 active', chipColor: 'success' },
  { title: 'Companies', value: '2' },
  { title: 'Departments', value: '4' },
];
const workerHeaders = [
  { title: 'Worker Name', value: 'name' },
  { title: 'NIC Number', value: 'nic' },
  { title: 'Company', value: 'company' },
  { title: 'Department', value: 'department' },
  { title: 'Contractor', value: 'contractor' },
  { title: 'Status', value: 'status' },
  { title: 'Check In', value: 'checkIn' },
  { title: 'Check Out', value: 'checkOut' },
  { title: 'Duration', value: 'duration' },
  { title: 'Active', value: 'active' },
  { title: 'Action', value: 'action', sortable: false },
];
const workerRecords = [
  { name: 'Amal Perera', nic: '199012345678', company: 'PCL', department: 'Printing & Packaging', contractor: 'ABC Contractors Ltd', status: 'Checked In', checkIn: '08:00', checkOut: '-', duration: '', active: true },
  { name: 'Sunil Fernando', nic: '198567890123', company: 'PUL', department: 'Sales & Customer Service', contractor: 'XYZ Services', status: 'Checked Out', checkIn: '09:15', checkOut: '17:45', duration: '8h 30m', active: false },
  { name: 'Kamala Silva', nic: '199234567890', company: 'PPM', department: 'Design & Pre-media', contractor: 'Quick Solutions', status: 'Checked In', checkIn: '07:45', checkOut: '-', duration: '', active: true },
  { name: 'Nimal Jayasinghe', nic: '198790123456', company: 'PDSL', department: 'Sales & Customer Service', contractor: 'Elite Workforce', status: 'Checked Out', checkIn: '08:30', checkOut: '16:30', duration: '8h 0m', active: false },
  { name: 'Dilani Wijesinghe', nic: '199456789012', company: 'PCL', department: 'Design & Pre-media', contractor: 'Professional Staff', status: 'Checked In', checkIn: '08:15', checkOut: '-', duration: '', active: true },
];
const companyData = {
  labels: ['PCL', 'PUL', 'PPM', 'PDSL'],
  datasets: [{
    data: [2, 1, 1, 1],
    backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
  }],
};
const departmentData = {
  labels: ['Printing', 'Design', 'Sales', 'Design', 'Sales'],
  datasets: [{
    data: [1, 1, 1, 1, 1],
    backgroundColor: '#4CAF50',
  }],
};
const contractorData = {
  labels: ['XYZ', 'ABC', 'Quick', 'Elite', 'Professional'],
  datasets: [{
    data: [1, 1, 1, 1, 1],
    backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#FF5722'],
  }],
};
const statusData = {
  labels: ['Checked In', 'Checked Out'],
  datasets: [{
    data: [3, 2],
    backgroundColor: ['#4CAF50', '#F44336'],
  }],
};
</script>