import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Auth, initializeAuth, getAuth, browserLocalPersistence, indexedDBLocalPersistence } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAdI4_qrVtu6_sqfL8D3D_hNBLJW1QNMdA",
  authDomain: "compassapp-d3b6b.firebaseapp.com",
  projectId: "compassapp-d3b6b",
  storageBucket: "compassapp-d3b6b.appspot.com",
  messagingSenderId: "132330131646",
  appId: "1:132330131646:web:68c6c766513a6463958eef",
  measurementId: "G-PKQX54VSGR"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

let auth: Auth;

if (Platform.OS === 'web') {
  try {
    auth = initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence]
    });
    console.log("FIREBASE_CONFIG_DEBUG: Firebase Auth initialized for web with persistence.");
  } catch (error) {
    console.log("FIREBASE_CONFIG_DEBUG: Auth already initialized, using getAuth()");
    auth = getAuth(app);
  }
} else {
  const { getReactNativePersistence } = require('firebase/auth/react-native');
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;

  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    console.log("FIREBASE_CONFIG_DEBUG: Firebase Auth initialized for React Native with persistence.");
  } catch (error) {
    console.error("FIREBASE_CONFIG_DEBUG: Error initializing Firebase Auth. Falling back to default persistence. Error:", error);
    auth = getAuth(app);
  }
}

const analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, db, auth, analyticsPromise as analytics };
