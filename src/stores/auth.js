import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Import your configured firebase instances
import { auth, db } from '@/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isFirstLogin = ref(false);
  const error = ref(null);
  const isLoading = ref(true);
  const isInitialized = ref(false);

  // Initialize auth state listener and restore from localStorage if available
  if (!isInitialized.value) {
    isInitialized.value = true;
    
    // Try to restore user from localStorage first for immediate availability
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
    onAuthStateChanged(auth, async (firebaseUser) => {
      isLoading.value = true;
      if (firebaseUser) {
        try {
          // Always fetch fresh data from Firestore first
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const updatedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              role: userData.role,
            };
            user.value = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            isFirstLogin.value = userData.isDefaultPassword === true;
            
            // If we're on the login page but already authenticated,
            // route the user to their destination 
            if (window.location.pathname === '/login') {
              console.log('User already authenticated on login page, routing to destination');
              // Slight delay to ensure auth state is fully processed
              setTimeout(() => routeUserToDestination(), 100); 
            }
          } else {
            // If user document doesn't exist in Firestore
            await signOut(auth);
            user.value = null;
            localStorage.removeItem('user');
            error.value = 'User profile not found. Please contact your administrator.';
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          await signOut(auth);
          user.value = null;
          localStorage.removeItem('user');
          error.value = 'Error loading user data. Please try again.';
        }
      } else {
        user.value = null;
        localStorage.removeItem('user');
      }
      isLoading.value = false;
    });
  }

  // A computed property to check if the user is logged in
  const isAuthenticated = computed(() => !!user.value);
  const welcomeMessage = computed(() => user.value ? `Welcome back, ${user.value.name}` : '');

  /**
   * Traditional Firebase Auth login
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
      
      // Check if first login
      isFirstLogin.value = customUserData.isDefaultPassword === true;
      
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', await firebaseUser.getIdToken());
      
      // Always route user after login, regardless of whether it's first login
      // This ensures consistent navigation behavior
      routeUserToDestination();
      
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      // Firebase error codes
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
          error.value = err.message || 'Login failed. Please check your credentials or try again later.';
      }
      return false;
    }
  }

  /**
   * Redirects the user to the correct page based on their role or saved redirect URL.
   */
  function routeUserToDestination() {
    if (!user.value || !user.value.role) {
      console.error("Cannot route user without a valid role.");
      return;
    }
    
    console.log("Routing user to destination based on role:", user.value.role);
    
    // Check if there's a saved redirect URL from before login
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    if (redirectPath && redirectPath !== '/login') {
      // Navigate to the originally requested page
      console.log("Redirecting to saved path:", redirectPath);
      router.push(redirectPath);
      return;
    }
    
    const role = user.value.role;
    // Fix routing by navigating to the correct route names
    if (role === 'Guard') {
      router.push({ name: 'GuardScan' });
    } else if (role === 'Admin') {
      router.push({ name: 'AdminOverview' }); // Changed to AdminOverview
    } else if (role === 'HR') {
      router.push({ name: 'HROverview' }); // Changed to HROverview
    } else if (role === 'Finance') {
      router.push({ name: 'FinanceOverview' }); // Changed to FinanceOverview
    } else if (role === 'Manager') {
      router.push({ name: 'ManagerOverview' }); // Changed to ManagerOverview
    } else {
      router.push('/');
    }
    console.log("Navigation triggered for role:", role);
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