// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import the Firestore function

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKg5E_RaYY3bZTLCqd8U9TLVoiMc4Kn3U",
  authDomain: "printcare-contractor-inout-dev.firebaseapp.com",
  projectId: "printcare-contractor-inout-dev",
  storageBucket: "printcare-contractor-inout-dev.appspot.com",
  messagingSenderId: "260972776282",
  appId: "1:260972776282:web:8746fea25d2f323601c163",
  measurementId: "G-KGQD81XD0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize the Firestore database instance

// --- THIS IS THE FIX ---
// Export ALL the instances you need in other files
export { auth, db, analytics };