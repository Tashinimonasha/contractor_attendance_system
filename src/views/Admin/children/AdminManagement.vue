<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 d-flex align-center justify-space-between">
      <div>
        <h2 class="text-h5 font-weight-bold">System Management</h2>
        <p class="text-medium-emphasis">Manage core business entities like companies and departments.</p>
      </div>
      <v-btn icon="mdi-refresh" @click="fetchData(true)" :loading="loading" title="Refresh Data"></v-btn>
    </div>

    <!-- Snackbar for all notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions><v-btn variant="text" @click="snackbar.show = false">Close</v-btn></template>
    </v-snackbar>

    <!-- Cards Layout -->
    <v-row>
      <!-- Companies Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card border-blue">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-domain</v-icon> Companies ({{ companies.length }})
            <v-spacer></v-spacer>
            <v-btn color="blue" variant="flat" size="small" @click="openDialog('Company')">+ Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="py-0">
            <v-list-item v-for="c in companies" :key="c.id" :title="c.name" :subtitle="c.fullName">
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange" @click="openDialog('Company', c)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Departments Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card border-green">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-office-building-outline</v-icon> Departments ({{ departments.length }})
            <v-spacer></v-spacer>
            <v-btn color="green" variant="flat" size="small" @click="openDialog('Department')">+ Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="py-0">
            <v-list-item v-for="d in departments" :key="d.id" :title="d.name" :subtitle="d.companyShortName">
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange" @click="openDialog('Department', d)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Contractors Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card border-purple">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-account-hard-hat</v-icon> Contractors ({{ contractors.length }})
            <v-spacer></v-spacer>
            <v-btn color="purple" variant="flat" size="small" @click="openDialog('Contractor')">+ Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="py-0">
             <v-list-item v-for="c in contractors" :key="c.id" :title="c.name" :subtitle="getContractorDepartments(c)">
               <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange" @click="openDialog('Contractor', c)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Generic Add/Edit Dialog -->
    <v-dialog v-model="dialog.show" max-width="500px" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h5">Add New {{ dialog.type }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <!-- Form for Company -->
            <div v-if="dialog.type === 'Company'">
              <v-text-field v-model="formData.name" label="Company Short Name (e.g., PCL)" :rules="[rules.required, rules.noDuplicates(companies, 'name')]" autofocus></v-text-field>
            </div>
            <!-- Form for Department -->
            <div v-if="dialog.type === 'Department'">
              <v-text-field v-model="formData.name" label="Department Name" :rules="[rules.required, rules.noDepartmentDuplicates]" autofocus></v-text-field>
              <v-select v-model="formData.companyId" label="Assign to Company" :items="companies" item-title="name" item-value="id" :rules="[rules.required]" class="mt-2"></v-select>
            </div>
            <!-- Form for Contractor -->
            <div v-if="dialog.type === 'Contractor'">
              <v-text-field v-model="formData.name" label="Contractor Name" :rules="[rules.required, rules.noDuplicates(contractors, 'name')]" autofocus></v-text-field>
              <div v-for="(pair, idx) in formData.companyDepartments" :key="idx" class="d-flex align-center mb-2">
                <v-select
                  v-model="pair.companyId"
                  :items="companies"
                  item-title="name"
                  item-value="id"
                  label="Select Company"
                  class="mr-2"
                  style="min-width: 140px;"
                  @update:model-value="pair.departmentId = null"
                ></v-select>
                <v-select
                  v-model="pair.departmentId"
                  :items="departments.filter(d => d.companyId === pair.companyId)"
                  :item-title="d => `${d.name} (${getCompanyName(d.companyId)})`"
                  item-value="id"
                  label="Select Department"
                  style="min-width: 180px;"
                  :disabled="!pair.companyId"
                ></v-select>
                <v-btn icon color="error" @click="formData.companyDepartments.splice(idx, 1)" title="Remove">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-btn color="primary" variant="text" @click="formData.companyDepartments.push({ companyId: null, departmentId: null })" class="mb-2">+ Add Company/Department</v-btn>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <div style="position: relative; width: 100%; min-height: 48px;">
            <div v-if="dialog.isEditing" style="position: absolute; left: 0; bottom: 0; display: flex; align-items: center;">
              <v-btn color="error" icon @click="() => openDeleteDialog(dialog.type, dialog.item)" class="delete-btn" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <span style="color: #d32f2f; font-weight: 500; margin-left: 4px;">Delete</span>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px;">
              <v-btn color="red" variant="flat" @click="closeDialog" :disabled="dialog.loading" rounded>CANCEL</v-btn>
              <v-btn color="green" variant="flat" @click="saveData" :loading="dialog.loading" rounded>SAVE</v-btn>
            </div>
          </div>
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
const companies = ref([]);
const departments = ref([]);
const contractors = ref([]);
const loading = ref(true);
const form = ref(null);
const dialog = reactive({ show: false, type: '', isEditing: false, item: null, loading: false });
const snackbar = reactive({ show: false, text: '', color: 'success' });
const selectedCompanyForContractor = ref(null); // For the new contractor filter
const defaultFormData = { name: '', companyDepartments: [] };
const formData = reactive({ ...defaultFormData });

// --- RULES ---
const rules = { 
  required: v => !!v || 'This field is required',
  noDuplicates: (items, key) => value => {
    if (!value) return true;
    const isDuplicate = items.some(item => item[key].toLowerCase() === value.toLowerCase());
    return !isDuplicate || 'This name already exists.';
  },
  noDepartmentDuplicates: value => {
    if (!value || !formData.companyId) return true;
    const departmentsInCompany = departments.value.filter(dept => dept.companyId === formData.companyId);
    const isDuplicate = departmentsInCompany.some(item => item.name.toLowerCase() === value.toLowerCase());
    return !isDuplicate || 'This department already exists in the selected company.';
  }
};

// --- COMPUTED ---
const filteredDepartments = computed(() => {
  if (!selectedCompanyForContractor.value) return [];
  return departments.value.filter(dept => dept.companyId === selectedCompanyForContractor.value);
});

// --- DATA FETCHING ---
async function fetchData() {
  loading.value = true;
  try {
    const getManagementData = httpsCallable(functions, 'getManagementData');
    const result = await getManagementData();
    if (result.data.status === 'success') {
      companies.value = result.data.companies;
      departments.value = result.data.departments;
      contractors.value = result.data.contractors;
    } else { throw new Error("Failed to load data."); }
  } catch (error) {
    showSnackbar(`Error fetching data: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
}
onMounted(fetchData);

// --- DIALOG & SAVE LOGIC ---
function openDialog(type, item = null) {
  dialog.type = type;
  // Reset fields before populating
  Object.assign(formData, defaultFormData);
  selectedCompanyForContractor.value = null;

  if (item) { // Editing
    dialog.isEditing = true;
    dialog.item = item;
    if (type === 'Company') Object.assign(formData, { name: item.name, fullName: item.fullName });
    if (type === 'Department') Object.assign(formData, { name: item.name, companyId: item.companyId });
    if (type === 'Contractor') Object.assign(formData, { name: item.name, companyDepartments: [...(item.companyDepartments || [])] });
  } else { // Adding
    dialog.isEditing = false;
  }
  dialog.show = true;
}

function closeDialog() {
  dialog.show = false;
  setTimeout(() => {
    form.value?.resetValidation();
    dialog.isEditing = false;
    dialog.item = null;
    selectedCompanyForContractor.value = null;
  }, 300);
}

async function saveData() {
  const { valid } = await form.value.validate();
  if (!valid) return;
  dialog.loading = true;
  
  try {
    const action = `${dialog.isEditing ? 'update' : 'add'}${dialog.type}`;
    const callable = httpsCallable(functions, action);
    let payload = {};

    if (dialog.type === 'Company') {
      payload = { name: formData.name, fullName: formData.fullName };
    } else if (dialog.type === 'Department') {
      const selectedCompany = companies.value.find(c => c.id === formData.companyId);
      payload = { name: formData.name, companyId: formData.companyId, companyShortName: selectedCompany.name };
    } else if (dialog.type === 'Contractor') {
      payload = {
        name: formData.name,
        assignedDepartments: formData.companyDepartments
          .filter(pair => pair.companyId && pair.departmentId)
          .map(pair => pair.departmentId)
      };
    }
    
    if (dialog.isEditing) payload.id = dialog.item.id;
    
    const result = await callable(payload);
    showSnackbar(result.data.message, 'success');
    await fetchData();
    closeDialog();
  } catch (error) {
    showSnackbar(`Error: ${error.message}`, 'error');
  } finally {
    dialog.loading = false;
  }
}

// --- DIALOG & DELETE LOGIC ---
function openDeleteDialog(type, item) {
  if (!item || !item.id) {
    showSnackbar('Cannot delete: item is missing or invalid.', 'error');
    return;
  }
  if (confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
    deleteItem(type, item.id);
  }
}

async function deleteItem(type, id) {
  try {
    const action = `delete${type}`;
    const callable = httpsCallable(functions, action);
    await callable({ id });
    showSnackbar(`${type} deleted successfully.`, 'success');
    await fetchData();
    closeDialog();
  } catch (error) {
    showSnackbar(`Error deleting ${type}: ${error.message}`, 'error');
  }
}

// --- HELPERS ---
function getContractorDepartments(contractor) {
  if (!Array.isArray(contractor.assignedDepartments) || contractor.assignedDepartments.length === 0) return 'No departments';
  return contractor.assignedDepartments.map(deptId => {
    const dept = departments.value.find(d => d.id === deptId);
    return dept ? `${dept.name} (${dept.companyShortName})` : 'Unknown';
  }).join(', ');
}

function getCompanyName(companyId) {
  const company = companies.value.find(c => c.id === companyId);
  return company ? company.name : '';
}

function showSnackbar(text, color = 'success') {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
}
</script>

<style scoped>
/* Your existing styles are good */
.management-card {
  height: 100%;
  border: 1px solid rgba(0,0,0,0.08);
}
.management-card .v-list {
  overflow-y: auto;
  max-height: 450px;
}
.border-blue { border-left: 4px solid #2196F3; }
.border-green { border-left: 4px solid #4CAF50; }
.border-purple { border-left: 4px solid #9C27B0; }
</style>