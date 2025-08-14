<template>
  <v-dialog :model-value="modelValue" :persistent="persistent" max-width="500px" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon :color="persistent ? 'warning' : 'primary'" class="mr-3">mdi-shield-lock-outline</v-icon>
        <span class="text-h5">{{ persistent ? 'Create New Password' : 'Change Password' }}</span>
        <v-spacer />
        <v-btn v-if="!persistent" icon flat @click="$emit('update:modelValue', false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class="pt-4">
        <p v-if="persistent" class="mb-6 text-medium-emphasis">For security reasons, you must change your default password before continuing.</p>
        <v-form>
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            :type="showCurrent ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showCurrent ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showCurrent = !showCurrent"
            variant="outlined"
            class="mb-3"
            :error-messages="errors.current"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            label="New Password"
            :type="showNew ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showNew = !showNew"
            variant="outlined"
            class="mb-3"
            hint="At least 8 characters"
            persistent-hint
            :error-messages="errors.new"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            :type="showConfirm ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showConfirm = !showConfirm"
            variant="outlined"
            :error-messages="errors.confirm"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" size="large" variant="flat" @click="handleChangePassword">Change Password</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
import { useAuthStore } from '@/stores/auth';
defineProps({ modelValue: Boolean, persistent: { type: Boolean, default: false }});
const emit = defineEmits(['update:modelValue']);
const authStore = useAuthStore();

import { ref } from 'vue';
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errors = ref({ current: '', new: '', confirm: '' });

function handleChangePassword() {
  errors.value = { current: '', new: '', confirm: '' };
  let hasError = false;
  if (!currentPassword.value) {
    errors.value.current = 'Current password is required.';
    hasError = true;
  }
  if (!newPassword.value) {
    errors.value.new = 'New password is required.';
    hasError = true;
  } else if (newPassword.value.length < 8) {
    errors.value.new = 'New password must be at least 8 characters.';
    hasError = true;
  }
  if (!confirmPassword.value) {
    errors.value.confirm = 'Please confirm your new password.';
    hasError = true;
  } else if (newPassword.value !== confirmPassword.value) {
    errors.value.confirm = 'Passwords do not match.';
    hasError = true;
  }
  if (hasError) return;
  if (authStore.isFirstLogin) {
    authStore.passwordChanged();
  }
  emit('update:modelValue', false);
}
</script>