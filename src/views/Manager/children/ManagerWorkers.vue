<template>
  <div>
    <h1 class="text-h4 mb-2">Department Worker Management</h1>
    <p class="text-medium-emphasis mb-6">View and manage contractor workers in your department.</p>
    
    <!-- Filters -->
    <v-card rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="12" md="3"><v-text-field label="Search by name or NIC..." prepend-inner-icon="mdi-magnify" variant="outlined" hide-details></v-text-field></v-col>
          <v-col cols="12" sm="6" md="3"><v-select label="All Contractors" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="3"><v-select label="Attendance Status" :items="statusItems" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="3"><v-text-field label="Date Range" variant="outlined" hide-details></v-text-field></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Worker Records Table with Performance Data -->
    <v-card rounded="lg">
      <v-card-title>Department Workers ({{ workers.length }})</v-card-title>
      <v-data-table :headers="headers" :items="workers" item-value="nic">
        <template v-slot:item.status="{ value }">
          <v-chip :color="value === 'Checked In' ? 'success' : 'grey'" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.duration="{ value }">
          <v-chip v-if="value" color="primary" variant="tonal" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.efficiency="{ value }">
          <v-progress-linear :model-value="value" height="12" rounded>
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
        </template>
        <template v-slot:item.action>
          <v-btn icon flat size="small" color="primary"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
          <v-btn icon flat size="small" color="info" class="ml-2"><v-icon>mdi-eye-outline</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const statusItems = ['All Status', 'Checked In', 'Checked Out'];

const headers = ref([
  { title: 'Worker Name', key: 'name' },
  { title: 'NIC Number', key: 'nic' },
  { title: 'Contractor', key: 'contractor' },
  { title: 'Status', key: 'status' },
  { title: 'Check In', key: 'checkIn' },
  { title: 'Check Out', key: 'checkOut' },
  { title: 'Duration', key: 'duration' },
  { title: 'Attendance %', key: 'attendance' },
  { title: 'Efficiency %', key: 'efficiency' },
  { title: 'Action', key: 'action', sortable: false },
]);

const workers = ref([
  { name: 'Amal Perera', nic: '199812345678', contractor: 'ABC Contractors Ltd', status: 'Checked In', checkIn: '08:00', checkOut: '-', duration: null, attendance: 95, efficiency: 88, action: '' },
  { name: 'Sunil Fernando', nic: '198567890123', contractor: 'XYZ Services', status: 'Checked Out', checkIn: '09:15', checkOut: '17:45', duration: '8h 30m', attendance: 90, efficiency: 92, action: '' },
  { name: 'Kamala Silva', nic: '199234567890', contractor: 'Quick Solutions', status: 'Checked In', checkIn: '07:45', checkOut: '-', duration: null, attendance: 98, efficiency: 85, action: '' },
  { name: 'Nimal Jayasinghe', nic: '198798123456', contractor: 'Elite Workforce', status: 'Checked Out', checkIn: '08:30', checkOut: '16:30', duration: '8h 0m', attendance: 88, efficiency: 90, action: '' },
  { name: 'Dilani Wijesinghe', nic: '199456789012', contractor: 'Professional Staff', status: 'Checked In', checkIn: '08:15', checkOut: '-', duration: null, attendance: 93, efficiency: 94, action: '' },
]);
</script>
