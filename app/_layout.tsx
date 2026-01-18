<<<<<<< HEAD
// --- START OF FILE app/_layout.tsx (Refined Navigation Logic) ---
import { useEffect } from 'react';
import { Slot, useRouter, useSegments, SplashScreen } from 'expo-router'; // Added SplashScreen
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/context/I18nContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding until we're ready.
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
      return; // Don't do anything until auth state is resolved
    }

    // Once auth state is resolved, we can hide the native splash screen
    SplashScreen.hideAsync();

    const isAuthRoute = segments[0] === '(auth)';

    if (currentUser) {
      // User is logged in
      if (isAuthRoute || currentRoute === 'index' || currentRoute === '') {
        // If they are on an auth screen (login/register) or the initial index screen, redirect to tabs
        console.log("ROOT_LAYOUT_DEBUG: useEffect - User logged in, redirecting to /(tabs)");
        router.replace('/(tabs)');
      } else {
        console.log("ROOT_LAYOUT_DEBUG: useEffect - User logged in, already in a non-auth tab. No redirect needed.");
      }
    } else {
      // User is NOT logged in
      if (!isAuthRoute) {
        // If they are not on an auth screen (e.g. tried to access tabs or index directly), redirect to login
        console.log("ROOT_LAYOUT_DEBUG: useEffect - User NOT logged in and NOT in auth group, redirecting to /(auth)/login");
        router.replace('/(auth)/login');
      } else {
         console.log("ROOT_LAYOUT_DEBUG: useEffect - User NOT logged in, already in auth group. No redirect needed.");
      }
    }
  }, [currentUser, authContextLoading, segments, router]); // segments is important here

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
=======
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/context/I18nContext';

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-Bold': Poppins_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
