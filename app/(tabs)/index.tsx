<<<<<<< HEAD
// --- START OF FILE app/(tabs)/index.tsx ---

=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import Header from '@/components/common/Header';
import LogoHeader from '@/components/common/LogoHeader';
import ServiceCard from '@/components/home/ServiceCard';
import { ArrowRight } from 'lucide-react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
<<<<<<< HEAD

  const navigateToQuote = () => {
    router.push('/quote');
  };

  const sloganLine1 = "Navigating a Storm?";
  const sloganLine2 = "Let us be your Compass.";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('home') || "Home"} showBackButton={false} />
      <LogoHeader />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroBanner, { width }]}>
          <Image
=======
  
  const navigateToQuote = () => {
    router.push('/quote');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showBackButton={false} />
      <LogoHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroBanner, { width }]}>
          <Image 
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
            source={{ uri: 'https://raw.githubusercontent.com/Essam0679/HostingHUB/main/Backgroundi.jpg' }}
            style={[styles.heroImage, { width }]}
            resizeMode="cover"
          />
          <View style={[styles.heroOverlay, { backgroundColor: 'rgba(0, 166, 81, 0.85)' }]}>
            <View style={styles.heroContent}>
<<<<<<< HEAD
              <Image
=======
              <Image 
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
                source={{ uri: 'https://www.compasslog.com/images/logo.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
<<<<<<< HEAD

              {/* --- MODIFIED SLOGAN TEXT --- */}
              <View style={styles.sloganContainer}>
                <Text style={[styles.sloganTextLine1, { color: colors.logoYellow }]}>
                  {sloganLine1}
                </Text>
                <Text style={[styles.sloganTextLine2, { color: colors.logoYellow }]}>
                  {sloganLine2}
                </Text>
              </View>
              {/* --- END OF SLOGAN TEXT --- */}

              <Text style={[styles.heroTitle, { color: colors.white }]}>
                {t('homeHeroTitle') || 'Global Shipping Solutions'}
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.white }]}>
                {t('homeHeroSubtitle') || 'Fast, reliable shipping services for businesses and individuals'}
              </Text>
              <TouchableOpacity
=======
              <Text style={[styles.heroTitle, { color: colors.white }]}>
                {t('homeHeroTitle')}
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.white }]}>
                {t('homeHeroSubtitle')}
              </Text>
              <TouchableOpacity 
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
                style={[styles.heroButton, { backgroundColor: colors.white }]}
                onPress={navigateToQuote}
              >
                <Text style={[styles.heroButtonText, { color: colors.primary }]}>
<<<<<<< HEAD
                  {t('requestQuote') || 'Request a Quote'}
=======
                  {t('requestQuote')}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
                </Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
<<<<<<< HEAD

        {/* ... Rest of your sections (Our Services, Why Choose Us, Contact Us) ... */}
        {/* (Code for these sections remains the same) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('ourServices') || 'Our Services'}
          </Text>
          <View style={styles.servicesGrid}>
            <ServiceCard title={t('seaFreight')} icon="ship" onPress={() => router.push('/quote/sea')} colors={colors} />
            <ServiceCard title={t('airFreight')} icon="plane" onPress={() => router.push('/quote/air')} colors={colors} />
            <ServiceCard title={t('landFreight')} icon="truck" onPress={() => router.push('/quote/land')} colors={colors} />
            <ServiceCard title={t('courier')} icon="package" onPress={() => router.push('/quote/courier')} colors={colors} />
            <ServiceCard title={t('breakbulk')} icon="box" onPress={() => router.push('/quote/breakbulk')} colors={colors} />
            <ServiceCard title={t('customs')} icon="file-text" onPress={() => router.push('/quote/customs')} colors={colors} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('whyChooseUs') || 'Why Choose Us'}
          </Text>
          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={styles.featureItem}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{t('globalNetwork') || 'Global Network'}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{t('globalNetworkDesc') || 'Description...'}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{t('customSolutions') || 'Custom Solutions'}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{t('customSolutionsDesc') || 'Description...'}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{t('expertise') || 'Industry Expertise'}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{t('expertiseDesc') || 'Description...'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/contact')}
          >
            <Text style={[styles.contactTitle, { color: colors.white || '#FFFFFF' }]}>{t('contactUs') || 'Contact Us'}</Text>
            <Text style={[styles.contactSubtitle, { color: colors.white || '#FFFFFF' }]}>{t('contactUsDesc') || 'Description...'}</Text>
            <ArrowRight size={20} color={colors.white || '#FFFFFF'} style={styles.contactArrow} />
=======
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('ourServices')}
          </Text>
          
          <View style={styles.servicesGrid}>
            <ServiceCard 
              title={t('seaFreight')}
              icon="ship"
              onPress={() => router.push('/quote/sea')}
              colors={colors}
            />
            <ServiceCard 
              title={t('airFreight')}
              icon="plane"
              onPress={() => router.push('/quote/air')}
              colors={colors}
            />
            <ServiceCard 
              title={t('landFreight')}
              icon="truck"
              onPress={() => router.push('/quote/land')}
              colors={colors}
            />
            <ServiceCard 
              title={t('courier')}
              icon="package"
              onPress={() => router.push('/quote/courier')}
              colors={colors}
            />
            <ServiceCard 
              title={t('breakbulk')}
              icon="box"
              onPress={() => router.push('/quote/breakbulk')}
              colors={colors}
            />
            <ServiceCard 
              title={t('customs')}
              icon="file-text"
              onPress={() => router.push('/quote/customs')}
              colors={colors}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('whyChooseUs')}
          </Text>
          
          <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={styles.featureItem}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('globalNetwork')}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {t('globalNetworkDesc')}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('customSolutions')}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {t('customSolutionsDesc')}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('expertise')}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {t('expertiseDesc')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.contactCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/contact')}
          >
            <Text style={[styles.contactTitle, { color: colors.white }]}>
              {t('contactUs')}
            </Text>
            <Text style={[styles.contactSubtitle, { color: colors.white }]}>
              {t('contactUsDesc')}
            </Text>
            <ArrowRight size={20} color={colors.white} style={styles.contactArrow} />
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
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
  heroBanner: {
    height: 500,
    position: 'relative',
<<<<<<< HEAD
    alignSelf: 'stretch',
  },
  heroImage: {
    height: '100%',
    width: '100%',
=======
    alignSelf: 'center',
  },
  heroImage: {
    height: '100%',
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
<<<<<<< HEAD
    justifyContent: 'flex-start', // Align content to the top of the overlay
    paddingTop: 50,             // Pushes the entire heroContent down from the top edge
    alignItems: 'center',
  },
  heroContent: {
    paddingHorizontal: 15, // Slightly reduced padding
    alignItems: 'center',
    width: '95%', // Can be slightly wider
  },
  logo: {
    width: 240, // Smaller logo to give more space to slogan
    height: 80,
    marginBottom: 10, // Less space if slogan is prominent
  },
  sloganContainer: { // Container for the two lines of the slogan
    alignItems: 'center', // Center the lines if they have different widths
    marginBottom: 35, // Space between slogan and main hero title
  },
  sloganTextLine1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 33,       // << SIGNIFICANTLY LARGER (double of ~24-26)
    textAlign: 'center',
    lineHeight: 56,     // Adjust line height
    paddingHorizontal: 10,
    marginBottom: 4, // Small space between the two slogan lines
  },
  sloganTextLine2: {
    fontFamily: 'Poppins-Bold', // Or Poppins-Medium if you want less emphasis
    fontSize: 26,       // << SAME FONT SIZE AS heroTitle (adjust if needed)
    textAlign: 'center',
    lineHeight: 34,     // Adjust line height
    paddingHorizontal: 5,
  },
  heroTitle: { // "Global Shipping Solutions"
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 24,
=======
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 120,
    marginBottom: 32,
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    paddingVertical: 14,
    paddingHorizontal: 28,
=======
    paddingVertical: 12,
    paddingHorizontal: 24,
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    borderRadius: 8,
  },
  heroButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginRight: 8,
  },
<<<<<<< HEAD
  // ... (rest of your styles remain the same)
  section: { paddingHorizontal: 16, paddingVertical: 24, },
  sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 22, marginBottom: 20, textAlign: 'center', },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, },
  featureCard: { borderRadius: 12, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 16, },
  featureItem: { marginBottom: 20, },
  featureItemLast: { marginBottom: 0, },
  featureTitle: { fontFamily: 'Poppins-Medium', fontSize: 17, marginBottom: 6, },
  featureDescription: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, },
  contactCard: { borderRadius: 12, padding: 24, position: 'relative', overflow: 'hidden', },
  contactTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, marginBottom: 8, },
  contactSubtitle: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20, marginBottom: 8, paddingRight: 30, },
  contactArrow: { position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -10 }], },
});
// --- END OF FILE app/(tabs)/index.tsx ---
=======
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    borderRadius: 12,
    padding: 24,
    position: 'relative',
  },
  contactTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  contactSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    maxWidth: '80%',
  },
  contactArrow: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -10,
  },
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
