<template>
  <ForceChangePasswordDialog
    v-if="authStore.isFirstLogin"
    :model-value="authStore.isFirstLogin"
    @update:model-value="(val) => { if (!val) authStore.isFirstLogin = false; }"
  />
  <v-alert
    v-if="authStore.error"
    type="error"
    class="mb-6"
    border="start"
    prominent
    :text="authStore.error"
  />
  <div>
    <div class="mb-6 d-flex align-center flex-wrap">
      <h1 class="text-h4 mr-4">Dashboard Overview</h1>
      <span class="text-medium-emphasis">Welcome, {{ roleLabel }}</span>
    </div>
    <!-- Stat Cards -->
    <v-row class="mb-4" dense>
      <v-col v-for="card in overviewCards" :key="card.title" cols="12" sm="6" md="3">
        <v-card class="pa-4" rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-1 font-weight-bold">{{ card.title }}</div>
              <div class="text-h5 font-weight-bold">{{ card.value }}</div>
              <div v-if="card.caption" class="text-caption" :class="card.captionClass">{{ card.caption }}</div>
            </div>
            <v-icon :color="card.iconColor">{{ card.icon }}</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- Chart Section -->
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card rounded="lg" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Workers by Company</div>
          <PieChart :chart-data="companyData" />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card rounded="lg" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Workers by Department</div>
          <BarChart :chart-data="departmentData" />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card rounded="lg" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Workers by Contractor</div>
          <PieChart :chart-data="contractorData" />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card rounded="lg" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Current Status</div>
          <PieChart :chart-data="statusData" />
        </v-card>
      </v-col>
    </v-row>
    <!-- Worker Management Table Section -->
    <div class="mt-8">
      <h2 class="text-h5 font-weight-bold mb-4">Worker Management</h2>
      <v-card rounded="lg" class="mb-4">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Worker Records ({{ workerRecords.length }})</span>
          <span class="text-caption text-medium-emphasis">Workers are registered via Guard NIC scanning</span>
        </v-card-title>
        <v-data-table
          :headers="workerHeaders"
          :items="workerRecords"
          class="elevation-0"
          hide-default-footer
        >
          <template #item.status="{ item }">
            <v-chip :color="item.status === 'Checked In' ? 'success' : 'grey'" size="small">{{ item.status }}</v-chip>
          </template>
          <template #item.active="{ item }">
            <v-chip :color="item.active ? 'success' : 'warning'" size="small">{{ item.active ? 'Active' : item.duration }}</v-chip>
          </template>
          <template #item.contractor="{ item }">
            <v-chip color="purple" size="small">{{ item.contractor }}</v-chip>
          </template>
          <template #item.company="{ item }">
            <v-chip color="blue" size="small">{{ item.company }}</v-chip>
          </template>
          <template #item.action>
            <v-btn icon size="small"><v-icon>mdi-eye</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>
<script setup>
import { watch } from 'vue';
// ...existing code...
const showChangePasswordDialog = ref(authStore.isFirstLogin);
watch(() => authStore.isFirstLogin, (val) => {
  showChangePasswordDialog.value = val;
});
const authStore = useAuthStore();

import { onMounted } from 'vue';
onMounted(() => {
  if (authStore.error) authStore.error = null;
});
const roleLabel = authStore.user?.role || 'User';
const overviewCards = [
  { title: 'Total Workers', value: 5, caption: '+2 from last week', captionClass: 'text-success', icon: 'mdi-account-group', iconColor: 'primary' },
  { title: 'Active Companies', value: 4, caption: 'Across all departments', captionClass: 'text-medium-emphasis', icon: 'mdi-domain', iconColor: 'primary' },
  { title: 'Active Today', value: 3, caption: 'Currently checked in', captionClass: 'text-medium-emphasis', icon: 'mdi-calendar-check', iconColor: 'primary' },
  { title: 'Departments', value: 8, caption: 'Across 4 companies', captionClass: 'text-medium-emphasis', icon: 'mdi-office-building', iconColor: 'primary' },
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
</script>
