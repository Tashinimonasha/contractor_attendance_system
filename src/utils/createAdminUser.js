import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/firebase';

/**
 * Creates an admin user directly from the frontend (for development only)
 * This function can be called from the browser console:
 * import('@/utils/createAdminUser').then(module => module.createAdminUser())
 */
export async function createAdminUser() {
  try {
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
      role: "admin", // Note: Using lowercase
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
      email: adminEmail,
      password: adminPassword
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
