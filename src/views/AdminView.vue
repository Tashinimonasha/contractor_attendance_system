<template>
  <div>
    <h1 class="text-h4 mb-4">Admin Dashboard</h1>
    <p>Welcome, {{ authStore.user?.name }} ({{ authStore.user?.role }})</p>
    <v-divider class="my-4"></v-divider>
    <h2 class="text-h5">Workers Management</h2>
    <v-btn color="primary" class="my-4">Add Worker</v-btn>
    <!-- Add more components here for worker lists, etc. -->
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>