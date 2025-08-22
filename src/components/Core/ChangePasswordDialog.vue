<template>
  <v-dialog 
    :model-value="modelValue" 
    :persistent="persistent" 
    max-width="500px"
    transition="dialog-bottom-transition"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon :color="persistent ? 'warning' : 'primary'" class="mr-3">mdi-shield-lock-outline</v-icon>
        <span class="text-h5">{{ persistent ? 'Create New Password' : 'Change Password' }}</span>
        
        <v-spacer />

        <v-btn v-if="!persistent" icon flat @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <p v-if="persistent" class="mb-6 text-medium-emphasis">
          For security reasons, you must change your temporary password before continuing.
        </p>
        
        <v-form ref="passwordForm" @submit.prevent="handleChangePassword">
          <v-text-field
            v-model="currentPassword"
            :label="persistent ? 'Temporary Password' : 'Current Password'"
            :type="showCurrentPassword ? 'text' : 'password'"
            :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showCurrentPassword = !showCurrentPassword"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="newPassword"
            label="New Password"
            :type="showNewPassword ? 'text' : 'password'"
            :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showNewPassword = !showNewPassword"
            variant="outlined"
            :rules="[rules.required, rules.minLength]"
            hint="At least 8 characters"
            persistent-hint
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            type="password"
            variant="outlined"
            :rules="[rules.required, rules.passwordMatch]"
          ></v-text-field>
        </v-form>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          border="start"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4">
        <!-- THIS IS THE NEW LOGOUT BUTTON -->
        <!-- It provides an escape hatch for users who are stuck -->
        <v-btn
          v-if="persistent"
          variant="text"
          color="grey"
          @click="handleLogout"
          :disabled="loading"
        >
          Logout
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn v-if="!persistent" text @click="closeDialog" :disabled="loading">Cancel</v-btn>
        <v-btn 
          color="primary" 
          variant="flat" 
          :loading="loading" 
          @click="handleChangePassword"
        >
          {{ persistent ? 'Set New Password' : 'Change Password' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { useAuthStore } from '@/stores/auth';

// --- PROPS & EMITS ---
const props = defineProps({ 
  modelValue: Boolean, 
  persistent: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue']);

// --- STATE MANAGEMENT ---
const authStore = useAuthStore();
const passwordForm = ref(null);
const loading = ref(false);
const errorMessage = ref('');

// --- FORM DATA ---
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

// --- VALIDATION RULES ---
const rules = {
  required: v => !!v || 'This field is required.',
  minLength: v => (v && v.length >= 8) || 'Password must be at least 8 characters long.',
  passwordMatch: v => v === newPassword.value || 'The passwords you entered do not match.',
};

// --- METHODS ---
function closeDialog() {
  emit('update:modelValue', false);
  // Reset form state when closing
  setTimeout(() => {
    passwordForm.value?.reset();
    errorMessage.value = '';
  }, 300); // Delay to allow dialog to animate out
}

/**
 * Logs the user out by calling the action in the Pinia store.
 */
function handleLogout() {
  // The authStore.logout() function handles everything:
  // signing out from Firebase, clearing local storage, and redirecting to the login page.
  authStore.logout();
}

/**
 * Handles the main logic for changing the password.
 */
async function handleChangePassword() {
  const { valid } = await passwordForm.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = '';
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    errorMessage.value = "Error: No user is currently signed in.";
    loading.value = false;
    return;
  }

  try {
    // 1. Re-authenticate the user with their current/temporary password
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
    await reauthenticateWithCredential(user, credential);
    
    // 2. Update the password in Firebase Authentication
    await updatePassword(user, newPassword.value);

    // 3. Update the 'isDefaultPassword' flag in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      isDefaultPassword: false
    });
    
    // 4. Update the local state in the Pinia store to hide the dialog
    if (props.persistent) {
      authStore.isFirstLogin = false;
    }
    
    // Close the dialog if it's a regular (non-persistent) change
    if (!props.persistent) {
      closeDialog();
    }
    
    console.log("Password updated successfully!");

  } catch (error) {
    console.error("Error updating password:", error.code);
    // Provide user-friendly error messages based on the error code
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage.value = "The temporary password you entered is incorrect. Please try again.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = "The new password is too weak. Please choose a stronger one.";
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>


 