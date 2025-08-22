import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { watch } from 'vue';

// Layouts & Views
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoginView from '@/views/LoginView.vue';
import AdminDashboard from '@/views/Admin/AdminDashboard.vue';
import GuardScanView from '@/views/Guard/GuardScanView.vue';


// Admin Child Views
import AdminOverview from '@/views/Admin/children/AdminOverview.vue';
import AdminWorkers from '@/views/Admin/children/AdminWorkers.vue';
import AdminManagement from '@/views/Admin/children/AdminManagement.vue';
import AdminSystemUsers from '@/views/Admin/children/AdminSystemUsers.vue';
 
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
    redirect: (to) => {
      // This redirect will be handled by the auth guard
      // The auth guard will redirect to the appropriate dashboard based on user role
      return '/login'; // Temporary, will be overridden by auth guard
    },
    children: [
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: AdminDashboard, // This is the container for admin pages
        meta: { role: 'Admin' },
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
        meta: { role: 'HR' },
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
        meta: { role: 'Finance' },
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
        meta: { role: 'Manager' },
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
// Enhanced navigation guard with better refresh handling and route restoration
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // For non-auth required routes, allow immediate access
  if (!to.meta.requiresAuth) {
    // If user is logged in and tries to access login page, redirect to their dashboard
    if (to.name === 'Login' && authStore.isAuthenticated) {
      const role = authStore.user?.role;
      if (role === 'Guard') {
        return next({ name: 'GuardScan' });
      } else if (role) {
        return next({ path: `/${role.toLowerCase()}` });
      }
    }
    return next();
  }

  // For protected routes, wait for auth state if still loading
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

  const user = authStore.user;
  const role = user?.role;

  // If no user after auth is loaded, redirect to login but preserve the intended route
  if (!user) {
    console.log('Auth required but no user found, redirecting to login');
    return next({ 
      name: 'Login',
      query: { redirect: to.fullPath } // Save attempted URL for restoration after login
    });
  }

  // If accessing root path, redirect to appropriate dashboard
  if (to.path === '/') {
    if (role === 'Guard') {
      return next({ name: 'GuardScan' });
    } else if (role) {
      return next({ path: `/${role.toLowerCase()}` });
    }
  }

  // Role-based access control
  if (to.meta.role && role !== to.meta.role) {
    console.log('Insufficient permissions, redirecting to appropriate dashboard');
    // Redirect to appropriate dashboard based on user's role
    if (role === 'Guard') {
      return next({ name: 'GuardScan' });
    } else {
      return next({ path: `/${role.toLowerCase()}` });
    }
  }

  // Allow navigation
  return next();
});

export default router;