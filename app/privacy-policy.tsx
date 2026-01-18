// --- START OF FILE app/privacy-policy.tsx ---
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Header title={t('privacyPolicy', {defaultValue: "Privacy Policy"})} showBackButton={true} />
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.title, {color: colors.text}]}>{t('privacyPolicy', {defaultValue: "Privacy Policy"})}</Text>
            <Text style={[styles.paragraph, {color: colors.textSecondary}]}>
                {t('privacyPolicyContentPlaceholder', {defaultValue: "Your privacy policy content will go here. This should detail how you collect, use, and protect user data. Make sure it complies with relevant regulations."})}
            </Text>
            {/* Add more sections as needed */}
        </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    title: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 15 },
    paragraph: { fontSize: 16, fontFamily: 'Inter-Regular', lineHeight: 24, marginBottom: 10 }
})
// --- END OF FILE app/privacy-policy.tsx ---