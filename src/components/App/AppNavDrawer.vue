<template>
  <v-navigation-drawer
    v-model="drawer"
    :width="drawerWidth"
    :mini-variant="mini"
    :permanent="$vuetify.display.smAndUp"
    class="app-nav-drawer"
    :color="navColor"
  >
    <v-list density="compact" nav>
      <!-- Sidebar Navigation Items (reference style) -->
      <v-list-item
        :active="isActive('admin')"
        @click="goTo('admin')"
        class="nav-list-item"
        link
      >
        <template #prepend>
          <v-icon icon="mdi-chart-pie" />
        </template>
        <v-list-item-title>Overview</v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="isActive('workers')"
        @click="goTo('workers')"
        class="nav-list-item"
        link
      >
        <template #prepend>
          <v-icon icon="mdi-account-group" />
        </template>
        <v-list-item-title>Workers</v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="isActive('system-users')"
        @click="goTo('system-users')"
        class="nav-list-item"
        link
      >
        <template #prepend>
          <v-icon icon="mdi-account-cog" />
        </template>
        <v-list-item-title>System Users</v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="isActive('management')"
        @click="goTo('management')"
        class="nav-list-item"
        link
      >
        <template #prepend>
          <v-icon icon="mdi-briefcase" />
        </template>
        <v-list-item-title>Management</v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- ...existing code... -->
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppNavDrawer',
  data() {
    return {
      drawer: true,
      mini: false,
      drawerWidth: 260,
    };
  },
  computed: {
    navColor() {
      return this.$vuetify.theme.dark ? 'grey-darken-4' : 'grey-lighten-5';
    },
  },
  methods: {
    goTo(tab) {
      // All dashboard pages are under /dashboard/{tab}
      this.$router.push({ path: `/dashboard/${tab}` });
    },
    isActive(tab) {
      // Highlight if current route matches dashboard tab
      return this.$route.path === `/dashboard/${tab}`;
    },
  },
};
</script>
<style scoped>
.custom-side-nav {
  min-height: 100vh;
  border-right: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}
.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background 0.2s;
}
.v-list-item--active {
  background: #43a047 !important;
  color: #fff !important;
}
.v-list-item-title {
  font-weight: 500;
}
.v-list-item-icon {
  margin-right: 12px;
}
@media (max-width: 600px) {
  .custom-side-nav {
    width: 56px !important;
  }
  .v-list-item-title {
    display: none !important;
  }
}
</style>
