<!-- YOUR TEMPLATE IS ALMOST PERFECT, NO CHANGES NEEDED HERE -->
<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row class="fill-height" no-gutters>
      <!-- Mobile: Only logo and sign-in form -->
      <v-col cols="12" class="d-flex flex-column justify-center align-center d-md-none pa-4">
        <v-card flat max-width="100%" class="pa-8 mx-auto mobile-signin-card text-center" width="100%">
          <v-img :src="logo" max-width="220" class="mx-auto mb-8" />
          <h2 class="text-h5 font-weight-bold mb-4">Sign In</h2>
          <p class="text-body-1 mb-8 text-medium-emphasis">Please enter your credentials to proceed.</p>
          <template v-if="!showChangePassword">
            <v-alert
              v-if="authStore.error"
              type="error"
              class="mb-2"
              border="start"
              dense
              outlined
              style="font-size:0.95rem; white-space:pre-line; word-break:break-word;"
            >
              {{ authStore.error }}
            </v-alert>
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
                class="mb-4"
              ></v-text-field>
              <div class="sign-in-btn-wrapper">
                <v-btn
                  :loading="loading"
                  type="submit"
                  color="blue"
                  block
                  size="large"
                  rounded="lg"
                  class="mt-10 mb-4"
                >
                  Sign In
                </v-btn>
              </div>
            </v-form>
            <v-btn variant="text" color="blue" class="mb-2" @click="showChangePassword = true">Forgot Password?</v-btn>
          </template>
          <template v-else>
            <ForgotPasswordDialog
              v-if="showChangePassword"
              :model-value="showChangePassword"
              :persistent="false"
              @update:model-value="showChangePassword = false"
            />
          </template>
        </v-card>
      </v-col>
      <!-- Desktop: Full panel and illustration -->
      <v-col cols="12" md="6" class="decorative-panel d-none d-md-flex flex-column justify-center align-center">
        <div class="text-center pa-8">
          <v-img :src="logo" max-width="750" class="mx-auto mb-6" />
          <h1 class="text-h3 font-weight-bold mb-2 text-blue">Welcome to Printcare</h1>
          <p class="text-h6 font-weight-light mb-10 subtitle-text">Secure attendance management for external contractors</p>
       
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-none d-md-flex justify-center align-center">
        <v-card flat max-width="450" class="pa-4 pa-md-8 mx-auto" width="100%">
          <h2 class="text-h5 font-weight-bold mb-2">Sign In</h2>
          <p class="text-body-1 mb-8 text-medium-emphasis">Please enter your credentials to proceed.</p>
          <template v-if="!showChangePassword">
            <v-alert
              v-if="authStore.error"
              type="error"
              class="mb-2"
              border="start"
              dense
              outlined
              style="font-size:0.95rem; white-space:pre-line; word-break:break-word;"
            >
              {{ authStore.error }}
            </v-alert>
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
              <div class="sign-in-btn-wrapper">
                <v-btn
                  :loading="loading"
                  type="submit"
                  color="blue"
                  block
                  size="large"
                  rounded="lg"
                  class="mt-10 mb-4"
                >
                  Sign In
                </v-btn>
              </div>
            </v-form>
            <v-btn variant="text" color="blue" class="mb-2" @click="showChangePassword = true">Forgot Password?</v-btn>
          </template>
          <template v-else>
            <ForgotPasswordDialog
              v-if="showChangePassword"
              :model-value="showChangePassword"
              :persistent="false"
              @update:model-value="showChangePassword = false"
            />
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<!-- REPLACE YOUR SCRIPT WITH THIS CORRECTED VERSION -->
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ForgotPasswordDialog from '@/components/Core/ForgotPasswordDialog.vue';

// Import your images from the assets folder
import logo from '@/assets/printcareLogo.png';
import illustration from '@/assets/image1.jpg'; // Make sure this file exists

const authStore = useAuthStore();

// This ref controls the visibility of the "Forgot Password" dialog
const showChangePassword = ref(false);
function onChangePasswordDialogClose() {
  showChangePassword.value = false;
}

// Refs for the form fields and state
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

// CORRECTED: The handleLogin function should ONLY handle logging in.
// The routing logic is handled automatically by your auth store and router.
const handleLogin = async () => {
  if (!email.value && !password.value) {
    authStore.error = 'Please fill in both email and password.';
    return;
  }
  if (!email.value) {
    authStore.error = 'Please enter your email address.';
    return;
  }
  if (!password.value) {
    authStore.error = 'Please enter your password.';
    return;
  }
  loading.value = true;
  await authStore.login(email.value, password.value);
  loading.value = false;
};
</script>

<style scoped>
/* Decorative panel background */
.decorative-panel {
  background-color: #f4f7f9;
}
.v-theme--dark .decorative-panel {
  background-color: #1a1a1a;
}
/* Make subtitle text visible in dark mode */
.subtitle-text {
  color: #7e8a9a;
}
.v-theme--dark .subtitle-text {
  color: #bfc8d6 !important;
}

/* Sign In button wrapper for spacing */
.sign-in-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Mobile responsive tweaks */
@media (max-width: 600px) {
  .mobile-signin-card {
    padding-bottom: 32px !important;
    min-height: 420px;
    margin-bottom: 24px;
  }
  .sign-in-btn-wrapper {
    margin-top: 24px;
    margin-bottom: 16px;
  }
  .v-btn {
    font-size: 1.1rem;
    min-height: 48px;
  }
}
</style>