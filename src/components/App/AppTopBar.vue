<template>
  <!-- 
    THIS IS THE FIX:
    1. Add the 'color' prop. You can use a predefined color like "primary" or a specific hex code.
    2. Add a class like 'text-white' to ensure icons and text are visible.
  -->
  <v-app-bar flat class="border-b text-white" color="blue-darken-4">
    <!-- Logo -->
    <v-img 
      src="@/assets/printcareLogo.png" 
      max-height="80"
      max-width="250"
      contain
      class="ml-4 mr-3"
    />
    
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
      <v-list density="compact">
        <v-list-item @click="changePasswordDialog = true">
          <template v-slot:prepend><v-icon size="small">mdi-lock-reset</v-icon></template>
          <v-list-item-title>Change Password</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logoutDialog = true">
           <template v-slot:prepend><v-icon size="small">mdi-logout</v-icon></template>
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
// The <script> section does not need any changes for this styling update.
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