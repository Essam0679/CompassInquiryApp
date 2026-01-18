// --- START OF FILE I18nContext.tsx ---

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';
import { I18n, Scope, TranslateOptions } from 'i18n-js'; // Import Scope and TranslateOptions
import * as SecureStore from 'expo-secure-store';
import { en } from '@/translations/en'; // Ensure these paths are correct
import { ar } from '@/translations/ar'; // Ensure these paths are correct

// Define the shape of the interpolation options that i18n.t can accept
// This is a simplified version. i18n-js's TranslateOptions is more comprehensive.
interface CustomTranslateOptions extends TranslateOptions {
  [key: string]: any; // Allows for custom interpolation values like { name: 'John' }
}

interface I18nContextData {
  // Update the type of t to accept an optional options object
  t: (scope: Scope, options?: CustomTranslateOptions) => string;
  locale: string;
  setLocale: (locale: string) => Promise<void>; // setLocale is async
}

const i18n = new I18n({
  en: en,
  ar: ar,
});

// Set the initial locale
const initialLocale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.locale = initialLocale;
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Initialize with undefined for a stricter context check, or provide default dummy functions
const I18nContext = createContext<I18nContextData | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

// Storage helper functions (can be kept here or moved to a util)
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

export function I18nProvider({ children }: I18nProviderProps) {
  // Initialize locale state with the same logic as i18n.locale
  const [locale, setLocaleState] = useState<string>(i18n.locale);
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);

  useEffect(() => {
    async function loadStoredLocale() {
      try {
        const storedLocale = await getStoredItem('locale');
        if (storedLocale && (storedLocale === 'en' || storedLocale === 'ar')) { // Validate stored locale
          setLocaleState(storedLocale);
          i18n.locale = storedLocale;
        } else {
          // If no valid stored locale, i18n.locale is already set to initialLocale
          // Sync state with i18n instance if it differs (e.g. from system default)
          setLocaleState(i18n.locale);
        }
      } catch (error) {
        console.log('Failed to load locale from storage:', error);
        // Fallback: i18n.locale is already set, ensure state matches
        setLocaleState(i18n.locale);
      } finally {
        setIsLocaleLoaded(true);
      }
    }
    loadStoredLocale();
  }, []); // Run once on mount

  const setLocale = async (newLocale: string) => {
    if (newLocale === 'en' || newLocale === 'ar') { // Validate new locale
      setLocaleState(newLocale);
      i18n.locale = newLocale;
      try {
        await setStoredItem('locale', newLocale);
      } catch (error) {
        console.log('Failed to save locale to storage:', error);
      }
    } else {
      console.warn(`Attempted to set unsupported locale: ${newLocale}`);
    }
  };

  // The t function that will be provided by the context
  const translate = (scope: Scope, options?: CustomTranslateOptions): string => {
    return i18n.t(scope, options);
  };

  if (!isLocaleLoaded) {
    // Optionally return a loading indicator or null,
    // ensuring your app's splash screen is handled correctly by RootLayout
    return null; // Or <AppLoadingPlaceholder />
  }

  return (
    <I18nContext.Provider
      value={{ t: translate, locale, setLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(): I18nContextData { // Return type should match context data
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
// --- END OF FILE I18nContext.tsx ---
