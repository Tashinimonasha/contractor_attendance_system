<template>
  <v-app>
    <template v-if="authStore.isLoading">
      <div class="d-flex justify-center align-center" style="height: 100vh">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>