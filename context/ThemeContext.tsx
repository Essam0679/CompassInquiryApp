<<<<<<< HEAD
// --- START OF FILE context/ThemeContext.tsx ---

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';
=======
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
import * as SecureStore from 'expo-secure-store';

type ThemeMode = 'light' | 'dark';

<<<<<<< HEAD
// Define the structure of your color palette for each theme
export interface ThemeColors {
=======
interface ThemeColors {
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  textOnInfo: string;
  white: string;
<<<<<<< HEAD
  isDark: boolean;
  logoYellow: string; // <<< ADDED THIS LINE
}

// Define your light theme colors
export const lightColors: ThemeColors = {
  primary: '#00A651',
  primaryLight: '#E8F7EF',
  secondary: '#8DC63F',
=======
}

export const lightColors: ThemeColors = {
  primary: '#00A651', // Compass green
  primaryLight: '#E8F7EF', // Light green for backgrounds
  secondary: '#8DC63F', // Accent green
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  background: '#F8F9FA',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E2E8F0',
  success: '#00A651',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#00A651',
  textOnInfo: '#FFFFFF',
  white: '#FFFFFF',
<<<<<<< HEAD
  isDark: false,
  logoYellow: '#CDDC39', // <<< ADDED - Replace with your actual logo yellow hex code
};

// Define your dark theme colors
=======
};

>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
export const darkColors: ThemeColors = {
  primary: '#00A651',
  primaryLight: '#00A65120',
  secondary: '#8DC63F',
  background: '#111827',
  backgroundSecondary: '#1F2937',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
<<<<<<< HEAD
  success: '#22C55E',
=======
  success: '#00A651',
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#00A651',
  textOnInfo: '#FFFFFF',
  white: '#FFFFFF',
<<<<<<< HEAD
  isDark: true,
  logoYellow: '#CDDC39', // <<< ADDED - Replace with your actual logo yellow hex code
};

interface ThemeContextData {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);
=======
};

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0

interface ThemeProviderProps {
  children: ReactNode;
}

<<<<<<< HEAD
const getStoredItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); }
    catch (e) { console.error('LocalStorage getItem error:', e); return null; }
  }
  try { return await SecureStore.getItemAsync(key); }
  catch (e) { console.error('SecureStore getItemAsync error:', e); return null; }
};

const setStoredItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); }
    catch (e) { console.error('LocalStorage setItem error:', e); }
    return;
  }
  try { await SecureStore.setItemAsync(key, value); }
  catch (e) { console.error('SecureStore setItemAsync error:', e); }
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(systemTheme || 'light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

=======
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

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const storedTheme = await getStoredItem('theme');
<<<<<<< HEAD
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          setTheme(storedTheme as ThemeMode);
        } else if (systemTheme) {
          setTheme(systemTheme);
        }
      } catch (error) {
        console.log('Failed to load theme from storage:', error);
        if (systemTheme) setTheme(systemTheme);
      } finally {
        setIsThemeLoaded(true);
      }
    }
    loadStoredTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await setStoredItem('theme', newTheme);
    } catch (error) {
      console.log('Failed to save theme to storage:', error);
    }
  };

  const currentColors = theme === 'light' ? lightColors : darkColors;

  if (!isThemeLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ colors: currentColors, theme, toggleTheme }}
=======
        
        if (storedTheme) {
          setTheme(storedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('Failed to load theme', error);
      }
    }
    
    loadStoredTheme();
  }, []);
  
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      await setStoredItem('theme', newTheme);
    } catch (error) {
      console.log('Failed to save theme', error);
    }
  };
  
  const colors = theme === 'light' ? lightColors : darkColors;
  
  return (
    <ThemeContext.Provider
      value={{ colors, theme, toggleTheme }}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    >
      {children}
    </ThemeContext.Provider>
  );
}

<<<<<<< HEAD
export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
// --- END OF FILE context/ThemeContext.tsx ---
=======
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
