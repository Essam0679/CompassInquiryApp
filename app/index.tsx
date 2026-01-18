<<<<<<< HEAD
// --- START OF FILE app/index.tsx (Ensure it's this version) ---
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// If you want to use theme colors for the initial spinner:
// import { useTheme } from '@/context/ThemeContext'; 

export default function IndexScreen() { // Renamed for clarity
  // const { colors } = useTheme(); // Uncomment if using themed color
  
  // This screen is a placeholder during the initial auth check by RootLayout.
  // RootLayout should quickly redirect away from here.
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00A651" /* or colors.primary */ />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Or your default light background
  },
});
// --- END OF FILE app/index.tsx (Ensure it's this version) ---
=======
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // Hide the splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  // Redirect to the tabs layout
  return <Redirect href="/(tabs)" />;
}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
