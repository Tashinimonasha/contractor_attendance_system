import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Layouts & Views
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoginView from '@/views/LoginView.vue';
import AdminDashboard from '@/views/Admin/AdminDashboard.vue';
import GuardScanView from '@/views/Guard/GuardScanView.vue';


// Admin Child Views
import AdminOverview from '@/views/Admin/children/AdminOverview.vue';
import AdminWorkers from '@/views/Admin/children/AdminWorkers.vue';
import AdminManagement from '@/views/Admin/children/AdminManagement.vue';
 
// HR Views
import HRDashboard from '@/views/HR/HRDashboard.vue';
import HROverview from '@/views/HR/children/HROverview.vue';
import HRWorkers from '@/views/HR/children/HRWorkers.vue';

// Finance Views
import FinanceDashboard from '@/views/Finance/FinanceDashboard.vue';
import FinanceOverview from '@/views/Finance/children/FinanceOverview.vue';
import FinanceWorkers from '@/views/Finance/children/FinanceWorkers.vue';

// Manager Views
import ManagerDashboard from '@/views/Manager/ManagerDashboard.vue';
import ManagerOverview from '@/views/Manager/children/ManagerOverview.vue';
import ManagerWorkers from '@/views/Manager/children/ManagerWorkers.vue';


const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: AdminDashboard, // This is the container for admin pages
        meta: { role: 'admin' },
        children: [
          { path: '', redirect: '/admin/overview' }, // Default redirect
          { path: 'overview', name: 'AdminOverview', component: AdminOverview },
          { path: 'workers', name: 'AdminWorkers', component: AdminWorkers },
          { path: 'management', name: 'AdminManagement', component: AdminManagement },
        ]
      },
      // HR Dashboard and Children
      {
        path: 'hr',
        name: 'HRDashboard',
        component: HRDashboard,
        meta: { role: 'hr' },
        children: [
          { path: '', redirect: '/hr/overview' }, // Default redirect
          { path: 'overview', name: 'HROverview', component: HROverview },
          { path: 'workers', name: 'HRWorkers', component: HRWorkers },
        ]
      },
      // Finance Dashboard and Children
      {
        path: 'finance',
        name: 'FinanceDashboard',
        component: FinanceDashboard,
        meta: { role: 'finance' },
        children: [
          { path: '', redirect: '/finance/overview' }, // Default redirect
          { path: 'overview', name: 'FinanceOverview', component: FinanceOverview },
          { path: 'workers', name: 'FinanceWorkers', component: FinanceWorkers },
        ]
      },
      // Manager Dashboard and Children
      {
        path: 'manager',
        name: 'ManagerDashboard',
        component: ManagerDashboard,
        meta: { role: 'manager' },
        children: [
          { path: '', redirect: '/manager/overview' }, // Default redirect
          { path: 'overview', name: 'ManagerOverview', component: ManagerOverview },
          { path: 'workers', name: 'ManagerWorkers', component: ManagerWorkers },
        ]
      },
    ],
  },
  {
    path: '/guard/scan',
    name: 'GuardScan',
    component: GuardScanView,
    meta: { requiresAuth: true, role: 'Guard' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// src/router/index.js
 

// --- NAVIGATION GUARD ---
// This logic is now corrected to prevent the 'toLowerCase of undefined' error.
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // If auth is still initializing, wait for it
  if (authStore.isLoading) {
    await new Promise(resolve => {
      const unwatch = watch(
        () => authStore.isLoading,
        (loading) => {
          if (!loading) {
            unwatch();
            resolve();
          }
        },
        { immediate: true }
      );
    });
  }

  // Get cached user from localStorage if available
  const cachedUser = localStorage.getItem('user');
  const user = authStore.user || (cachedUser ? JSON.parse(cachedUser) : null);

  // If route requires auth and no user is found
  if (to.meta.requiresAuth && !user) {
    return next({ name: 'Login' });
  }

  // If user exists and tries to access login page
  if (to.name === 'Login' && user?.role) {
    const role = user.role.toLowerCase();
    return next(role === 'guard' ? { name: 'GuardScan' } : { path: `/${role}` });
  }

  // Check role-based access
  if (to.meta.role && user?.role && user.role.toLowerCase() !== to.meta.role.toLowerCase()) {
    const role = user.role.toLowerCase();
    return next(role === 'guard' ? { name: 'GuardScan' } : { path: `/${role}` });
  }

  // Allow navigation
  return next();
});

export default router;