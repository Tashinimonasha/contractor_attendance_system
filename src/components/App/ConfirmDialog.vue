<template>
  <v-dialog :model-value="modelValue" max-width="400px" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon color="error" class="mr-2">mdi-logout</v-icon>
        <span class="text-h6">{{ title }}</span>
      </v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="handleConfirm">Yes, Sign Out</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String,
  text: String,
});
const emit = defineEmits(['update:modelValue', 'confirm']);

function handleConfirm() {
  emit('confirm');
  emit('update:modelValue', false);
}
</script>