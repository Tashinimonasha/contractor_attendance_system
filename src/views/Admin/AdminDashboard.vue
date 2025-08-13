<template>
  <div>
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
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const stats = [
  { title: 'System Users', value: '3', chip: '3 active', chipColor: 'success' },
  { title: 'Contractors', value: '3', chip: '3 active', chipColor: 'success' },
  { title: 'Companies', value: '2' },
  { title: 'Departments', value: '4' },
];
</script>