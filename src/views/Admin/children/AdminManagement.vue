<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">System Management</h2>
      <p class="text-medium-emphasis">Manage core business entities like companies and departments.</p>
    </div>

    <!-- Three Column Layout for Management Cards -->
    <v-row>
      <!-- Companies Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="management-card">
          <v-card-title class="d-flex align-center">
            <v-icon left class="mr-2">mdi-domain</v-icon>
            Companies ({{ companies.length }})
            <v-spacer></v-spacer>
            <v-btn color="blue" variant="flat" size="small" prepend-icon="mdi-plus">Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          
          <v-list class="py-0">
            <v-list-item
              v-for="company in companies"
              :key="company.shortName"
              :title="company.shortName"
              :subtitle="company.fullName"
            >
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red"></v-btn>
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
            <v-btn color="green" variant="flat" size="small" prepend-icon="mdi-plus">Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          
          <v-list class="py-0">
            <v-list-item
              v-for="dept in departments"
              :key="dept.name"
              :title="dept.name"
              :subtitle="dept.company"
            >
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red"></v-btn>
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
            <v-btn color="purple" variant="flat" size="small" prepend-icon="mdi-plus">Add</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          
          <v-list class="py-0">
            <v-list-item
              v-for="con in contractors"
              :key="con.name"
              :title="con.name"
              :subtitle="con.company"
            >
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="orange"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="red"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- DATA (In a real app, this would be fetched from your backend) ---

const companies = ref([
  { shortName: 'PCL', fullName: 'PrintCare Lanka (PCL)' },
  { shortName: 'PUL', fullName: 'PrintCare Universal (PUL)' },
  { shortName: 'PPM', fullName: 'PrintCare Premium (PPM)' },
  { shortName: 'PDSL', fullName: 'PrintCare Digital Solutions (PDSL)' },
]);

const departments = ref([
  { name: 'Printing & Packaging', company: 'PCL' },
  { name: 'Design & Pre-media', company: 'PCL' },
  { name: 'Sales & Customer Service', company: 'PUL' },
  { name: 'Maintenance Services', company: 'PPM' },
  { name: 'Printing & Packaging', company: 'PUL' },
  // Adding more to show the scrollbar
  { name: 'Logistics', company: 'PDSL' },
  { name: 'Human Resources', company: 'PCL' },
  { name: 'Finance', company: 'PPM' },
]);

const contractors = ref([
  { name: 'ABC Contractors Ltd', company: 'PCL' },
  { name: 'XYZ Services', company: 'PUL' },
  { name: 'Quick Solutions', company: 'PPM' },
  { name: 'Elite Workforce', company: 'PDSL' },
  { name: 'Professional Staff', company: 'PCL' },
]);
</script>

<style scoped>
/* Adding a max-height and overflow to the cards to enable scrolling */
.management-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.management-card .v-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 450px; /* Adjust this value as needed */
}
</style>