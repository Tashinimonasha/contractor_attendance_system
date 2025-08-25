import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// --- Import Layouts & Standalone Views ---
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoginView from '@/views/LoginView.vue';
import GuardScanView from '@/views/Guard/GuardScanView.vue';

// --- Import ALL Your Dashboard "Container" Components ---
const AdminDashboard = () => import('@/views/Admin/AdminDashboard.vue');
const HRDashboard = () => import('@/views/HR/HRDashboard.vue');
const FinanceDashboard = () => import('@/views/Finance/FinanceDashboard.vue');
const ManagerDashboard = () => import('@/views/Manager/ManagerDashboard.vue');

// --- Import Your "Child" Page Components ---
const AdminOverview = () => import('@/views/Admin/children/AdminOverview.vue');
const AdminWorkers = () => import('@/views/Admin/children/AdminWorkers.vue');
const AdminManagement = () => import('@/views/Admin/children/AdminManagement.vue');
const AdminSystemUsers = () => import('@/views/Admin/children/AdminSystemUsers.vue');

// --- THE ROUTE DEFINITIONS ---
const routes = [
  // Public route
  { path: '/login', name: 'Login', component: LoginView },
  
  // Protected routes that share the main DashboardLayout
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      // A default route that automatically redirects any logged-in user
      {
        path: '',
        name: 'DashboardRedirect',
        redirect: () => {
          const authStore = useAuthStore();
          const role = authStore.user?.role;
          if (role) {
            if (role === 'Guard') return { name: 'GuardScan' };
            // Redirects to /admin, /hr, etc. based on the capitalized role
            return { path: `/${role.toLowerCase()}` };
          }
          // Fallback if role is somehow missing after login
          return { name: 'Login' };
        },
      },
      // Admin Route
      {
        path: 'admin',
        component: AdminDashboard,
        meta: { role: 'Admin' },
        redirect: { name: 'AdminOverview' }, // Redirect /admin to its default child
        children: [
          { path: 'overview', name: 'AdminOverview', component: AdminOverview },
          { path: 'workers', name: 'AdminWorkers', component: AdminWorkers },
          { path: 'system-users', name: 'AdminSystemUsers', component: AdminSystemUsers },
          { path: 'management', name: 'AdminManagement', component: AdminManagement },
        ]
      },
      // HR Route
      {
        path: 'hr',
        component: HRDashboard,
        meta: { role: 'HR' },
        redirect: { name: 'HROverview' },
        children: [
          { path: 'overview', name: 'HROverview', component: () => import('@/views/HR/children/HROverview.vue') },
          { path: 'workers', name: 'HRWorkers', component: () => import('@/views/HR/children/HRWorkers.vue') },
        ]
      },
      // Finance Route
      {
        path: 'finance',
        component: FinanceDashboard,
        meta: { role: 'Finance' },
        redirect: { name: 'FinanceOverview' },
        children: [
          { path: 'overview', name: 'FinanceOverview', component: () => import('@/views/Finance/children/FinanceOverview.vue') },
          { path: 'workers', name: 'FinanceWorkers', component: () => import('@/views/Finance/children/FinanceWorkers.vue') },
        ]
      },
      // Manager Route
      {
        path: 'manager',
        component: ManagerDashboard,
        meta: { role: 'Manager' },
        redirect: { name: 'ManagerOverview' },
        children: [
          { path: 'overview', name: 'ManagerOverview', component: () => import('@/views/Manager/children/ManagerOverview.vue') },
          { path: 'workers', name: 'ManagerWorkers', component: () => import('@/views/Manager/children/ManagerWorkers.vue') },
        ]
      },
    ]
  },
  // Guard Route (does not use the main layout)
  {
    path: '/guard/scan',
    name: 'GuardScan',
    component: GuardScanView,
    meta: { requiresAuth: true, role: 'Guard' }
  },
  // Catch-all for any unknown URL, redirects to login
  { path: '/:pathMatch(.*)*', redirect: { name: 'Login' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- THE NEW, SIMPLIFIED, AND ROBUST NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role; // e.g., 'Admin', 'HR'

  // If the route requires authentication AND the user is NOT logged in...
  if (to.meta.requiresAuth && !isAuthenticated) {
    // ...redirect to the login page.
    return next({ name: 'Login' });
  }

  // If the user is ALREADY logged in AND is trying to access the login page...
  if (isAuthenticated && to.name === 'Login') {
    // ...don't let them. Send them to their default dashboard instead.
    const homePath = userRole ? `/${userRole.toLowerCase()}` : '/';
    return next({ path: homePath });
  }
  
  // If the user is ALREADY logged in AND is trying to access a page they don't have permission for...
  if (isAuthenticated && to.meta.role && userRole !== to.meta.role) {
      // ...don't let them. Send them back to their own dashboard.
      const homePath = `/${userRole.toLowerCase()}`;
      return next({ path: homePath });
  }

  // Otherwise, the navigation is valid, so allow it.
  return next();
});

export default router;