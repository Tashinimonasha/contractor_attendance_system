// Basic Express server setup with Firebase Admin SDK
import express from 'express';
import admin from 'firebase-admin';

const app = express();
app.use(express.json());

// Initialize Firebase Admin SDK
// Replace './serviceAccountKey.json' with your actual service account file path
try {
  admin.initializeApp({
    credential: admin.credential.cert('./serviceAccountKey.json'),
    databaseURL: 'https://<YOUR_FIREBASE_PROJECT_ID>.firebaseio.com'
  });
} catch (e) {
  console.error('Firebase Admin SDK initialization error:', e);
}

// Example route: Get all users from Firestore
app.get('/users', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example route: Add a user to Firestore
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const docRef = await admin.firestore().collection('users').add({ name, email });
    res.json({ id: docRef.id, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
