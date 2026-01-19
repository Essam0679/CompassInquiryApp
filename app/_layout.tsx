import { useEffect } from 'react';
import { Slot, useRouter, useSegments, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/context/I18nContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { currentUser, loading: authContextLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // e.g., [], ['(auth)', 'login'], ['(tabs)', 'home']
  const currentRoute = segments.join('/') || 'index'; // Get a string representation

  console.log("ROOT_LAYOUT_DEBUG: CurrentUser:", currentUser ? currentUser.uid : "null", "AuthLoading:", authContextLoading, "CurrentRoute:", currentRoute);

  useEffect(() => {
    if (authContextLoading) {
      console.log("ROOT_LAYOUT_DEBUG: useEffect - Auth still loading, doing nothing with navigation yet.");
      return;
    }

    SplashScreen.hideAsync();

    const isAuthRoute = segments[0] === '(auth)';

    if (currentUser) {
      if (isAuthRoute || currentRoute === 'index' || currentRoute === '') {
        console.log("ROOT_LAYOUT_DEBUG: useEffect - User logged in, redirecting to /(tabs)");
        router.replace('/(tabs)');
      } else {
        console.log("ROOT_LAYOUT_DEBUG: useEffect - User logged in, already in a non-auth tab. No redirect needed.");
      }
    } else {
      if (!isAuthRoute) {
        console.log("ROOT_LAYOUT_DEBUG: useEffect - User NOT logged in and NOT in auth group, redirecting to /(auth)/login");
        router.replace('/(auth)/login');
      } else {
         console.log("ROOT_LAYOUT_DEBUG: useEffect - User NOT logged in, already in auth group. No redirect needed.");
      }
    }
  }, [currentUser, authContextLoading, currentRoute]);

  // This initial loading indicator is for the AuthProvider's initial check.
  // The useEffect above will hide the native splash screen once this is false.
  if (authContextLoading) {
    console.log("ROOT_LAYOUT_DEBUG: Rendering loading indicator (authContextLoading is true).");
    // While this specific loading indicator is shown, the native splash screen is still visible.
    // Once authContextLoading is false, SplashScreen.hideAsync() is called.
    return null; // Or your themed loading screen, but null is fine if splash screen handles it
  }
  
  console.log("ROOT_LAYOUT_DEBUG: Rendering Slot. CurrentUser:", currentUser ? currentUser.uid : "null");
  return <Slot />; 
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <RootNavigation />
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
// --- END OF FILE app/_layout.tsx (Refined Navigation Logic) ---
