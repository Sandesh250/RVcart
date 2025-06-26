import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your actual Firebase configuration
// Get this from Firebase Console > Project Settings > Your Apps > Web App
const firebaseConfig = {
    apiKey: "AIzaSyBnagdgm9W1UeobGLU0_94VeE9yOKLffOw",
    authDomain: "sensor-marketplace-efa73.firebaseapp.com",
    projectId: "sensor-marketplace-efa73",
    storageBucket: "sensor-marketplace-efa73.firebasestorage.app",
    messagingSenderId: "444766272426",
    appId: "1:444766272426:web:ebab25cf2db9903cd109d3",
    measurementId: "G-ZX2HX4XB53"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Free plan - no storage needed)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 