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
  const error = ref(null); // Holds error messages for UI

  // A computed property to check if the user is logged in
  const isAuthenticated = computed(() => !!user.value);
  const welcomeMessage = computed(() => user.value ? `Welcome back, ${user.value.name}` : '');

  /**
   * Logs the user in with Firebase Auth, then fetches their custom data and role
   * from the Firestore 'users' collection.
   */
  async function login(email, password) {
    error.value = null;
    try {
      // Step 1: Authenticate with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Step 2: Fetch the user's custom data (including role) from Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await signOut(auth);
        error.value = 'User profile not found. Please contact your administrator.';
        return false;
      }

      const customUserData = userDocSnap.data();
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: customUserData.name,
        role: customUserData.role,
      };
      
         // The dialog's visibility is controlled ONLY by this database field
      
         isFirstLogin.value = customUserData.isDefaultPassword === true;

      
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', await firebaseUser.getIdToken());
      routeUserToDestination();
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      // Firebase error codes: https://firebase.google.com/docs/reference/js/auth.md#autherrorcodes
      switch (err.code) {
        case 'auth/user-not-found':
          error.value = 'No account found for this email. Please check your email or contact admin.';
          break;
        case 'auth/wrong-password':
          error.value = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          error.value = 'Invalid email address format.';
          break;
        case 'auth/invalid-credential':
          error.value = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          error.value = 'Too many failed attempts. Please try again later or reset your password.';
          break;
        case 'auth/network-request-failed':
          error.value = 'Network error. Please check your connection and try again.';
          break;
        default:
          error.value = err.message ? err.message : 'Login failed. Please check your credentials or try again later.';
      }
      return false;
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
    const role = user.value.role.toLowerCase();
    if (role === 'guard') {
      router.push({ name: 'GuardScan' });
    } else if (role === 'admin') {
      router.push({ name: 'AdminDashboard' });
    } else if (role === 'hr') {
      router.push({ name: 'HRDashboard' });
    } else if (role === 'finance') {
      router.push({ name: 'FinanceDashboard' });
    } else if (role === 'manager') {
      router.push({ name: 'ManagerDashboard' });
    } else {
      router.push('/');
    }
  }


  /**
   * Call this after a successful password change to update Firestore and local state
   */
  async function markPasswordChanged() {
    if (!user.value?.uid) return;
    try {
      const userDocRef = doc(db, "users", user.value.uid);
      await updateDoc(userDocRef, { isFirstLogin: false });
      isFirstLogin.value = false;
    } catch (err) {
      console.error('Failed to update isFirstLogin in Firestore:', err);
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
    error,
    login,
    logout,
    markPasswordChanged,
  };
});