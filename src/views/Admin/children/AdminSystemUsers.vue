<template>
  <div>
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">System User Management</h2>
        <p class="text-medium-emphasis">Create, view, and manage system user accounts.</p>
      </div>
      <v-btn color="green" variant="flat" prepend-icon="mdi-plus" @click="openAddUserDialog">
        Add User
      </v-btn>
    </div>

    <!-- Data Table Card -->
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        System Users ({{ users.length }})
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchQuery"
          label="Search users..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 300px;"
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="userHeaders"
        :items="filteredUsers"
        :loading="tableLoading"
        :search="searchQuery"
        item-value="id"
        class="elevation-0"
        :no-data-text="tableLoading ? 'Loading user data...' : 'No users found.'"
      >
        <template #item.role="{ item }">
          <v-chip :color="getRoleColor(item.raw.role)" size="small" label>{{ item.raw.role }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" size="small" color="grey-darken-1"></v-btn>
          <v-btn icon="mdi-delete" variant="text" size="small" color="red"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add User Dialog -->
    <v-dialog v-model="userDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Create New User</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="userForm">
            <v-text-field v-model="formData.name" label="Full Name" variant="outlined" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="formData.email" label="Email" variant="outlined" :rules="[rules.required, rules.email]" class="mt-3"></v-text-field>
            <v-select v-model="formData.role" label="Role" variant="outlined" :items="availableRoles" :rules="[rules.required]" class="mt-3"></v-select>
          </v-form>
          <p class="mt-4 text-caption text-medium-emphasis">
            A temporary password will be assigned. The user will be required to change it on first login.
          </p>
          <v-alert v-if="resultMessage" :type="isError ? 'error' : 'success'" class="mt-3" dense border="start">
            {{ resultMessage }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
          <v-btn color="green" variant="flat" :loading="loading" @click="saveUser">Create User</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { getFunctions, httpsCallable } from "firebase/functions";

// --- STATE MANAGEMENT ---
const users = ref([]);
const tableLoading = ref(true);
const userDialog = ref(false);
const loading = ref(false); // For the dialog save button
const resultMessage = ref('');
const isError = ref(false);
const userForm = ref(null);
const searchQuery = ref('');
const formData = reactive({ name: '', email: '', role: null });

const availableRoles = ['Admin', 'HR', 'Finance', 'Manager', 'Guard'];
const userHeaders = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];
const rules = {
  required: v => !!v || 'This field is required.',
  email: v => /.+@.+\..+/.test(v) || 'Must be a valid email.',
};

// --- COMPUTED PROPERTIES ---
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    user.name?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query) ||
    user.role?.toLowerCase().includes(query)
  );
});

// --- METHODS ---

// Fetch all users from the backend when the page loads
async function fetchUsers() {
  tableLoading.value = true;
  try {
    const functions = getFunctions();
    const getAllUsersCallable = httpsCallable(functions, 'getAllUsers');
    const result = await getAllUsersCallable();
    
    if (result.data.status === 'success') {
      users.value = result.data.users;
    } else {
      throw new Error(result.data.error || "Failed to fetch users.");
    }

  } catch (error) {
    console.error("Error fetching users:", error);
    alert(`Could not load user data: ${error.message}`);
  } finally {
    tableLoading.value = false;
  }
}

// Call fetchUsers() automatically when the component is first mounted
onMounted(fetchUsers);

// Create a new user by calling the backend function
async function saveUser() {
  const { valid } = await userForm.value.validate();
  if (!valid) return;

  loading.value = true;
  resultMessage.value = '';
  isError.value = false;
  try {
    const functions = getFunctions();
    const createUserCallable = httpsCallable(functions, 'createUser');
    const result = await createUserCallable({ 
      name: formData.name, 
      email: formData.email, 
      role: formData.role 
    });

    resultMessage.value = result.data.message;
    await fetchUsers(); // Refresh the table with the new user
    setTimeout(closeDialog, 2000);

  } catch (error) {
    isError.value = true;
    resultMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

// Dialog management methods
function openAddUserDialog() {
  userDialog.value = true;
}

function closeDialog() {
  userDialog.value = false;
  userForm.value.reset();
  resultMessage.value = '';
  isError.value = false;
  Object.assign(formData, { name: '', email: '', role: null });
}

// Helper for styling role chips
function getRoleColor(role) {
  if (!role) return 'grey';
  const normalizedRole = role.toLowerCase();
  const colors = { 'admin': 'error', 'hr': 'primary', 'finance': 'success', 'manager': 'warning', 'guard': 'info' };
  return colors[normalizedRole] || 'grey';
}
</script>