<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :rail="railMode"
    :expand-on-hover="isDesktop"
    :temporary="!isDesktop"
    app
  >
    <!-- Logo -->
    <v-list-item class="pa-3" nav>
      <v-list-item-avatar start>
        <v-img :src="logo" width="200"></v-img>
      </v-list-item-avatar>
      
      <template v-if="!isDesktop" v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="$emit('update:modelValue', false)"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <!-- Navigation Links -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="lg"
        class="mx-2 my-1"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useDisplay } from 'vuetify';
import { computed } from 'vue';
import logo from '@/assets/printcareLogo.png';

const props = defineProps({ modelValue: Boolean });
defineEmits(['update:modelValue']);

const { mdAndUp: isDesktop } = useDisplay();
const authStore = useAuthStore();

// The navigation drawer should be in "rail" mode (small icons) ONLY on desktop
// when it is not being hovered. We control this manually.
const railMode = computed(() => {
  return isDesktop.value && props.modelValue;
});

const navItems = computed(() => {
  const role = authStore.user?.role;
  const lowerRole = role?.toLowerCase();
  if (role === 'Admin') {
    return [
      { title: 'Overview', icon: 'mdi-view-dashboard-outline', to: '/admin/overview' },
      { title: 'Workers', icon: 'mdi-account-hard-hat-outline', to: '/admin/workers' },
      { title: 'System Users', icon: 'mdi-account-group-outline', to: '/admin/system-users' },
      { title: 'Management', icon: 'mdi-cog-outline', to: '/admin/management' },
    ];
  } else if (role === 'HR' || role === 'Finance' || role === 'Manager') {
    return [
      { title: 'Overview', icon: 'mdi-view-dashboard-outline', to: `/${lowerRole}/overview` },
      { title: 'Workers', icon: 'mdi-account-hard-hat-outline', to: `/${lowerRole}/workers` },
    ];
  } else {
    return [
      { title: 'Overview', icon: 'mdi-view-dashboard-outline', to: '/overview' },
      { title: 'Workers', icon: 'mdi-account-hard-hat-outline', to: '/workers' },
    ];
  }
});
</script>