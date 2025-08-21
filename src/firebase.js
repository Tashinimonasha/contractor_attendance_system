// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKg5E_RaYY3bZTLCqd8U9TLVoiMc4Kn3U",
  authDomain: "printcare-contractor-inout-dev.firebaseapp.com",
  projectId: "printcare-contractor-inout-dev",
  storageBucket: "printcare-contractor-inout-dev.appspot.com",
  messagingSenderId: "260972776282",
  appId: "1:260972776282:web:8746fea25d2f323601c163"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, "asia-south1");

// Connect to emulators in development (commented out for production)
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectFunctionsEmulator(functions, "localhost", 5001);
// }

export { auth, db, functions };