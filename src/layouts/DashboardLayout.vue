<template>
  <div>
    <app-top-bar />
    <v-main style="min-height: 100vh;">
      <v-container fluid class="pa-4 pa-md-6">
        <router-view />
      </v-container>
    </v-main>
    <change-password-dialog 
      :model-value="authStore.isFirstLogin" 
      :persistent="true"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import AppTopBar from '@/components/App/AppTopBar.vue';
import ChangePasswordDialog from '@/components/Core/ChangePasswordDialog.vue';
const authStore = useAuthStore();
</script>