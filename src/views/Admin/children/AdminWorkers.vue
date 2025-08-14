<template>
  <div>
    <h1 class="text-h4 mb-2">Worker Management</h1>
    <p class="text-medium-emphasis mb-6">View and manage all contractor worker records.</p>
    
    <!-- Filters -->
    <v-card rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="12" md="3"><v-text-field label="Search by name or NIC..." prepend-inner-icon="mdi-magnify" variant="outlined" hide-details></v-text-field></v-col>
          <v-col cols="12" sm="6" md="2"><v-select label="All Companies" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="2"><v-select label="All Departments" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="2"><v-select label="All Contractors" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="3"><v-text-field label="Date Range" variant="outlined" hide-details></v-text-field></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Worker Records Table -->
    <v-card rounded="lg">
      <v-card-title>Worker Records ({{ workers.length }})</v-card-title>
      <v-data-table :headers="headers" :items="workers" item-value="nic">
        <template v-slot:item.status="{ value }">
          <v-chip :color="value === 'Checked In' ? 'success' : 'grey'" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.duration="{ value }">
          <v-chip v-if="value" color="primary" variant="tonal" size="small">{{ value }}</v-chip>
        </template>
         <template v-slot:item.action>
          <v-btn icon flat size="small"><v-icon>mdi-eye-outline</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const headers = ref([
  { title: 'Worker Name', key: 'name' },
  { title: 'NIC Number', key: 'nic' },
  { title: 'Company', key: 'company' },
  { title: 'Department', key: 'department' },
  { title: 'Contractor', key: 'contractor' },
  { title: 'Status', key: 'status' },
  { title: 'Check In', key: 'checkIn' },
  { title: 'Check Out', key: 'checkOut' },
  { title: 'Duration', key: 'duration' },
  { title: 'Action', key: 'action', sortable: false },
]);
const workers = ref([
    { name: 'Amal Perera', nic: '199812345678', company: 'PCL', department: 'Printing & Packaging', contractor: 'ABC Contractors Ltd', status: 'Checked In', checkIn: '08:00', checkOut: '-', duration: null, action: ''},
    { name: 'Sunil Fernando', nic: '198567890123', company: 'PUL', department: 'Sales & Customer Service', contractor: 'XYZ Services', status: 'Checked Out', checkIn: '09:15', checkOut: '17:45', duration: '8h 30m', action: ''},
    { name: 'Kamala Silva', nic: '199234567890', company: 'PPM', department: 'Design & Pre-media', contractor: 'Quick Solutions', status: 'Checked In', checkIn: '07:45', checkOut: '-', duration: null, action: ''},
    { name: 'Nimal Jayasinghe', nic: '198798123456', company: 'PDSL', department: 'Sales & Customer Service', contractor: 'Elite Workforce', status: 'Checked Out', checkIn: '08:30', checkOut: '16:30', duration: '8h 0m', action: ''},
]);
</script>