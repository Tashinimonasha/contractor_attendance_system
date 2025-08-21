import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore";

// This is a temporary file to check the roles in the database
// and to create an admin user if needed

// Check the roles in the database
async function checkRoles() {
  console.log("Checking roles in the database...");
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      console.log("No users found in the database");
      return;
    }
    
    console.log("Users found:");
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`User: ${data.email}, Role: ${data.role}, ID: ${doc.id}`);
    });
  } catch (error) {
    console.error("Error checking roles:", error);
  }
}

// Create an admin user if none exists
async function createAdminUser() {
  console.log("Creating admin user...");
  try {
    const adminEmail = "admin@printcare.com";
    const adminPassword = "Admin@123";
    
    // First try to sign in with these credentials
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log("Admin user already exists and credentials are valid");
      return;
    } catch (error) {
      // If the user doesn't exist, we'll get an error and need to create them
      console.log("Admin user doesn't exist or credentials are invalid, creating...");
    }
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
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
    
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Main function to run all checks
export async function checkAndFixDatabase() {
  await checkRoles();
  // Uncomment the line below if you want to create an admin user
  // await createAdminUser();
}

// Call the main function
checkAndFixDatabase();
