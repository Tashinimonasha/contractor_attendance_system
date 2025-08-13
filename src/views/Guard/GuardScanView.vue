<template>
  <div class="d-flex flex-column fill-height">
    <!-- Top Bar for Guard -->
    <v-toolbar color="transparent">
      <v-toolbar-title>
        <v-img :src="logo" width="120"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="text-capitalize" @click="logoutDialog = true">
        <v-icon left>mdi-logout</v-icon>
        Sign Out
      </v-btn>
    </v-toolbar>

    <!-- Main Content -->
    <div class="d-flex flex-grow-1 justify-center align-center text-center">
      <div>
        <v-icon size="120" color="grey-lighten-1">mdi-qrcode-scan</v-icon>
        <h1 class="text-h3 font-weight-light mt-4 text-grey-darken-2">Ready to Scan</h1>
        <p class="text-medium-emphasis mt-2">Position the worker's NIC in front of the camera.</p>
        
        <!-- Camera View Placeholder -->
        <v-card width="500" height="300" class="mt-8 mx-auto d-flex justify-center align-center grey-lighten-3">
            <span class="text-grey-darken-1">Camera Feed Placeholder</span>
        </v-card>

        <div class="mt-6">
            <v-btn color="primary" size="x-large" class="mx-2">
                <v-icon left>mdi-camera</v-icon>
                Start Scan
            </v-btn>
             <v-btn size="x-large" class="mx-2">
                <v-icon left>mdi-keyboard</v-icon>
                Manual Entry
            </v-btn>
        </div>
      </div>
    </div>
    
    <!-- Dialogs -->
    <confirm-dialog
      :model-value="logoutDialog"
      @update:model-value="logoutDialog = false"
      title="Confirm Logout"
      text="Are you sure you want to sign out?"
      @confirm="authStore.logout()"
    />
     <change-password-dialog
      :model-value="authStore.isFirstLogin"
      :persistent="true"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import logo from '@/assets/printcareLogo.png';
import ConfirmDialog from '@/components/App/ConfirmDialog.vue';
import ChangePasswordDialog from '@/components/Core/ChangePasswordDialog.vue';

const authStore = useAuthStore();
const logoutDialog = ref(false);
</script>