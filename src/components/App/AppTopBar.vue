<template>
  <v-app-bar flat class="border-b">
    <v-app-bar-title class="font-weight-bold">
      {{ authStore.userRole }} Dashboard
    </v-app-bar-title>
    <v-spacer></v-spacer>
    
    <!-- Theme Toggle Button -->
    <v-btn icon @click="themeStore.toggleTheme">
      <v-icon>{{ themeStore.isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      <v-tooltip activator="parent" location="bottom">Toggle Theme</v-tooltip>
    </v-btn>

    <!-- Language Change Button -->
    <v-btn icon>
      <v-icon>mdi-translate</v-icon>
      <v-tooltip activator="parent" location="bottom">Language</v-tooltip>
    </v-btn>

    <!-- User Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="text-capitalize">
          <v-avatar size="32" class="mr-2">
            <v-img src="https://cdn.vuetifyjs.com/images/avatars/1.jpg" alt="User"></v-img>
          </v-avatar>
          {{ authStore.user?.name }}
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="changePasswordDialog = true">
          <template v-slot:prepend><v-icon>mdi-lock-reset</v-icon></template>
          <v-list-item-title>Change Password</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logoutDialog = true">
           <template v-slot:prepend><v-icon>mdi-logout</v-icon></template>
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Dialogs -->
    <confirm-dialog
      :model-value="logoutDialog"
      @update:model-value="logoutDialog = false"
      title="Confirm Logout"
      text="Are you sure you want to sign out?"
      @confirm="authStore.logout()"
    />
     <change-password-dialog
      :model-value="changePasswordDialog"
      @update:model-value="changePasswordDialog = false"
    />
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import ConfirmDialog from './ConfirmDialog.vue';
import ChangePasswordDialog from '../Core/ChangePasswordDialog.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const logoutDialog = ref(false);
const changePasswordDialog = ref(false);
</script>