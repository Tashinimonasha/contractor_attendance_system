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
        meta: { role: 'Admin' },
        children: [
          { path: '', redirect: '/admin/overview' }, // Default redirect
          { path: 'overview', name: 'AdminOverview', component: AdminOverview },
          { path: 'workers', name: 'AdminWorkers', component: AdminWorkers },
          { path: 'management', name: 'AdminManagement', component: AdminManagement },
        ]
      },
      // ... Other roles like HR, Finance
      { path: 'hr', name: 'HRDashboard', component: HRDashboard, meta: { role: 'HR' } },
      { path: 'finance', name: 'FinanceDashboard', component: FinanceDashboard, meta: { role: 'Finance' } },
      { path: 'manager', name: 'ManagerDashboard', component: ManagerDashboard, meta: { role: 'Manager' } },
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

// Your existing router.beforeEach guard logic remains the same
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    const role = authStore.userRole.toLowerCase();
    if (role === 'guard') {
      next({ name: 'GuardScan' });
    } else {
      next({ path: `/${role}` });
    }
  } else if (to.meta.role && to.meta.role !== authStore.userRole) {
    const role = authStore.userRole.toLowerCase();
     if (role === 'guard') {
      next({ name: 'GuardScan' });
    } else {
      next({ path: `/${role}` });
    }
  }
  else {
    next();
  }
});

export default router;