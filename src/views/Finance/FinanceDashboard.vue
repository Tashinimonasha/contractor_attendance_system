
<template>
  <div>
    <!-- Navigation Tabs for Finance Dashboard -->
    <div class="mb-6">
      <v-tabs
        v-model="activeTab"
        color="primary"
        background-color="white"
        class="mb-6"
      >
        <v-tab :to="{ name: 'FinanceOverview' }" value="overview">Overview</v-tab>
        <v-tab :to="{ name: 'FinanceWorkers' }" value="workers">Workers</v-tab>
      </v-tabs>
    </div>
    <!-- Child dashboard content -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeTab = ref(route.path.includes('workers') ? 'workers' : 'overview');

// Watch tab change and navigate
watch(activeTab, (tab) => {
  if (tab === 'overview') {
    router.push({ name: 'FinanceOverview' });
  } else if (tab === 'workers') {
    router.push({ name: 'FinanceWorkers' });
  }
});
</script>
