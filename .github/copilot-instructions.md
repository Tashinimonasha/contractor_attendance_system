# Copilot Instructions for Contractor Attendance System (Vuetify + Vue 3)

## Project Architecture
- **Frontend SPA** built with Vue 3, Vuetify 3, Pinia (state), Vue Router (routing), and Vite (build/dev).
- **Directory Structure:**
  - `src/components/App/`: App shell components (sidebar, top bar, dialogs)
  - `src/views/`: Main dashboard and feature views (AdminDashboard, WorkerManagement, etc.)
  - `src/stores/`: Pinia stores for auth, theme, language
  - `src/router/`: Vue Router config and route guards
  - `src/layouts/`: Layout wrappers (e.g., DashboardLayout)
  - `src/services/`: API mocks and service logic
  - `src/assets/`, `src/styles/`: Static assets and global styles

## Routing & Navigation
- **All dashboard pages** are children of `/dashboard` route, rendered via `DashboardLayout.vue`.
- **Sidebar navigation** (`AppNavDrawer.vue`) uses `@click` and `router.push` to switch between dashboard subpages (e.g., `/dashboard/admin`, `/dashboard/workers`).
- **Role-based redirects** and access control are handled in `src/router/index.js` using Pinia's `auth` store.

## State Management
- **Pinia** is used for global state (auth, theme, language). Stores are in `src/stores/`.
- **Auth store** controls login state, user role, and first-login password change prompt.

## UI Patterns & Conventions
- **Vuetify 3** components for all UI (cards, lists, nav, dialogs, tables, chips, icons).
- **Theme switching** (dark/light) is handled via Pinia and Vuetify theme API.
- **Responsive design**: All layouts/components use Vuetify grid and breakpoints for mobile support.
- **Sidebar (AppNavDrawer.vue)**: Navigation items use icons and highlight active route. No logo/text at top per user request.
- **Top bar (AppTopBar.vue)**: Shows logo, theme toggle, user menu.

## Analytics & Tables
- **Charts**: Pie and Bar charts use Chart.js via `vue-chartjs` (see `src/components/Core/PieChart.vue`, `BarChart.vue`).
- **Worker Management Table**: Only shown in `WorkerManagement.vue` (not in dashboard view). Uses Vuetify `v-data-table` with custom chips and actions.

## Developer Workflow
- **Install dependencies**: `npm install` (see README.md)
- **Start dev server**: `npm run dev` (Vite, hot reload)
- **Build for production**: `npm run build`
- **No backend integration**: All data is mocked in `src/services/mockApi.js`.
- **No test suite**: No tests or test runner present.

## Integration Points
- **External dependencies**: Vuetify, Pinia, Vue Router, Chart.js, vue-chartjs
- **No backend/API**: All logic is client-side and mock data
- **No authentication provider**: Auth is simulated via Pinia store

## Example Patterns
- **Sidebar navigation**:
  ```vue
  <v-list-item @click="goTo('workers')" :active="isActive('workers')">...</v-list-item>
  ```
- **Route guard**:
  ```js
  router.beforeEach((to, from, next) => { /* ...auth logic... */ })
  ```
- **Pinia store usage**:
  ```js
  import { useAuthStore } from '@/stores/auth';
  const authStore = useAuthStore();
  ```

## Key Files
- `src/components/App/AppNavDrawer.vue` (sidebar)
- `src/components/App/AppTopBar.vue` (top bar)
- `src/views/Admin/AdminDashboard.vue` (dashboard)
- `src/views/WorkerManagement.vue` (worker table)
- `src/router/index.js` (routing/guards)
- `src/stores/auth.js` (auth state)
- `src/components/Core/PieChart.vue`, `BarChart.vue` (charts)

---

If any conventions or workflows are unclear, please ask for clarification or provide feedback to improve these instructions.
