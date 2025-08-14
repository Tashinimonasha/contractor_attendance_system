import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Ensure this path is correct

// --- Import your Views ---
import LoginView from '../views/LoginView.vue';
import AdminDashboard from '../views/Admin/AdminDashboard.vue';
import HRDashboard from '../views/HR/HRDashboard.vue';
import FinanceDashboard from '../views/Finance/FinanceDashboard.vue';
import ManagerDashboard from '../views/Manager/ManagerDashboard.vue';
import GuardScanView from '../views/Guard/GuardScanView.vue';

// --- Import the Main Layout ---
import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes = [
  // Login route is at the root path for direct access
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },

  // 2. All dashboard pages are children of the DashboardLayout
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true }, // This whole group requires login
    children: [
        // Redirect from '/' to the user's correct dashboard
      {
        path: '', // Default path for authenticated users
        redirect: to => {
          // You need to read the role from your auth store
          const authStore = useAuthStore();
          const role = authStore.userRole ? authStore.userRole.toLowerCase() : 'login';
          if (role === 'guard') return '/guard/scan';
          if (role === 'login') return '/login';
          return `/${role}`;
        }
      },
      { path: 'admin', name: 'AdminDashboard', component: AdminDashboard, meta: { role: 'Admin' } },
      { path: 'hr', name: 'HRDashboard', component: HRDashboard, meta: { role: 'HR' } },
      { path: 'finance', name: 'FinanceDashboard', component: FinanceDashboard, meta: { role: 'Finance' } },
      { path: 'manager', name: 'ManagerDashboard', component: ManagerDashboard, meta: { role: 'Manager' } },
      { path: 'workers', name: 'WorkerManagement', component: () => import('../views/WorkerManagement.vue'), meta: { role: 'All' } },
    ]
  },
  
  // 3. The Guard's scan page also stands alone
  {
    path: '/guard/scan',
    name: 'GuardScan',
    component: GuardScanView,
    meta: { requiresAuth: true, role: 'Guard' },
  },

  // 4. A catch-all redirect to send any unknown URL to the root (login) page
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- THIS IS THE CRITICAL NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // If the route requires login AND the user is NOT logged in
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect them to the login page
    next({ path: '/' });
  } 
  // If the user is trying to access the login page BUT they are already logged in
  else if (to.name === 'Login' && isAuthenticated) {
    // Send them to their correct dashboard instead
    const role = authStore.userRole.toLowerCase();
    if (role === 'guard') {
      next({ name: 'GuardScan' });
    } else {
      next({ path: `/${role}` });
    }
  } 
  // If the user is trying to access a page they don't have the role for
  else if (to.meta.role && to.meta.role !== authStore.userRole) {
     const role = authStore.userRole.toLowerCase();
     next({ path: `/${role}`});
  }
  else {
    // Otherwise, let them go to their destination
    next();
  }
});

export default router;