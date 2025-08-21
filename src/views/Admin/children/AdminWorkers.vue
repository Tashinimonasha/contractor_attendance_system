<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">Worker Management</h2>
      <p class="text-medium-emphasis">Search, filter, and manage all contractor worker records.</p>
    </div>

    <!-- Filter Bar -->
    <v-card rounded="lg" class="mb-6 filter-bar">
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchQuery"
              label="Search by name or NIC..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              label="All Companies"
              :items="['PCL', 'PUL', 'PPM', 'PDSL']"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              label="All Departments"
              :items="['Printing', 'Sales', 'Design']"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              label="All Contractors"
              :items="['ABC Ltd', 'XYZ Services', 'Quick Solutions']"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="Date Range (mm/dd/yyyy)"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- Worker Records Data Table -->
    <v-card rounded="xl">
      <v-card-title class="text-h6">
        Worker Records ({{ workerRecords.length }})
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="workerRecords"
        :search="searchQuery"
        item-value="nic"
        class="elevation-0"
      >
        <!-- Customizing slots to render chips exactly like the design -->
        <template v-slot:item.company="{ value }">
          <v-chip label size="small" variant="tonal" color="blue-grey">{{ value }}</v-chip>
        </template>
        <template v-slot:item.contractor="{ value }">
          <v-chip label size="small" variant="tonal" color="purple-lighten-2">{{ value }}</v-chip>
        </template>
        <template v-slot:item.status="{ value }">
          <v-chip
            :color="value === 'Checked In' ? 'green' : 'grey-darken-1'"
            :prepend-icon="value === 'Checked In' ? 'mdi-login-variant' : 'mdi-logout-variant'"
            size="small"
            label
            variant="flat"
            class="font-weight-medium"
          >
            {{ value }}
          </v-chip>
        </template>
        <template v-slot:item.duration="{ value }">
          <v-chip v-if="value" label size="small" variant="tonal" color="orange">{{ value }}</v-chip>
        </template>
        <template v-slot:item.active="{ value }">
          <v-chip v-if="value" label size="small" variant="tonal" color="cyan">Active</v-chip>
        </template>
        <template v-slot:item.actions>
          <v-btn icon="mdi-eye-outline" variant="text" size="small" color="blue-grey-lighten-2"></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

// --- DATA (In a real app, this would be fetched from your backend) ---

const headers = ref([
  { title: 'Worker Name', key: 'name', sortable: true },
  { title: 'NIC Number', key: 'nic', sortable: true },
  { title: 'Company', key: 'company' },
  { title: 'Department', key: 'department' },
  { title: 'Contractor', key: 'contractor' },
  { title: 'Status', key: 'status' },
  { title: 'Check In', key: 'checkIn' },
  { title: 'Check Out', key: 'checkOut' },
  { title: 'Duration', key: 'duration' },
  { title: 'Active', key: 'active', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]);

const workerRecords = ref([
  { name: 'Amal Perera', nic: '199812345678', company: 'PCL', department: 'Printing & Packaging', contractor: 'ABC Contractors Ltd', status: 'Checked In', checkIn: '08:00', checkOut: '-', duration: null, active: true },
  { name: 'Sunil Fernando', nic: '198567890123', company: 'PUL', department: 'Sales & Customer Service', contractor: 'XYZ Services', status: 'Checked Out', checkIn: '09:15', checkOut: '17:45', duration: '8h 30m', active: false },
  { name: 'Kamala Silva', nic: '199234567890', company: 'PPM', department: 'Design & Pre-media', contractor: 'Quick Solutions', status: 'Checked In', checkIn: '07:45', checkOut: '-', duration: null, active: true },
  { name: 'Nimal Jayasinghe', nic: '198798123456', company: 'PDSL', department: 'Sales & Customer Service', contractor: 'Elite Workforce', status: 'Checked Out', checkIn: '08:30', checkOut: '16:30', duration: '8h 0m', active: false },
  { name: 'Dilani Wijesinghe', nic: '199456789012', company: 'PCL', department: 'Design & Pre-media', contractor: 'Professional Staff', status: 'Checked In', checkIn: '08:15', checkOut: '-', duration: null, active: true },
]);
</script>

<style scoped>
/* Optional: Add a subtle transition to the filter bar */
.filter-bar {
  transition: all 0.2s ease-in-out;
}
</style>