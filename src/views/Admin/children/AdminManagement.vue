<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">System Management</h2>
      <p class="text-medium-emphasis">Manage core business entities like companies and departments.</p>
    </div>

    <!-- Loading Overlay -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>

    <!-- Three Column Layout for Management Cards -->
    <v-row v-if="!loading">
      <!-- Companies Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-domain</v-icon>
            Companies ({{ companies.length }})
            <v-spacer></v-spacer>
            <v-btn color="blue" variant="flat" size="small" @click="openDialog('Company')">+ Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="py-0">
            <v-list-item v-for="c in companies" :key="c.id" :title="c.name" :subtitle="c.fullName">
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange" @click="openDialog('Company', c)"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red" @click="openDeleteDialog('Company', c)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Departments Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-office-building-outline</v-icon>
            Departments ({{ departments.length }})
            <v-spacer></v-spacer>
            <v-btn color="green" variant="flat" size="small" @click="openDialog('Department')">+ Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="py-0">
            <v-list-item v-for="d in departments" :key="d.id" :title="d.name" :subtitle="d.companyname">
               <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange" @click="openDialog('Department', d)"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red" @click="openDeleteDialog('Department', d)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Contractors Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-account-hard-hat</v-icon>
            Contractors ({{ contractors.length }})
            <v-spacer></v-spacer>
            <v-btn color="purple" variant="flat" size="small" @click="openDialog('Contractor')">+ Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="py-0">
             <v-list-item v-for="c in contractors" :key="c.id" :title="c.name" :subtitle="getContractorDepartments(c)">
               <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange" @click="openDialog('Contractor', c)"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red" @click="openDeleteDialog('Contractor', c)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Generic Add/Edit Dialog -->
    <v-dialog v-model="dialog.show" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5">{{ dialog.isEditing ? 'Edit' : 'Add New' }} {{ dialog.type }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <div v-if="dialog.type === 'Company'">
              <v-text-field v-model="formData.name" label="Company Name (e.g., PUL)" :rules="[rules.required]"></v-text-field>
    
            </div>
            <div v-if="dialog.type === 'Department'">
              <v-text-field v-model="formData.name" label="Department Name" :rules="[rules.required]"></v-text-field>
              <v-select v-model="formData.companyId" label="Assign to Company" :items="companies" item-title="name" item-value="id" :rules="[rules.required]" class="mt-2"></v-select>
            </div>
            <div v-if="dialog.type === 'Contractor'">
              <v-text-field v-model="formData.name" label="Contractor Name" :rules="[rules.required]"></v-text-field>
              <v-select v-model="formData.assignedDepartments" label="Assign to Departments" :items="departments" item-title="name" item-value="id" multiple chips closable-chips class="mt-2"></v-select>
            </div>
          </v-form>
          <v-alert v-if="dialog.message" :type="dialog.isError ? 'error' : 'success'" class="mt-3" dense>{{ dialog.message }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog" :disabled="dialog.loading">Cancel</v-btn>
          <v-btn color="primary" @click="saveData" :loading="dialog.loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog.show" max-width="400px">
        <v-card>
            <v-card-title class="text-h5">Confirm Deletion</v-card-title>
            <v-card-text>Are you sure you want to delete this {{ deleteDialog.type }}? This action cannot be undone.</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="deleteDialog.show = false">Cancel</v-btn>
                <v-btn color="error" @click="confirmDelete">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { httpsCallable } from "firebase/functions";
import { functions } from '@/firebase';

const companies = ref([]);
const departments = ref([]);
const contractors = ref([]);
const loading = ref(true);
const form = ref(null);
const dialog = reactive({ show: false, type: '', isEditing: false, item: null, loading: false, message: '', isError: false });
const deleteDialog = reactive({ show: false, type: '', item: null });
const defaultFormData = { name: '', fullName: '', companyId: null, assignedDepartments: [] };
const formData = reactive({ ...defaultFormData });
const rules = { required: v => !!v || 'This field is required' };

async function fetchData() {
  loading.value = true;
  try {
    const getManagementData = httpsCallable(functions, 'getManagementData');
    const result = await getManagementData();
    if (result.data.status === 'success') {
      companies.value = result.data.companies;
      departments.value = result.data.departments;
      contractors.value = result.data.contractors;
    } else {
      throw new Error("Failed to load data.");
    }
  } catch (error) {
    alert("Failed to load system data: " + error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);

function openDialog(type, item = null) {
  dialog.type = type;
  if (item) { // Editing
    dialog.isEditing = true;
    dialog.item = item;
    if (type === 'Company') Object.assign(formData, { name: item.name, fullName: item.fullName });
    if (type === 'Department') Object.assign(formData, { name: item.name, companyId: item.companyId });
    if (type === 'Contractor') Object.assign(formData, { name: item.name, assignedDepartments: item.assignedDepartments });
  } else { // Adding
    dialog.isEditing = false;
    Object.assign(formData, defaultFormData);
  }
  dialog.show = true;
}

function closeDialog() {
  dialog.show = false;
  setTimeout(() => {
    form.value?.reset();
    dialog.message = '';
    dialog.isError = false;
    dialog.isEditing = false;
    dialog.item = null;
    Object.assign(formData, defaultFormData);
  }, 300);
}

async function saveData() {
  const { valid } = await form.value.validate();
  if (!valid) return;
  dialog.loading = true;
  dialog.message = '';
  dialog.isError = false;
  
  try {
    const action = `${dialog.isEditing ? 'update' : 'add'}${dialog.type}`;
    const callable = httpsCallable(functions, action);
    
    let payload = { ...formData };
    if (dialog.isEditing) payload.id = dialog.item.id;
    if (dialog.type === 'Department') {
        const selectedCompany = companies.value.find(c => c.id === formData.companyId);
        payload.companyname = selectedCompany.name; // Use 'name' from company
    }
    
    const result = await callable(payload);
    dialog.message = result.data.message;
    await fetchData();
    setTimeout(closeDialog, 2000);
  } catch (error) {
    dialog.message = error.message;
    dialog.isError = true;
  } finally {
    dialog.loading = false;
  }
}

function openDeleteDialog(type, item) {
    deleteDialog.type = type;
    deleteDialog.item = item;
    deleteDialog.show = true;
}

async function confirmDelete() {
    const { type, item } = deleteDialog;
    try {
        const action = `delete${type}`;
        const callable = httpsCallable(functions, action);
        await callable({ id: item.id });
        await fetchData();
    } catch (error) {
        alert(`Error deleting ${type}: ${error.message}`);
    }
    deleteDialog.show = false;
}

function getContractorDepartments(contractor) {
  if (!Array.isArray(contractor.assignedDepartments) || contractor.assignedDepartments.length === 0) {
    return 'No departments';
  }
  return contractor.assignedDepartments.map(deptId => {
    const dept = departments.value.find(d => d.id === deptId);
    return dept ? dept.companyname : '';
  }).join(', ');
}
</script>

<style scoped>
.management-card .v-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 450px;
}
</style>