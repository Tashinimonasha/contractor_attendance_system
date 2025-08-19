<template>
  <v-dialog :model-value="modelValue" max-width="400px" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-3">mdi-lock-reset</v-icon>
        <span class="text-h5">Forgot Password</span>
        <v-spacer />
        <v-btn icon flat @click="$emit('update:modelValue', false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class="pt-4">
        <p class="mb-6 text-medium-emphasis">Enter your email address and we'll send you a password reset link.</p>
        <v-form @submit.prevent="handleReset">
          <v-text-field
            v-model="email"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            required
            :error-messages="error"
          ></v-text-field>
          <v-btn color="primary" block class="mt-4" type="submit" :loading="loading">Send Reset Link</v-btn>
        </v-form>
        <div v-if="success" class="mt-4 text-success" style="font-size: 0.95rem; text-align: center;">
          <v-alert type="success" border="start" elevation="2" dense>
            Password reset email sent! Check your inbox.
          </v-alert>
        </div>
        <div v-if="error && error.includes('No account found')" class="mt-4 text-error" style="font-size: 0.95rem; text-align: center;">
          <v-alert type="error" border="start" elevation="2" dense>
            No account found for this email.<br>
            Please contact your administrator:<br>
            <strong>Email:</strong> admin@printcare.com<br>
            <strong>Phone:</strong> +94 11 1234567
          </v-alert>
        </div>
        <div class="mt-6 text-medium-emphasis" style="font-size: 0.95rem; text-align: center;">
          <v-divider class="mb-2" />
          <span>Need help? Contact admin at <strong>admin@printcare.com</strong> or <strong>+94 11 1234567</strong></span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '@/firebase';
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue']);
const email = ref("");
const error = ref("");
const success = ref(false);
const loading = ref(false);

async function handleReset() {
  error.value = "";
  success.value = false;
  if (!email.value) {
    error.value = "Email is required.";
    return;
  }
  loading.value = true;
  try {
    await sendPasswordResetEmail(auth, email.value);
    success.value = true;
  } catch (e) {
    error.value = e.message.includes('user-not-found') ? "No account found for this email." : "Failed to send reset email.";
  }
  loading.value = false;
}
</script>
