import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from '@/firebase';

/**
 * Creates an admin user directly from the console
 * To use: import('@/utils/admin-util').then(module => module.createAdminUser())
 */
export async function createAdminUser() {
  try {
    console.log("Checking if admin users already exist...");
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    const adminUsers = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.role && data.role.toLowerCase() === 'admin') {
        adminUsers.push({ id: doc.id, ...data });
      }
    });
    
    if (adminUsers.length > 0) {
      console.log("Admin users already exist:", adminUsers);
      return { success: false, message: "Admin users already exist", existingAdmins: adminUsers };
    }
    
    const auth = getAuth();
    const adminEmail = "admin@printcare.com";
    const adminPassword = "Admin@123";
    
    console.log("Creating admin user:", adminEmail);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log("Admin user created in Firebase Auth, now creating in Firestore...");
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: adminEmail,
      name: "System Administrator",
      firstName: "System",
      lastName: "Administrator",
      role: "admin", // Using lowercase
      status: "Active",
      isDefaultPassword: true,
      createdAt: new Date().toISOString()
    });
    
    console.log("Admin user created successfully!");
    console.log("Email: admin@printcare.com");
    console.log("Password: Admin@123");
    
    return {
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fixes all user roles to be lowercase
 * To use: import('@/utils/admin-util').then(module => module.fixAllUserRoles())
 */
export async function fixAllUserRoles() {
  try {
    console.log("Fixing all user roles to be lowercase...");
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    const updates = [];
    snapshot.forEach(docSnapshot => {
      const data = docSnapshot.data();
      if (data.role && data.role !== data.role.toLowerCase()) {
        console.log(`Fixing role for user ${docSnapshot.id}: ${data.role} -> ${data.role.toLowerCase()}`);
        const userRef = doc(db, "users", docSnapshot.id);
        updates.push(setDoc(userRef, { role: data.role.toLowerCase() }, { merge: true }));
      }
    });
    
    if (updates.length === 0) {
      console.log("No user roles need fixing");
      return { success: true, message: "No user roles need fixing", updatedCount: 0 };
    }
    
    await Promise.all(updates);
    console.log(`Fixed ${updates.length} user roles`);
    
    return {
      success: true,
      message: `Fixed ${updates.length} user roles`,
      updatedCount: updates.length
    };
  } catch (error) {
    console.error("Error fixing user roles:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
