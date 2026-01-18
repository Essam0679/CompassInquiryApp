// --- START OF FILE context/ThemeContext.tsx ---

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ThemeMode = 'light' | 'dark';

// Define the structure of your color palette for each theme
export interface ThemeColors {
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
  isDark: boolean;
  logoYellow: string; // <<< ADDED THIS LINE
}

// Define your light theme colors
export const lightColors: ThemeColors = {
  primary: '#00A651',
  primaryLight: '#E8F7EF',
  secondary: '#8DC63F',
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
  isDark: false,
  logoYellow: '#CDDC39', // <<< ADDED - Replace with your actual logo yellow hex code
};

// Define your dark theme colors
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
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#00A651',
  textOnInfo: '#FFFFFF',
  white: '#FFFFFF',
  isDark: true,
  logoYellow: '#CDDC39', // <<< ADDED - Replace with your actual logo yellow hex code
};

interface ThemeContextData {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

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

  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const storedTheme = await getStoredItem('theme');
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
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
// --- END OF FILE context/ThemeContext.tsx ---
