import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import Header from '@/components/common/Header';
import { Ship, Plane, Truck, Package, Box, FileText, ChevronRight } from 'lucide-react-native';

export default function QuoteScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  
  const shippingModes = [
    {
      id: 'sea',
      name: t('seaFreight'),
      description: t('seaFreightDesc'),
      icon: <Ship size={24} color={colors.primary} />,
      route: '/quote/sea'
    },
    {
      id: 'air',
      name: t('airFreight'),
      description: t('airFreightDesc'),
      icon: <Plane size={24} color={colors.primary} />,
      route: '/quote/air'
    },
    {
      id: 'land',
      name: t('landFreight'),
      description: t('landFreightDesc'),
      icon: <Truck size={24} color={colors.primary} />,
      route: '/quote/land'
    },
    {
      id: 'courier',
      name: t('courier'),
      description: t('courierDesc'),
      icon: <Package size={24} color={colors.primary} />,
      route: '/quote/courier'
    },
    {
      id: 'breakbulk',
      name: t('breakbulk'),
      description: t('breakbulkDesc'),
      icon: <Box size={24} color={colors.primary} />,
      route: '/quote/breakbulk'
    },
    {
      id: 'customs',
      name: t('customs'),
      description: t('customsDesc'),
      icon: <FileText size={24} color={colors.primary} />,
      route: '/quote/customs'
    }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('requestQuote')} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>
          {t('selectShippingMode')}
        </Text>
        
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          {t('selectShippingModeDesc')}
        </Text>
        
        <View style={styles.shippingModes}>
          {shippingModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(mode.route)}
            >
              <View style={styles.modeIconContainer}>
                {mode.icon}
              </View>
              <View style={styles.modeContent}>
                <Text style={[styles.modeName, { color: colors.text }]}>
                  {mode.name}
                </Text>
                <Text style={[styles.modeDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {mode.description}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.infoCard, { backgroundColor: colors.info }]}>
          <Text style={[styles.infoTitle, { color: colors.textOnInfo }]}>
            {t('needHelp')}
          </Text>
          <Text style={[styles.infoText, { color: colors.textOnInfo }]}>
            {t('needHelpDesc')}
          </Text>
          <TouchableOpacity 
            style={[styles.infoButton, { backgroundColor: colors.white }]}
            onPress={() => router.push('/contact')}
          >
            <Text style={[styles.infoButtonText, { color: colors.primary }]}>
              {t('contactSupport')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subheading: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  shippingModes: {
    marginBottom: 24,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  modeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 12,
    padding: 24,
  },
  infoTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  infoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  infoButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});