<template>
  <div>
    <h1 class="text-h4 mb-4">Finance Dashboard</h1>
    
    <v-row>
      <!-- Stats Cards -->
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>Total Pending Payments</v-card-title>
          <v-card-text>
            <p class="text-h5">Rs. {{ formatNumber(stats.pendingPayments) }}</p>
            <p>{{ stats.pendingInvoices }} invoices</p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Add other stat cards -->
    </v-row>
    
    <h2 class="text-h5 mt-8 mb-4">Recent Transactions</h2>
    <v-data-table
      :headers="headers"
      :items="transactions"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFinanceDashboardData } from '../services/mockApi';

const stats = ref({});
const transactions = ref([]);
const headers = [
  { title: 'Invoice ID', value: 'id' },
  { title: 'Contractor', value: 'contractor' },
  { title: 'Amount', value: 'amount' },
  { title: 'Status', value: 'status' },
  { title: 'Due Date', value: 'dueDate' },
];

const formatNumber = (num) => new Intl.NumberFormat('en-LK').format(num);

onMounted(async () => {
  const data = await getFinanceDashboardData();
  stats.value = data.stats;
  transactions.value = data.recentTransactions;
});
</script>