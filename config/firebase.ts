<<<<<<< HEAD
// --- START OF FILE @/config/firebase.ts (Using firebase/auth/react-native for persistence) ---
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Auth, initializeAuth } from 'firebase/auth'; // Import Auth type and methods from main module
import { getReactNativePersistence } from 'firebase/auth/react-native'; // Import getReactNativePersistence from the correct module
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAdI4_qrVtu6_sqfL8D3D_hNBLJW1QNMdA", 
  authDomain: "compassapp-d3b6b.firebaseapp.com",
  projectId: "compassapp-d3b6b",
  storageBucket: "compassapp-d3b6b.appspot.com", 
=======
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAdI4_qrVtu6_sqfL8D3D_hNBLJW1QNMdA",
  authDomain: "compassapp-d3b6b.firebaseapp.com",
  projectId: "compassapp-d3b6b",
  storageBucket: "compassapp-d3b6b.firebasestorage.app",
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  messagingSenderId: "132330131646",
  appId: "1:132330131646:web:68c6c766513a6463958eef",
  measurementId: "G-PKQX54VSGR"
};

<<<<<<< HEAD
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

let auth: Auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    console.log("FIREBASE_CONFIG_DEBUG: Firebase Auth initialized successfully with persistence.");
} catch (error) {
    console.error("FIREBASE_CONFIG_DEBUG: Error initializing Firebase Auth with persistence. Falling back to default (memory) persistence. Error:", error);
    // Fallback to default persistence if specific RN persistence fails
    auth = initializeAuth(app);
}
const analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, db, auth, analyticsPromise as analytics };
=======
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Only initialize analytics on web platform
export const analytics = Platform.OS === 'web' ? 
  isSupported().then(yes => yes ? getAnalytics(app) : null) : 
  null;
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
