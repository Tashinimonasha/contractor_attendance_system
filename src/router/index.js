import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
// Import the necessary Firebase Auth functions
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase';

// --- Import Layouts & Views ---
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoginView from '@/views/LoginView.vue';
import GuardScanView from '@/views/Guard/GuardScanView.vue';
import AdminDashboard from '@/views/Admin/AdminDashboard.vue';
import HRDashboard from '@/views/HR/HRDashboard.vue';
import FinanceDashboard from '@/views/Finance/FinanceDashboard.vue';
import ManagerDashboard from '@/views/Manager/ManagerDashboard.vue';
import AdminOverview from '@/views/Admin/children/AdminOverview.vue';
import AdminWorkers from '@/views/Admin/children/AdminWorkers.vue';
import AdminManagement from '@/views/Admin/children/AdminManagement.vue';
import AdminSystemUsers from '@/views/Admin/children/AdminSystemUsers.vue';

// --- ROUTE DEFINITIONS ---
const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardRedirect',
        redirect: () => {
          const authStore = useAuthStore();
          const role = authStore.user?.role;
          if (role) {
            if (role === 'Guard') return { name: 'GuardScan' };
            return { path: `/${role.toLowerCase()}` };
          }
          return { name: 'Login' }; // Fallback
        },
      },
      // Admin Route
      {
        path: 'admin',
        component: AdminDashboard,
        meta: { role: 'Admin' },
        redirect: { name: 'AdminOverview' }, 
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
  { path: '/guard/scan', name: 'GuardScan', component: GuardScanView, meta: { requiresAuth: true, role: 'Guard' } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'Login' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
 
/**
 * Helper function to wait for Firebase Auth to initialize.
 * It returns the current user or null.
 */
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener(); // We only need the initial state, so we unsubscribe immediately.
        resolve(user);
      },
      reject
    );
  });
};

/**
 * This is the main navigation guard that protects all routes.
 * It is now `async` to allow us to `await` the Firebase auth check.
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth) {
    // If the route requires authentication, we wait for Firebase to confirm the user's status.
    const currentUser = await getCurrentUser();
    
    if (currentUser) {
      // User has a valid session with Firebase.
      // If the Pinia store is empty (e.g., after a page refresh), we need to fill it.
      if (!authStore.user?.role) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          authStore.user = { uid: currentUser.uid, ...userDocSnap.data() };
        } else {
          // If the profile is missing, something is wrong. Log them out.
          await authStore.logout();
          return next({ name: 'Login' });
        }
      }
      
      // Now that the store is populated, we can perform role checks.
      const userRole = authStore.user?.role;
      if (to.meta.role && userRole !== to.meta.role) {
        // Role mismatch, redirect to their own dashboard.
        return next({ path: `/${userRole.toLowerCase()}` });
      }
      // If all checks pass, allow navigation.
      return next();
    } else {
      // User has no valid session, send them to the login page.
      return next({ name: 'Login' });
    }
  } 
  // For public routes (like /login)
  else {
    return next();
  }
});

export default router;