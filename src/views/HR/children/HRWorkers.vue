<template>
  <div>
    <h1 class="text-h4 mb-2">HR Worker Management</h1>
    <p class="text-medium-emphasis mb-6">View and manage contractor worker records and documentation.</p>
    
    <!-- Filters -->
    <v-card rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="12" md="3"><v-text-field label="Search by name or NIC..." prepend-inner-icon="mdi-magnify" variant="outlined" hide-details></v-text-field></v-col>
          <v-col cols="12" sm="6" md="2"><v-select label="All Companies" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="2"><v-select label="All Departments" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="2"><v-select label="All Contractors" variant="outlined" hide-details></v-select></v-col>
          <v-col cols="12" sm="6" md="3"><v-select label="Document Status" :items="documentStatusItems" variant="outlined" hide-details></v-select></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Worker Records Table with HR Data -->
    <v-card rounded="lg">
      <v-card-title>Worker HR Records ({{ workers.length }})</v-card-title>
      <v-data-table :headers="headers" :items="workers" item-value="nic">
        <template v-slot:item.status="{ value }">
          <v-chip :color="value === 'Active' ? 'success' : 'error'" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.documentsStatus="{ value }">
          <v-chip :color="getDocumentStatusColor(value)" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.medicalStatus="{ value }">
          <v-chip :color="value === 'Approved' ? 'success' : 'warning'" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.action>
          <v-btn icon flat size="small" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon flat size="small" color="info" class="ml-2"><v-icon>mdi-file-document-outline</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const documentStatusItems = ['All Status', 'Complete', 'Incomplete', 'Expired', 'Pending Review'];

const headers = ref([
  { title: 'Worker Name', key: 'name' },
  { title: 'NIC Number', key: 'nic' },
  { title: 'Company', key: 'company' },
  { title: 'Department', key: 'department' },
  { title: 'Contractor', key: 'contractor' },
  { title: 'Status', key: 'status' },
  { title: 'Documents Status', key: 'documentsStatus' },
  { title: 'Medical Status', key: 'medicalStatus' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: 'Action', key: 'action', sortable: false },
]);

const workers = ref([
  { name: 'Amal Perera', nic: '199812345678', company: 'PCL', department: 'Printing & Packaging', contractor: 'ABC Contractors Ltd', status: 'Active', documentsStatus: 'Complete', medicalStatus: 'Approved', startDate: '2023-01-15', endDate: '2023-12-31', action: '' },
  { name: 'Sunil Fernando', nic: '198567890123', company: 'PUL', department: 'Sales & Customer Service', contractor: 'XYZ Services', status: 'Active', documentsStatus: 'Incomplete', medicalStatus: 'Pending', startDate: '2023-02-01', endDate: '2023-12-31', action: '' },
  { name: 'Kamala Silva', nic: '199234567890', company: 'PPM', department: 'Design & Pre-media', contractor: 'Quick Solutions', status: 'Active', documentsStatus: 'Complete', medicalStatus: 'Approved', startDate: '2023-01-10', endDate: '2023-12-31', action: '' },
  { name: 'Nimal Jayasinghe', nic: '198798123456', company: 'PDSL', department: 'Sales & Customer Service', contractor: 'Elite Workforce', status: 'Inactive', documentsStatus: 'Expired', medicalStatus: 'Expired', startDate: '2023-03-01', endDate: '2023-06-30', action: '' },
  { name: 'Dilani Wijesinghe', nic: '199456789012', company: 'PCL', department: 'Design & Pre-media', contractor: 'Professional Staff', status: 'Active', documentsStatus: 'Pending Review', medicalStatus: 'Approved', startDate: '2023-04-01', endDate: '2023-12-31', action: '' },
]);

const getDocumentStatusColor = (status) => {
  switch (status) {
    case 'Complete':
      return 'success';
    case 'Incomplete':
      return 'warning';
    case 'Expired':
      return 'error';
    case 'Pending Review':
      return 'info';
    default:
      return 'grey';
  }
};
</script>
