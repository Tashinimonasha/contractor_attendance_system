<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4">HR Dashboard</h1>
      <p class="text-medium-emphasis">{{ authStore.welcomeMessage }}</p>
    </div>

    <!-- Filters -->
    <v-card rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="3"><v-select label="Department" variant="outlined" dense hide-details></v-select></v-col>
          <v-col cols="12" md="3"><v-select label="Contractor" variant="outlined" dense hide-details></v-select></v-col>
          <v-col cols="12" md="2"><v-text-field label="From Date" type="date" variant="outlined" dense hide-details></v-text-field></v-col>
          <v-col cols="12" md="2"><v-text-field label="To Date" type="date" variant="outlined" dense hide-details></v-text-field></v-col>
          <v-col cols="12" md="2"><v-btn color="success" block size="large">Export to CSV</v-btn></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card rounded="lg">
      <v-card-title>Attendance Records</v-card-title>
      <v-data-table :headers="headers" :items="records"></v-data-table>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const headers = ref([
  { title: 'Worker', value: 'worker' },
  { title: 'Department', value: 'department' },
  { title: 'Contractor', value: 'contractor' },
  { title: 'Date', value: 'date' },
  { title: 'Check In', value: 'checkIn' },
  { title: 'Check Out', value: 'checkOut' },
  { title: 'Duration', value: 'duration' },
]);
const records = ref([
  { worker: 'John Doe', department: 'PCL', contractor: 'ABC', date: '1/8/2025', checkIn: '8:00 AM', checkOut: '5:00 PM', duration: '9h' },
  //... more data
]);
</script>