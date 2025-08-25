<template>
  <div class="pa-4 pa-md-6">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4">System Users</h1>
        <p class="text-medium-emphasis">Manage system user accounts and permissions</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openAddUserDialog">
        Add User
      </v-btn>
    </div>

    <!-- Users Table -->
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>System Users ({{ users.length }})</span>
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search users..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 300px;"
        />
      </v-card-title>
      
      <v-data-table
        :headers="userHeaders"
        :items="filteredUsers"
        :loading="tableLoading"
        item-value="id"
        class="elevation-0"
        :no-data-text="tableLoading ? 'Loading user data...' : 'No users found.'"
      >
        <template #item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
            pill
            variant="elevated"
            class="font-weight-medium px-3"
            elevation="1"
          >
            {{ item.role }}
          </v-chip>
        </template>

        <!-- ADDED: Template slot for the Status column -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'Active' ? 'green-lighten-2' : 'grey-lighten-2'"
            size="small"
            pill
            variant="elevated"
            elevation="1"
          >
            {{ item.status }}
          </v-chip>
        </template>
        
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="editUser(item)" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteUser(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit User Dialog -->
    <v-dialog v-model="userDialog" max-width="600px" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-h5">
          {{ isEditing ? 'Edit User' : 'Add New User' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="userForm">
            <v-text-field v-model="formData.name" label="Full Name" variant="outlined" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="formData.email" label="Email" variant="outlined" type="email" :rules="[rules.required, rules.email]" class="mt-3"></v-text-field>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select v-model="formData.role" label="Role" variant="outlined" :items="availableRoles" :rules="[rules.required]" class="mt-3"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <!-- ADDED: Status dropdown in the form -->
                <v-select v-model="formData.status" label="Status" variant="outlined" :items="['Active', 'Inactive']" :rules="[rules.required]" class="mt-3"></v-select>
              </v-col>
            </v-row>
          </v-form>
          <p v-if="!isEditing" class="mt-4 text-caption text-medium-emphasis">
            A temporary password ('Password@123##abcABC') will be assigned.
          </p>
          <v-alert v-if="resultMessage" :type="isError ? 'error' : 'success'" class="mt-4" dense border="start">
            {{ resultMessage }}
          </v-alert>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeUserDialog" :disabled="loading">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="loading">
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { httpsCallable } from "firebase/functions";
import { functions } from '@/firebase';

// --- STATE ---
const users = ref([]);
const tableLoading = ref(true);
const userDialog = ref(false);
const isEditing = ref(false);
const editingUser = ref(null);
const loading = ref(false);
const resultMessage = ref('');
const isError = ref(false);
const userForm = ref(null);
const searchQuery = ref('');

// ADDED 'status' to the form data
const defaultFormData = { id: null, name: '', email: '', role: null, status: 'Active' };
const formData = reactive({ ...defaultFormData });

const availableRoles = ['Admin', 'HR', 'Finance', 'Manager', 'Guard'];

// ADDED 'Status' to the table headers
const userHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
];
const rules = {
  required: value => !!value || 'This field is required',
  email: value => /.+@.+\..+/.test(value) || 'Please enter a valid email address',
};

// --- COMPUTED ---
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return users.value.filter(user => 
    (user.name?.toLowerCase().includes(query)) ||
    (user.email?.toLowerCase().includes(query)) ||
    (user.role?.toLowerCase().includes(query)) ||
    (user.status?.toLowerCase().includes(query))
  );
});

// --- METHODS ---
async function fetchUsers() {
  tableLoading.value = true;
  try {
    const getAllUsersCallable = httpsCallable(functions, 'getAllUsers');
    const result = await getAllUsersCallable();
    if (result.data.status === 'success') {
      users.value = result.data.users || [];
    } else {
      throw new Error(result.data.error || "Unknown error fetching users.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    resultMessage.value = `Error: ${error.message}`;
    isError.value = true;
  } finally {
    tableLoading.value = false;
  }
}

onMounted(fetchUsers);

async function saveUser() {
  const { valid } = await userForm.value.validate();
  if (!valid) return;

  loading.value = true;
  resultMessage.value = '';
  isError.value = false;

  try {
    if (isEditing.value) {
      // Logic for updating an existing user
      const updateUserCallable = httpsCallable(functions, 'updateUser');
      const result = await updateUserCallable({
        uid: formData.id,
        name: formData.name,
        email: formData.email, // Send email for consistency
        role: formData.role,
        status: formData.status, // ADDED 'status' to the payload
      });
      resultMessage.value = result.data.message;
    } else {
      // Logic for creating a new user
      const createUserCallable = httpsCallable(functions, 'createUser');
      const result = await createUserCallable({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status, // ADDED 'status' to the payload
      });
      resultMessage.value = result.data.message;
    }
    
    await fetchUsers();
    setTimeout(closeUserDialog, 3000);

  } catch (error) {
    console.error('Error saving user:', error);
    isError.value = true;
    resultMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

function openAddUserDialog() {
  isEditing.value = false;
  Object.assign(formData, defaultFormData);
  userDialog.value = true;
}

function closeUserDialog() {
  userDialog.value = false;
  setTimeout(() => {
    isEditing.value = false;
    editingUser.value = null;
    userForm.value?.reset();
    resultMessage.value = '';
    isError.value = false;
    Object.assign(formData, defaultFormData);
  }, 300);
}

function editUser(user) {
  isEditing.value = true;
  editingUser.value = { ...user };
  Object.assign(formData, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || 'Active', // ADDED status to the edit form
  });
  userDialog.value = true;
}

async function deleteUser(user) {
  if (!confirm(`Are you sure you want to deactivate user ${user.name}?`)) {
    return;
  }
  
  loading.value = true;
  
  try {
    const deactivateUserCallable = httpsCallable(functions, 'deactivateUser');
    const result = await deactivateUserCallable({ userId: user.id });
    
    resultMessage.value = result.data.message || 'User was deactivated successfully';
    isError.value = false;
    
    // Refresh the user list
    await fetchUsers();
    
  } catch (error) {
    console.error('Error deactivating user:', error);
    resultMessage.value = error.message || 'Failed to deactivate user';
    isError.value = true;
  } finally {
    loading.value = false;
  }
}

function getRoleColor(role) {
  const roleColors = {
    'Admin': 'purple-lighten-2',
    'HR': 'blue-lighten-2',
    'Finance': 'green-lighten-2',
    'Manager': 'amber-lighten-2',
    'Guard': 'cyan-lighten-2',
    'default': 'grey-lighten-3'
  };
  
  return roleColors[role] || roleColors.default;
}
</script>

<style scoped>
/* Make role chips more attractive */
.v-chip {
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.6);
  transition: all 0.2s ease-in-out;
  min-width: 75px;
  text-align: center;
  justify-content: center;
}

.v-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}
</style>