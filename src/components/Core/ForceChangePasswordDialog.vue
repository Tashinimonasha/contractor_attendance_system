<template>
  <v-dialog :model-value="modelValue" max-width="400px" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-3">mdi-lock</v-icon>
        <span class="text-h5">Change Password</span>
        <v-spacer />
      </v-card-title>
      <v-card-text class="pt-4">
        <p class="mb-6 text-medium-emphasis">For security, please change your password before accessing the dashboard.</p>
        <v-form @submit.prevent="handleChangePassword">
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            required
            :error-messages="error && error.includes('current') ? error : ''"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            label="New Password"
            prepend-inner-icon="mdi-lock-reset"
            variant="outlined"
            required
            type="password"
            :error-messages="error && error.includes('new') ? error : ''"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            prepend-inner-icon="mdi-lock-reset"
            variant="outlined"
            required
            type="password"
            :error-messages="error && error.includes('match') ? error : ''"
            class="mb-4"
          ></v-text-field>
          <v-alert v-if="error && !error.includes('current') && !error.includes('new') && !error.includes('match')" type="error" dense outlined class="mb-2">{{ error }}</v-alert>
          <v-btn color="primary" block class="mt-4" type="submit" :loading="loading">Change Password</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { updatePassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue']);
const authStore = useAuthStore();
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);

async function handleChangePassword() {
  error.value = "";
  if (!currentPassword.value) {
    error.value = "Please enter your current password.";
    return;
  }
  if (!newPassword.value) {
    error.value = "Please enter a new password.";
    return;
  }
  if (!confirmPassword.value) {
    error.value = "Please confirm your new password.";
    return;
  }
  if (newPassword.value.length < 8) {
    error.value = "New password must be at least 8 characters.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = "New passwords do not match.";
    return;
  }
  loading.value = true;
  try {
    // Re-authenticate user before changing password
    const user = auth.currentUser;
    await signInWithEmailAndPassword(auth, user.email, currentPassword.value);
    await updatePassword(user, newPassword.value);
    await authStore.markPasswordChanged();
    emit('update:modelValue', false);
  } catch (e) {
    if (e.code === 'auth/wrong-password') {
      error.value = "Current password is incorrect.";
    } else if (e.code === 'auth/weak-password') {
      error.value = "New password is too weak.";
    } else {
      error.value = e.message || "Failed to change password.";
    }
  }
  loading.value = false;
}
</script>
