<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row class="fill-height" no-gutters>

      <!-- LEFT DECORATIVE SIDE -->
      <!-- This column contains your "Home Page" content and is hidden on small mobile screens -->
      <v-col
        cols="12"
        md="6"
        class="decorative-panel d-none d-md-flex flex-column justify-center align-center"
      >
        <div class="text-center pa-8">
          <v-img :src="logo" max-width="750"class="mx-auto mb-6" />
          <h1 class="text-h4 font-weight-bold mb-2">Welcome to Printcare</h1>
          <p class="text-h6 font-weight-light mb-10">Secure attendance management for external contractors</p>
          <v-img
            :src="illustration"
            max-width="400"
            class="mx-auto"
          />
        </div>
      </v-col>

      <!-- RIGHT LOGIN FORM SIDE -->
      <!-- This column contains the login form -->
      <v-col cols="12" md="6" class="d-flex justify-center align-center">
        <v-card flat max-width="450" class="pa-4 pa-md-8 mx-auto" width="100%">
          
          <!-- Mobile-only header -->
          <div class="d-flex d-md-none align-center mb-8">
             <v-img :src="logo" max-width="40" class="mr-4" />
             <h2 class="text-h5">Printcare Login</h2>
          </div>
          
          <h2 class="text-h4 font-weight-bold mb-2">Sign In</h2>
          <p class="text-body-1 mb-8 text-medium-emphasis">Please enter your credentials to proceed.</p>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              rounded="lg"
              required
            ></v-text-field>
            
            <a href="#" class="text-body-2 font-weight-medium text-primary text-decoration-none">Forgot Password?</a>

            <v-btn
              :loading="loading"
              type="submit"
              color="primary"
              block
              size="large"
              rounded="lg"
              class="mt-8"
            >
              Sign In
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Import your images from the assets folder
import logo from '@/assets/printcareLogo.png';
import illustration from '@/assets/image1.jpg';
const authStore = useAuthStore();

// Refs for the form fields and state
const email = ref('admin@printcare.com'); // Default for easy testing
const password = ref('admin123'); // Default for easy testing
const showPassword = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  // Your existing login logic from the Pinia store handles the rest
  await authStore.login(email.value, password.value);
  loading.value = false;
};
</script>

<style scoped>
.decorative-panel {
  /* You can use a subtle color or a gradient */
  background-color: #f4f7f9;
}

/* For dark mode, give the panel a suitable dark color */
.v-theme--dark .decorative-panel {
    background-color: #1a1a1a;
}
</style>

