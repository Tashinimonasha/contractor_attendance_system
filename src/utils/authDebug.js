import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

// This is a debugging file to help understand authentication state
const currentAuthState = ref({
  user: null,
  isLoggedIn: false,
  lastError: null,
  debugInfo: {}
});

// Listen to auth state changes and log them
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }
    });
    
    currentAuthState.value = {
      user: {
        uid: user.uid,
        email: user.email
      },
      isLoggedIn: true,
      lastError: null,
      debugInfo: {
        timestamp: new Date().toISOString(),
        authProviders: user.providerData.map(p => p.providerId)
      }
    };
  } else {
    console.log('User is signed out');
    currentAuthState.value = {
      user: null,
      isLoggedIn: false,
      lastError: null,
      debugInfo: {
        timestamp: new Date().toISOString()
      }
    };
  }
});

// Export for use in console debugging
export { currentAuthState };

// Export a function to check if roles are lowercase in Firestore
export async function checkUserRolesCase() {
  if (!auth.currentUser) {
    console.log('No user is signed in, cannot check roles');
    return;
  }
  
  try {
    // Import Firestore functions here to avoid circular imports
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('@/firebase');
    
    // Get the current user's document
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User role from Firestore:', userData.role);
      console.log('Role is lowercase?', userData.role === userData.role.toLowerCase());
      console.log('Full user data:', userData);
      return userData;
    } else {
      console.log('No user document found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error checking roles:', error);
    return null;
  }
}

// Helper function to fix roles in Firestore if needed
export async function fixUserRole(userId, correctRole) {
  if (!correctRole) {
    console.error('Please provide a correct role (lowercase)');
    return;
  }
  
  try {
    // Import Firestore functions here to avoid circular imports
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('@/firebase');
    
    // Update the user's role
    await updateDoc(doc(db, 'users', userId), {
      role: correctRole.toLowerCase()
    });
    
    console.log(`Updated role for user ${userId} to ${correctRole.toLowerCase()}`);
    return true;
  } catch (error) {
    console.error('Error updating role:', error);
    return false;
  }
}
