// --- START OF FILE app/help-center.tsx ---
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/common/Header';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';

export default function HelpCenterScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Header title={t('helpCenter', {defaultValue: "Help Center"})} showBackButton={true} />
        <View style={styles.content}>
            <Text style={[styles.title, {color: colors.text}]}>{t('faqTitle', {defaultValue: "Frequently Asked Questions"})}</Text>
            {/* Add FAQs here or link to a web page */}
            <Text style={{color: colors.textSecondary, textAlign: 'center', marginTop: 20}}>
                {t('moreHelpContactSupport', {defaultValue: "For more help, please contact support."})}
            </Text>
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 20 }
})
// --- END OF FILE app/help-center.tsx ---