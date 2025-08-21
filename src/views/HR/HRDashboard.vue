<template>
  <div class="pa-4 pa-md-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4">HR Dashboard</h1>
      <p class="text-medium-emphasis">Welcome, {{ authStore.user?.name }}</p>
    </div>

    <!-- Navigation Tabs -->
    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="overview" prepend-icon="mdi-view-dashboard-outline">Overview</v-tab>
      <v-tab value="workers" prepend-icon="mdi-account-hard-hat-outline">Workers</v-tab>
 
    </v-tabs>
    
    <!-- Content Window -->
    <!-- This will display the component for the currently active tab -->
    <v-window v-model="activeTab">
      <v-window-item value="overview">
        <HROverview />
      </v-window-item>
      
      <v-window-item value="workers">
        <HRWorkers />
      </v-window-item>
      
       
    </v-window>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Import the child components that will be displayed in the tabs
import HROverview from './children/HROverview.vue';
import HRWorkers from './children/HRWorkers.vue';

const authStore = useAuthStore();

// This ref controls which tab is active.
// The default value 'overview' ensures the Overview tab is shown on page load.
const activeTab = ref('overview');
</script>


 