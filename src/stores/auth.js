import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Import your configured firebase instances
import { auth, db } from '@/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const isFirstLogin = ref(false); // We will get this from Firestore

  // A computed property to check if the user is logged in
  const isAuthenticated = computed(() => !!user.value);
  const welcomeMessage = computed(() => user.value ? `Welcome back, ${user.value.name}` : '');

  /**
   * Logs the user in with Firebase Auth, then fetches their custom data and role
   * from the Firestore 'users' collection.
   */
  async function login(email, password) {
    try {
      // Step 1: Authenticate with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Step 2: Fetch the user's custom data (including role) from Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // This is a critical error. The user exists in Auth but not in our database.
        // Log them out to prevent a broken state.
        await signOut(auth);
        throw new Error(`User data not found in Firestore for UID: ${firebaseUser.uid}. Please contact an administrator.`);
      }
      
      const customUserData = userDocSnap.data(); // This object has { name, role, isDefaultPassword, etc. }

      // Step 3: Set the local user state with the combined data
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: customUserData.name,
        role: customUserData.role, // The CRITICAL missing piece
      };
      
      isFirstLogin.value = customUserData.isDefaultPassword || false;
      
      // Store user data in local storage to persist login
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', await firebaseUser.getIdToken()); // Store the token

      // Step 4: Redirect the user to their correct dashboard
      routeUserToDestination();

    } catch (error) {
      console.error('Login failed:', error);
      // In a real app, you would show the error message to the user in the UI
      // e.g., using a snackbar.
    }
  }

  /**
   * Redirects the user to the correct page based on their role.
   */
  function routeUserToDestination() {
    if (!user.value || !user.value.role) {
        console.error("Cannot route user without a valid role.");
        return;
    }
    
    // The ChangePasswordDialog will appear automatically if isFirstLogin is true.
    // The router's job is just to get them to the right base page.
    
    const role = user.value.role.toLowerCase();
    
    if (role === 'guard') {
      router.push({ name: 'GuardScan' });
    } else {
      // This will navigate to a route named 'AdminDashboard', 'HRDashboard', etc.
      router.push({ name: `${user.value.role}Dashboard` });
    }
  }

  async function logout() {
    await signOut(auth);
    user.value = null;
    localStorage.clear();
    router.push({ name: 'Login' });
  }

  return {
    user,
    isAuthenticated,
    isFirstLogin, // Expose this for the dialog
    welcomeMessage,
    login,
    logout,
  };
});