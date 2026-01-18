import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import Header from '@/components/common/Header';
import { ArrowRight } from 'lucide-react-native';

export default function ServicesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  
  const services = [
    {
      id: 'sea',
      title: t('seaFreight'),
      description: t('seaFreightLongDesc'),
      image: 'https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg',
      route: '/quote/sea'
    },
    {
      id: 'air',
      title: t('airFreight'),
      description: t('airFreightLongDesc'),
      image: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg',
      route: '/quote/air'
    },
    {
      id: 'land',
      title: t('landFreight'),
      description: t('landFreightLongDesc'),
      image: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg',
      route: '/quote/land'
    },
    {
      id: 'courier',
      title: t('courier'),
      description: t('courierLongDesc'),
      image: 'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg',
      route: '/quote/courier'
    },
    {
      id: 'breakbulk',
      title: t('breakbulk'),
      description: t('breakbulkLongDesc'),
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg',
      route: '/quote/breakbulk'
    },
    {
      id: 'customs',
      title: t('customs'),
      description: t('customsLongDesc'),
      image: 'https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg',
      route: '/quote/customs'
    }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('ourServices')} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.introText, { color: colors.textSecondary }]}>
          {t('servicesIntro')}
        </Text>
        
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[styles.serviceCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(service.route)}
          >
            <Image
              source={{ uri: service.image }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
            <View style={styles.serviceContent}>
              <Text style={[styles.serviceTitle, { color: colors.text }]}>
                {service.title}
              </Text>
              <Text 
                style={[styles.serviceDescription, { color: colors.textSecondary }]}
                numberOfLines={3}
              >
                {service.description}
              </Text>
              <View style={styles.serviceFooter}>
                <TouchableOpacity 
                  style={[styles.serviceButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push(service.route)}
                >
                  <Text style={[styles.serviceButtonText, { color: colors.white }]}>
                    {t('getQuote')}
                  </Text>
                  <ArrowRight size={14} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={[styles.requestCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.requestTitle, { color: colors.white }]}>
            {t('customRequests')}
          </Text>
          <Text style={[styles.requestDescription, { color: colors.white }]}>
            {t('customRequestsDesc')}
          </Text>
          <TouchableOpacity 
            style={[styles.requestButton, { backgroundColor: colors.white }]}
            onPress={() => router.push('/custom-request')}
          >
            <Text style={[styles.requestButtonText, { color: colors.primary }]}>
              {t('contactUs')}
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
  introText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  serviceCard: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 180,
  },
  serviceContent: {
    padding: 16,
  },
  serviceTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  serviceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  serviceButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginRight: 8,
  },
  requestCard: {
    borderRadius: 12,
    padding: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  requestTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  requestDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  requestButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  requestButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});