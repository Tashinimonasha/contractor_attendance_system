
# Copilot Instructions for Contractor Attendance System (Vue 3 + Vuetify)

## Big Picture Architecture
- **Frontend SPA**: Vue 3, Vuetify 3, Pinia (state), Vue Router (routing), Vite (build/dev).
- **No backend/API**: All business logic and data are client-side; user, role, and attendance data are mocked in `src/services/mockApi.js`.
- **Role-based dashboards**: Admin, HR, Finance, Manager, Guard. Each role has its own dashboard and navigation structure.

## Directory Structure & Key Files
- `src/components/App/`: App shell (sidebar, top bar, dialogs)
- `src/views/`: Main dashboards and feature views (AdminDashboard, WorkerManagement, etc.)
- `src/stores/auth.js`: Pinia store for authentication, user state, and role-based routing
- `src/router/index.js`: Vue Router config, navigation guards, role-based redirects
- `src/services/mockApi.js`: Mocked user/role data and login logic
- `src/components/Core/PieChart.vue`, `BarChart.vue`: Chart.js integration via vue-chartjs

## Routing, Navigation, and Role Logic
- **Dashboard routes**: All dashboards are children of `/` and use `DashboardLayout.vue`.
- **Sidebar navigation**: See `AppNavDrawer.vue` for role-based nav items and icons.
- **Navigation guards**: `src/router/index.js` uses Pinia's `auth` store to enforce authentication and role-based redirects. Example:
  ```js
  router.beforeEach((to, from, next) => {
    // Redirect to login if not authenticated
    // Redirect to correct dashboard if role mismatch
  })
  ```
- **Role-based routing**: After login, users are routed to their dashboard by role (see `routeUserToDestination()` in `auth.js`).

## State Management & Auth
- **Pinia**: Used for global state (auth, theme, language).
- **Auth flow**: Login form calls `authStore.login(email, password)`, which checks credentials via mock API and sets user/role state.
- **First login**: If user logs in with default password, triggers password change dialog.

## UI Patterns & Conventions
- **Vuetify 3**: All UI uses Vuetify components (cards, lists, nav, dialogs, tables, chips, icons).
- **Responsive design**: Vuetify grid and breakpoints for mobile/desktop layouts.
- **Sidebar (AppNavDrawer.vue)**: Navigation items use icons, highlight active route, and adapt to role.
- **Top bar (AppTopBar.vue)**: Logo, theme toggle, user menu.
- **Worker tables**: Use `v-data-table` with custom chips for status, company, contractor, etc.
- **Charts**: Pie and Bar charts use Chart.js via vue-chartjs wrappers.

## Developer Workflow
- **Install dependencies**: `npm install` (see README.md)
- **Start dev server**: `npm run dev` (Vite, hot reload)
- **Build for production**: `npm run build`
- **No test suite**: No tests or runner present.

## Integration Points
- **External dependencies**: Vuetify, Pinia, Vue Router, Chart.js, vue-chartjs
- **No backend/API**: All data and auth logic are client-side and mocked

## Example Patterns
- **Sidebar navigation**:
  ```vue
  <v-list-item :to="item.to" :prepend-icon="item.icon" :title="item.title" />
  ```
- **Pinia store usage**:
  ```js
  import { useAuthStore } from '@/stores/auth';
  const authStore = useAuthStore();
  ```
- **Worker table chips**:
  ```vue
  <v-chip :color="item.status === 'Checked In' ? 'success' : 'grey'">{{ item.status }}</v-chip>
  ```

---

If any conventions or workflows are unclear or missing, please ask for clarification or provide feedback to improve these instructions.
