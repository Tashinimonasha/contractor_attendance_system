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
        item-value="id"
        class="elevation-0"
        :no-data-text="tableLoading ? 'Loading user data...' : 'No users found.'"
      >
        <template #item.role="{ item }">
          <v-chip v-if="item.role" :color="getRoleColor(item.role)" size="small">
            {{ item.role }}
          </v-chip>
          <v-chip v-else color="grey" size="small">No Role</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" size="small" color="grey-darken-1" @click="editUser(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" size="small" color="red" @click="deleteUser(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit User Dialog -->
    <v-dialog v-model="userDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Edit User' : 'Create New User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="userForm">
            <v-text-field v-model="formData.name" label="Full Name" variant="outlined" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="formData.email" label="Email" variant="outlined" :rules="[rules.required, rules.email]" class="mt-3"></v-text-field>
            <v-select v-model="formData.role" label="Role" variant="outlined" :items="availableRoles" :rules="[rules.required]" class="mt-3"></v-select>
          </v-form>
          <p v-if="!isEditing" class="mt-4 text-caption text-medium-emphasis">
            A temporary password will be assigned. The user must change it on first login.
          </p>
          <v-alert v-if="resultMessage" :type="isError ? 'error' : 'success'" class="mt-3" dense border="start">
            {{ resultMessage }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
          <v-btn color="green" variant="flat" :loading="loading" @click="saveUser">
            {{ isEditing ? 'Update User' : 'Create User' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
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

// Define the default structure for the form data
const defaultFormData = { id: null, name: '', email: '', role: null };
// Create the reactive object using the default structure
const formData = reactive({ ...defaultFormData });

const availableRoles = ['Admin', 'HR', 'Finance', 'Manager', 'Guard'];
const userHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];
const rules = {
  required: v => !!v || 'Required.',
  email: v => /.+@.+\..+/.test(v) || 'Invalid email.',
};

// --- COMPUTED ---
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
async function fetchUsers() {
  tableLoading.value = true;
  resultMessage.value = '';
  isError.value = false;
  
  try {
    // Using the httpsCallable method since getAllUsers is defined as an https.onCall function
    const getAllUsersCallable = httpsCallable(functions, 'getAllUsers');
    const result = await getAllUsersCallable();
    
    console.log("fetchUsers result:", result);
    
    if (result.data && result.data.status === 'success') {
      users.value = result.data.users || [];
      
      // Log the users for debugging
      console.log(`Successfully loaded ${users.value.length} users`);
    } else {
      console.error("Unexpected result structure:", result);
      users.value = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    
    // Extract error message from Firebase callable response
    let errorMessage = "Failed to load users. Please try again.";
    if (error.code === 'functions/permission-denied') {
      errorMessage = "You don't have permission to view users.";
    } else if (error.details) {
      errorMessage = error.details;
    }
    
    resultMessage.value = errorMessage;
    isError.value = true;
    users.value = [];
  } finally {
    tableLoading.value = false;
  }
}

onMounted(fetchUsers);

async function saveUser() {
  console.log("--- saveUser function initiated ---");
  // Log the formData state IMMEDIATELY to see what the form bindings have done.
  console.log("1. formData state at start:", JSON.stringify(formData));

  const { valid } = await userForm.value.validate();
  if (!valid) {
    console.error("Form is not valid.");
    return;
  }

  loading.value = true;
  resultMessage.value = '';
  isError.value = false;

  try {
    if (isEditing.value) {
      // Update user using the callable function
      const updateUserCallable = httpsCallable(functions, 'updateUser');
      
      const payload = {
        userId: formData.id,
        name: formData.name,
        role: formData.role,
      };
      
      console.log("2. Update payload:", JSON.stringify(payload));
      
      const result = await updateUserCallable(payload);
      resultMessage.value = result.data.message || 'User updated successfully';
    } else {
      // Create user using the callable function
      const createUserCallable = httpsCallable(functions, 'createUserCallable');
      
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      console.log("2. Create payload:", JSON.stringify(payload));
      
      // Final check before sending
      if (!payload.name || !payload.email || !payload.role) {
        throw new Error("Data is missing. Check form values.");
      }
      
      const result = await createUserCallable(payload);
      resultMessage.value = result.data.message || 'User created successfully';
    }

    await fetchUsers();
    setTimeout(closeDialog, 2000);
  } catch (error) {
    console.error("Error saving user:", error);
    isError.value = true;
    
    // Extract error message from Firebase callable response
    let errorMessage = error.message;
    if (error.code === 'functions/permission-denied') {
      errorMessage = "You don't have permission to perform this action.";
    } else if (error.code === 'functions/already-exists') {
      errorMessage = "A user with this email already exists.";
    } else if (error.code === 'functions/invalid-argument') {
      errorMessage = "Please fill out all required fields.";
    } else if (error.details) {
      errorMessage = error.details;
    }
    
    resultMessage.value = errorMessage;
  } finally {
    loading.value = false;
  }
}

function openAddUserDialog() {
  isEditing.value = false;
  Object.assign(formData, defaultFormData); // Reset to defaults
  userDialog.value = true;
}

function closeDialog() {
  userDialog.value = false;
  setTimeout(() => {
    userForm.value?.reset();
    resultMessage.value = '';
    isError.value = false;
    Object.assign(formData, defaultFormData);
  }, 300);
}

function editUser(user) {
  isEditing.value = true;
  editingUser.value = { ...user };
  // Set the form data with the user's current values
  Object.assign(formData, {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || null
  });
  userDialog.value = true;
}

async function deleteUser(user) {
  // Since we're interfacing with Firebase, we're using deactivateUser instead of deleteUser
  // to avoid conflicts with Firebase's built-in deleteUser function
  if (confirm(`Are you sure you want to deactivate user ${user.name}?`)) {
    try {
      loading.value = true;
      
      // Call the deactivateUser callable function
      const deactivateUserCallable = httpsCallable(functions, 'deactivateUser');
      
      const result = await deactivateUserCallable({ 
        userId: user.id 
      });
      
      // Show success message
      alert(result.data.message || "User deactivated successfully");
      
      // Refresh the user list
      await fetchUsers();
    } catch (error) {
      console.error("Error deactivating user:", error);
      
      // Extract error message from Firebase callable response
      let errorMessage = error.message;
      if (error.code === 'functions/permission-denied') {
        errorMessage = "You don't have permission to deactivate users.";
      } else if (error.code === 'functions/failed-precondition') {
        errorMessage = "You cannot deactivate your own account.";
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      alert("Error: " + errorMessage);
    } finally {
      loading.value = false;
    }
  }
}

function getRoleColor(role) {
  const roleColors = {
    'Admin': 'purple',
    'HR': 'blue',
    'Finance': 'green',
    'Manager': 'orange',
    'Guard': 'cyan'
  };
  
  return roleColors[role] || 'grey';
}
</script>