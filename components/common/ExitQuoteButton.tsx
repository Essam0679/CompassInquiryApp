// File: components/common/ExitQuoteButton.tsx (Updated)

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext'; // Adjust path if needed
import { useTranslation } from '@/context/I18nContext'; // Adjust path if needed

const ExitQuoteButton = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handlePress = () => {
    Alert.alert(
      t('exitQuoteInquiry') || "Exit Quote Inquiry",
      t('exitQuoteConfirmation') || "Are you sure you want to exit? Any unsaved data will be lost.",
      [
        {
          text: t('stay') || "Stay",
          onPress: () => console.log("User chose to stay."),
          style: "cancel"
        },
        {
          text: t('exit') || "Exit",
          onPress: () => {
            // Since your home tab is 'index.tsx' inside (tabs) layout,
            // navigating to '/' should take you to the root of the (tabs) group,
            // which will render the 'index' (Home) screen.
            router.replace('/'); 
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
      <Text style={[styles.buttonText, { color: colors.primary || (Platform.OS === 'ios' ? '#007AFF' : colors.text) }]}>
        {t('cancel') || "Cancel"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: Platform.OS === 'ios' ? 0 : 10,
    paddingLeft: Platform.OS === 'ios' ? 15 : 0,
    paddingRight: Platform.OS === 'ios' ? 15 : 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontWeight: Platform.OS === 'ios' ? '400' : '500',
  },
});

export default ExitQuoteButton;