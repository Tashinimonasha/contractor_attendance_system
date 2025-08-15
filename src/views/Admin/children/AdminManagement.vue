<template>
  <div>
    <h1 class="text-h4 mb-6">System Management</h1>
    <v-row>
      <!-- Companies Column -->
      <v-col cols="12" md="4">
        <v-card rounded="lg">
          <v-card-title class="d-flex align-center">Companies (4)<v-spacer></v-spacer><v-btn color="primary" variant="flat">Add</v-btn></v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item v-for="c in companies" :key="c.name" :title="c.name" :subtitle="c.sub">
              <template v-slot:append>
                <v-btn icon flat size="small"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                <v-btn icon flat size="small"><v-icon>mdi-delete-outline</v-icon></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <!-- Departments Column -->
      <v-col cols="12" md="4">
        <v-card rounded="lg">
          <v-card-title class="d-flex align-center">Departments (8)<v-spacer></v-spacer><v-btn color="success" variant="flat">Add</v-btn></v-card-title>
          <v-divider></v-divider>
          <v-list class="management-list">
             <v-list-item v-for="d in departments" :key="d.name" :title="d.name" :subtitle="d.sub">
              <template v-slot:append>
                <v-btn icon flat size="small"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                <v-btn icon flat size="small"><v-icon>mdi-delete-outline</v-icon></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <!-- Contractors Column -->
      <v-col cols="12" md="4">
         <v-card rounded="lg">
          <v-card-title class="d-flex align-center">Contractors (5)<v-spacer></v-spacer><v-btn color="secondary" variant="flat">Add</v-btn></v-card-title>
          <v-divider></v-divider>
          <v-list class="management-list">
             <v-list-item v-for="co in contractors" :key="co.name" :title="co.name" :subtitle="co.sub">
              <template v-slot:append>
                <v-btn icon flat size="small"><v-icon>mdi-pencil-outline</v-icon></v-btn>
                <v-btn icon flat size="small"><v-icon>mdi-delete-outline</v-icon></v-btn>
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
const companies = ref([{ name: 'PCL', sub: 'PrintCare Lanka (PCL)' }, { name: 'PUL', sub: 'PrintCare Universal (PUL)' }]);
const departments = ref([{ name: 'Printing & Packaging', sub: 'PCL' }, { name: 'Design & Pre-media', sub: 'PPM' }, { name: 'Sales & Customer Service', sub: 'PUL' }, { name: 'Maintenance Services', sub: 'PUL' }]);
const contractors = ref([{ name: 'ABC Contractors Ltd', sub: 'PCL' }, { name: 'XYZ Services', sub: 'PUL' }, { name: 'Quick Solutions', sub: 'PPM' }]);
</script>

<style scoped>
.management-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>
