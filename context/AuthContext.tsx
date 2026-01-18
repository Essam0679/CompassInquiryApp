<<<<<<< HEAD
// --- START OF FILE context/AuthContext.tsx (Full Updated with New UserProfile Fields) ---

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp, FieldValue } from 'firebase/firestore'; 
import { app, db, auth as firebaseAuthInstance } from '@/config/firebase'; 
import { Alert } from 'react-native'; 

export interface UserProfile { 
  uid: string; 
  email: string | null; 
  name: string | null; 
  companyName?: string; 
  businessType?: string; 
  phone?: string; 
  country?: string; 
  createdAt?: Timestamp | FieldValue; 
  lastLogin?: Timestamp | FieldValue; 
  // --- ADDED NEW OPTIONAL FIELDS ---
  pushNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  languagePreference?: 'en' | 'ar' | string; 
  // --- END OF ADDED FIELDS ---
}
interface AuthContextData { 
  currentUser: FirebaseUser | null; 
  userProfile: UserProfile | null; 
  login: (email: string, password: string) => Promise<void>; 
  register: (userData: Pick<UserProfile, 'email' | 'name' | 'phone' | 'companyName' | 'businessType' | 'country'>, password: string) => Promise<void>; 
  logout: () => Promise<void>; 
  updateUserProfileInFirestore: (updatedData: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>) => Promise<void>; 
  loading: boolean; 
  authLoading: boolean; 
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps { children: ReactNode; }

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); 
  const [authLoading, setAuthLoading] = useState(false); 

  useEffect(() => {
    console.log("AUTH_CONTEXT_DEBUG: Setting up onAuthStateChanged listener (Full with profile fetch).");
    setLoading(true);
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, async (firebaseUser) => {
      console.log("AUTH_CONTEXT_DEBUG: onAuthStateChanged triggered. Firebase user:", firebaseUser ? firebaseUser.uid : "null");
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        try {
          console.log("AUTH_CONTEXT_DEBUG: Attempting to fetch profile for UID:", firebaseUser.uid);
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef); 
          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data() as UserProfile;
            console.log("AUTH_CONTEXT_DEBUG: User profile fetched from Firestore:", JSON.stringify(profileData));
            setUserProfile(profileData);
          } else {
            console.warn("AUTH_CONTEXT_DEBUG: No profile document found in Firestore for user (UID:", firebaseUser.uid, "). User might be new or profile creation failed previously.");
            setUserProfile(null); 
          }
        } catch (error: any) { 
          console.error("AUTH_CONTEXT_DEBUG: CRITICAL ERROR fetching user profile from Firestore in onAuthStateChanged: Code:", error.code, "Message:", error.message);
          setUserProfile(null); 
          // Alert.alert("Profile Load Error", `Could not load your profile details. Error: ${error.message} (Code: ${error.code})`); // Keep this commented for now to avoid render error
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => { console.log("AUTH_CONTEXT_DEBUG: Cleaning up onAuthStateChanged listener."); unsubscribe(); };
  }, []); 

  async function login(email: string, password: string): Promise<void> { console.log("AUTH_CONTEXT_DEBUG: >>> ENTERING AuthContext login function <<<"); setAuthLoading(true); console.log("AUTH_CONTEXT_DEBUG: login function called."); try { await signInWithEmailAndPassword(firebaseAuthInstance, email, password); console.log("AUTH_CONTEXT_DEBUG: Firebase signInWithEmailAndPassword successful."); } catch (error: any) { console.error("AUTH_CONTEXT_DEBUG: Firebase Login Error - Code:", error.code, "Message:", error.message); throw error; } finally { setAuthLoading(false); console.log("AUTH_CONTEXT_DEBUG: login function finally block."); } }
  async function register(userData: Pick<UserProfile, 'email' | 'name' | 'phone' | 'companyName' | 'businessType' | 'country'>, password: string): Promise<void> { console.log("AUTH_CONTEXT_DEBUG: >>> ENTERING AuthContext register function <<<"); setAuthLoading(true); if (!userData.email) { setAuthLoading(false); Alert.alert("Validation Error", "Email is required for registration."); throw new Error("Email is required for registration.");} console.log("AUTH_CONTEXT_DEBUG: Register function called with userData:", JSON.stringify(userData)); try { const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance, userData.email, password); const firebaseUser = userCredential.user; console.log("AUTH_CONTEXT_DEBUG: Firebase user successfully created via Auth. UID:", firebaseUser.uid, "Email:", firebaseUser.email); if (userData.name) { console.log("AUTH_CONTEXT_DEBUG: Attempting to update Firebase Auth profile displayName to:", userData.name); await updateProfile(firebaseUser, { displayName: userData.name }); console.log("AUTH_CONTEXT_DEBUG: Firebase Auth profile displayName updated."); } const newUserProfile: UserProfile = { uid: firebaseUser.uid, email: firebaseUser.email, name: userData.name || null, phone: userData.phone || undefined, companyName: userData.companyName || undefined, businessType: userData.businessType || undefined, country: userData.country || undefined, createdAt: serverTimestamp(), pushNotificationsEnabled: true, emailNotificationsEnabled: true, languagePreference: 'en' /* Default prefs */ }; console.log("AUTH_CONTEXT_DEBUG: newUserProfile object prepared for Firestore:", JSON.stringify(newUserProfile)); const userDocRef = doc(db, "users", firebaseUser.uid); console.log("AUTH_CONTEXT_DEBUG: Attempting to setDoc for user profile in Firestore at path:", `users/${firebaseUser.uid}`); await setDoc(userDocRef, newUserProfile); console.log("AUTH_CONTEXT_DEBUG: User profile successfully created in Firestore."); setUserProfile(newUserProfile); } catch (error: any) { console.error("AUTH_CONTEXT_DEBUG: CRITICAL ERROR during registration (Auth or Firestore profile creation):", "Message:", error.message, "Code:", error.code, "Stack:", error.stack); throw error; } finally { setAuthLoading(false); console.log("AUTH_CONTEXT_DEBUG: Register function finally block."); } }
  async function logout(): Promise<void> { console.log("AUTH_CONTEXT_DEBUG: >>> ENTERING AuthContext logout function <<<"); setAuthLoading(true); console.log("AUTH_CONTEXT_DEBUG: logout function called."); try { await signOut(firebaseAuthInstance); console.log("AUTH_CONTEXT_DEBUG: Firebase signOut successful."); } catch (error: any) { console.error("AUTH_CONTEXT_DEBUG: Firebase Logout Error - Code:", error.code, "Message:", error.message); throw error; } finally { setAuthLoading(false); console.log("AUTH_CONTEXT_DEBUG: logout function finally block."); } }
  async function updateUserProfileInFirestore(updatedData: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>): Promise<void> { console.log("AUTH_CONTEXT_DEBUG: >>> ENTERING AuthContext updateUserProfileInFirestore function <<<"); if (!currentUser) { console.error("AUTH_CONTEXT_DEBUG: updateUserProfileInFirestore - User not authenticated."); throw new Error("User not authenticated."); } setAuthLoading(true); console.log("AUTH_CONTEXT_DEBUG: updateUserProfileInFirestore called with data:", JSON.stringify(updatedData)); try { const userDocRef = doc(db, "users", currentUser.uid); await setDoc(userDocRef, updatedData, { merge: true }); const newProfileData = { ...(userProfile || { uid: currentUser.uid, email: currentUser.email, name: currentUser.displayName }), ...updatedData } as UserProfile; setUserProfile(newProfileData); console.log("AUTH_CONTEXT_DEBUG: User profile updated in Firestore and local state."); } catch (error: any) { console.error('AUTH_CONTEXT_DEBUG: Error updating user profile in Firestore - Code:', error.code, "Message:", error.message); throw error; } finally { setAuthLoading(false); console.log("AUTH_CONTEXT_DEBUG: updateUserProfileInFirestore finally block."); } }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, login, register, logout, updateUserProfileInFirestore, loading, authLoading }}>
=======
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  type?: string;
}

interface AuthContextData {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredItem = async (key: string) => {
  if (Platform.OS === 'web') {
    const item = localStorage.getItem(key);
    return item;
  }
  return await SecureStore.getItemAsync(key);
};

const setStoredItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const removeStoredItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadStoredData() {
      const storedUser = await getStoredItem('user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    }
    
    loadStoredData();
  }, []);
  
  async function login(userData: User) {
    await setStoredItem('user', JSON.stringify(userData));
    setUser(userData);
  }
  
  async function logout() {
    await removeStoredItem('user');
    setUser(null);
  }
  
  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading }}
    >
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
      {children}
    </AuthContext.Provider>
  );
}

<<<<<<< HEAD
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
// --- END OF FILE context/AuthContext.tsx (Full Updated with New UserProfile Fields) ---
=======
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
