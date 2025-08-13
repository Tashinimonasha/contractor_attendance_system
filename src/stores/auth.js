import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import { getMockUser } from '@/services/mockApi';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const isFirstLogin = ref(JSON.parse(localStorage.getItem('isFirstLogin')) || false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role);
  const welcomeMessage = computed(() => user.value ? `Welcome back, ${user.value.name}` : '');

  async function login(email, password) {
    const response = await getMockUser(email, password);
    if (!response) {
      console.error('Invalid credentials');
      return; // Stop execution
    }

    user.value = response.user;
    token.value = response.token;
    isFirstLogin.value = response.isFirstLogin;

    localStorage.setItem('user', JSON.stringify(user.value));
    localStorage.setItem('token', token.value);
    localStorage.setItem('isFirstLogin', JSON.stringify(isFirstLogin.value));

    // After login, route to the correct page
    routeUserToDestination();
  }

  function routeUserToDestination() {
    if (!user.value) return;
    
    // If it's the first login, the ChangePasswordDialog will show. No need to route yet.
    if (isFirstLogin.value) {
        if (user.value.role === 'Guard') {
           router.push({ name: 'GuardScan' }); // Guard view has its own password dialog handling
        } else {
           router.push({ name: `${user.value.role}Dashboard` });
        }
        return;
    }
    
    // For subsequent logins
    if (user.value.role === 'Guard') {
      router.push({ name: 'GuardScan' });
    } else {
      router.push({ name: `${user.value.role}Dashboard` });
    }
  }

  function passwordChanged() {
    isFirstLogin.value = false;
    localStorage.setItem('isFirstLogin', 'false');
    // After password change, route them to their final destination
    routeUserToDestination();
  }

  function logout() {
    user.value = null;
    token.value = null;
    isFirstLogin.value = false;
    localStorage.clear();
    router.push('/');
  }

  return {
    user,
    isAuthenticated,
    userRole,
    isFirstLogin,
    welcomeMessage,
    login,
    logout,
    passwordChanged,
  };
});