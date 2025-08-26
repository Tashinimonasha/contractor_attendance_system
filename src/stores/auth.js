import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '@/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const isFirstLogin = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!user.value);
  const welcomeMessage = computed(() => user.value ? `Welcome back, ${user.value.name}` : '');

  /**
   * Logs the user in and pushes them to the root path.
   * The router guard will handle the actual redirection to the correct dashboard.
   */
  async function login(email, password) {
    error.value = null; 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await signOut(auth);
        throw new Error("User profile not found. Please contact your administrator.");
      }
      
      const customUserData = userDocSnap.data();
      
      user.value = {
        uid: userCredential.user.uid,
        email: customUserData.email,
        name: customUserData.name,
        role: customUserData.role,
      };
      
      isFirstLogin.value = customUserData.isDefaultPassword || false;
      localStorage.setItem('user', JSON.stringify(user.value));
      
      // --- THIS IS THE KEY ---
      // Just push to the root path. Let the router handle the rest.
      router.push('/');

    } catch (err) {
      console.error('Login failed:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        error.value = "Incorrect password or email. Please try again.";
      } else {
        error.value = err.message;
      }
      // Re-throw the error so the component knows the login failed
      throw err; 
    }
  }

  async function logout() {
    await signOut(auth);
    user.value = null;
    isFirstLogin.value = false;
    error.value = null;
    localStorage.clear();
    router.push({ name: 'Login' });
  }

  return { user, isFirstLogin, isAuthenticated, error, welcomeMessage, login, logout };
});