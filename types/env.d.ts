/// <reference types="expo-router/types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_FIREBASE_API_KEY: string;
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      EXPO_PUBLIC_FIREBASE_APP_ID: string;
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
    }
  }
}

// The `export {};` at the end is often used to ensure the file is treated as a module,
// especially if there are no other imports or exports. It's generally harmless to keep.
// If you find it causes issues or your linter complains in specific setups,
// you might be able to remove it, but typically it's fine.
export {};
