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
 
// Other Role Dashboards...
import HRDashboard from '@/views/HR/HRDashboard.vue';
import FinanceDashboard from '@/views/Finance/FinanceDashboard.vue';
import ManagerDashboard from '@/views/Manager/ManagerDashboard.vue';


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
      // ... Other roles like HR, Finance
      { path: 'hr', name: 'HRDashboard', component: HRDashboard, meta: { role: 'hr' } },
      { path: 'finance', name: 'FinanceDashboard', component: FinanceDashboard, meta: { role: 'finance' } },
      { path: 'manager', name: 'ManagerDashboard', component: ManagerDashboard, meta: { role: 'manager' } },
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
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // If route requires authentication and user is not logged in
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' });
  } 
  
  // If user is already logged in and tries to go to Login page
  else if (to.name === 'Login' && authStore.isAuthenticated) {
    // FIRST, check if user and role exist
    if (authStore.user && authStore.user.role) {
      const role = authStore.user.role.toLowerCase();
      if (role === 'guard') {
        return next({ name: 'GuardScan' });
      } else {
        return next({ path: `/${role}` });
      }
    } else {
      // If for some reason role is not set, go to a safe default page
      return next('/'); 
    }
  } 
  
  // If user tries to access a page that doesn't match their role
  else if (to.meta.role && authStore.user && authStore.user.role !== to.meta.role) {
    const role = authStore.user.role.toLowerCase();
     if (role === 'guard') {
      return next({ name: 'GuardScan' });
    } else {
      return next({ path: `/${role}` });
    }
  }
  
  // Otherwise, allow the navigation
  else {
    return next();
  }
});

export default router;