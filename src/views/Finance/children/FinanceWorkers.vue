<template>
  <div>
    <h1 class="text-h4 mb-2">Finance Worker Management</h1>
    <p class="text-medium-emphasis mb-6">View and manage contractor worker financial records.</p>
    
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

    <!-- Worker Records Table with Financial Data -->
    <v-card rounded="lg">
      <v-card-title>Worker Financial Records ({{ workers.length }})</v-card-title>
      <v-data-table :headers="headers" :items="workers" item-value="nic">
        <template v-slot:item.status="{ value }">
          <v-chip :color="value === 'Checked In' ? 'success' : 'grey'" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.duration="{ value }">
          <v-chip v-if="value" color="primary" variant="tonal" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.paymentStatus="{ value }">
          <v-chip :color="getPaymentStatusColor(value)" size="small">{{ value }}</v-chip>
        </template>
        <template v-slot:item.action>
          <v-btn icon flat size="small" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon flat size="small" color="info" class="ml-2"><v-icon>mdi-eye-outline</v-icon></v-btn>
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
  { title: 'Hours This Month', key: 'hoursMonth' },
  { title: 'Rate (LKR)', key: 'rate' },
  { title: 'Amount (LKR)', key: 'amount' },
  { title: 'Payment Status', key: 'paymentStatus' },
  { title: 'Action', key: 'action', sortable: false },
]);

const workers = ref([
  { name: 'Amal Perera', nic: '199812345678', company: 'PCL', department: 'Printing & Packaging', contractor: 'ABC Contractors Ltd', hoursMonth: 160, rate: 250, amount: 40000, paymentStatus: 'Paid', action: '' },
  { name: 'Sunil Fernando', nic: '198567890123', company: 'PUL', department: 'Sales & Customer Service', contractor: 'XYZ Services', hoursMonth: 152, rate: 280, amount: 42560, paymentStatus: 'Pending', action: '' },
  { name: 'Kamala Silva', nic: '199234567890', company: 'PPM', department: 'Design & Pre-media', contractor: 'Quick Solutions', hoursMonth: 168, rate: 300, amount: 50400, paymentStatus: 'Paid', action: '' },
  { name: 'Nimal Jayasinghe', nic: '198798123456', company: 'PDSL', department: 'Sales & Customer Service', contractor: 'Elite Workforce', hoursMonth: 144, rate: 275, amount: 39600, paymentStatus: 'Processing', action: '' },
  { name: 'Dilani Wijesinghe', nic: '199456789012', company: 'PCL', department: 'Design & Pre-media', contractor: 'Professional Staff', hoursMonth: 160, rate: 320, amount: 51200, paymentStatus: 'Paid', action: '' },
]);

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'info';
    default:
      return 'grey';
  }
};
</script>
