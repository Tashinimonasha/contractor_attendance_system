 import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions"; // Import the initializer

// ... your firebaseConfig object ...
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKg5E_RaYY3bZTLCqd8U9TLVoiMc4Kn3U",
  authDomain: "printcare-contractor-inout-dev.firebaseapp.com",
  projectId: "printcare-contractor-inout-dev",
  storageBucket: "printcare-contractor-inout-dev.appspot.com",
  messagingSenderId: "260972776282",
  appId: "1:260972776282:web:8746fea25d2f323601c163"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Initialize functions ONCE with the correct region
const functions = getFunctions(app, "asia-south1"); 

// Export the configured instance
export { auth, db, functions }; 