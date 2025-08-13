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
          <v-text-field label="Current Password" type="password" variant="outlined" class="mb-3"></v-text-field>
          <v-text-field label="New Password" type="password" variant="outlined" class="mb-3" hint="At least 8 characters" persistent-hint></v-text-field>
          <v-text-field label="Confirm New Password" type="password" variant="outlined"></v-text-field>
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
import { useAuthStore } from '@/stores/auth';
defineProps({ modelValue: Boolean, persistent: { type: Boolean, default: false }});
const emit = defineEmits(['update:modelValue']);
const authStore = useAuthStore();
function handleChangePassword() {
  if (authStore.isFirstLogin) {
    authStore.passwordChanged();
  }
  emit('update:modelValue', false);
}
</script>