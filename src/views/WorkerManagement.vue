<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h4">Worker Management</h1>
    </div>
    <v-card rounded="lg" class="mb-4">
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
</template>

<script setup>
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
