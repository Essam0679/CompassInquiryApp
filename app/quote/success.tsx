import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle2, ArrowRight, Chrome as Home } from 'lucide-react-native';

export default function QuoteSuccessScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <CheckCircle2 size={80} color={colors.success} />
        
        <Text style={[styles.title, { color: colors.text }]}>
          {t('quoteSubmittedTitle')}
        </Text>
        
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {t('quoteSubmittedMessage')}
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Home size={18} color={colors.white} />
            <Text style={[styles.primaryButtonText, { color: colors.white }]}>
              {t('backToHome')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={() => router.replace('/quote')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              {t('requestAnotherQuote')}
            </Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginRight: 8,
  },
});