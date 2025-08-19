<template>
  <v-app>
    <app-nav-drawer v-model="drawer" />
    <app-top-bar @toggle-drawer="drawer = !drawer" />

    <v-main style="min-height: 100vh;">
      <v-container fluid class="pa-4 pa-md-6">
        <router-view />
      </v-container>
    </v-main>
    
    <!-- ... your other dialogs ... -->
      <change-password-dialog 
      :model-value="authStore.isFirstLogin"
      :persistent="true"
    />

  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import AppNavDrawer from '@/components/App/AppNavDrawer.vue';
import AppTopBar from '@/components/App/AppTopBar.vue';
import ChangePasswordDialog from '@/components/Core/ChangePasswordDialog.vue';

const { mdAndUp: isDesktop } = useDisplay();
const authStore = useAuthStore();

// Drawer should be open by default on desktop, and closed by default on mobile.
const drawer = ref(isDesktop.value);
</script>