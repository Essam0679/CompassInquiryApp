<<<<<<< HEAD
// --- START OF FILE app/(tabs)/contact.tsx (More Robust renderOfficeDetails) ---
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import { Phone, Mail, MapPin, Globe, MessageSquare as WhatsAppIcon } from 'lucide-react-native';
import { getContactInfoForCountry, CountryContactInfo, OfficeDetails } from '@/config/contacts';
=======
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import Header from '@/components/common/Header';
import { Phone, Mail, MapPin, Globe } from 'lucide-react-native';
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0

export default function ContactScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
<<<<<<< HEAD
  const { userProfile, loading: authLoading } = useAuth();

  const [activeContactInfo, setActiveContactInfo] = useState<CountryContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const countryCodeToUse = userProfile?.country;
    const info = getContactInfoForCountry(countryCodeToUse); 
    setActiveContactInfo(info);
    console.log("CONTACT_SCREEN_DEBUG: Country:", countryCodeToUse || "DEFAULT", "Info:", JSON.stringify(info, null, 2)); // Log the info
    setIsLoading(false);
  }, [userProfile]);

  const handleOpenLink = async (url: string) => { /* ... same as before ... */ try { const supported = await Linking.canOpenURL(url); if (supported) { await Linking.openURL(url); } else { Alert.alert(t('error', {defaultValue: "Error"}), `${t('cannotOpenLink', {defaultValue: "Cannot open this link:"})} ${url}`); } } catch (error) { console.error('Failed to open URL:', error); Alert.alert(t('error', {defaultValue: "Error"}), t('failedToOpenLink', {defaultValue: 'Failed to open the link. Please try again.'})); } };

  const renderOfficeDetails = (office: OfficeDetails, isPrimary = false, officeKey: string) => (
    <View key={officeKey} style={[styles.officeDetailBlock, !isPrimary && styles.secondaryOfficeDetailBlock, {borderColor: colors.border}]}>
      {/* Ensure office.name is a string or provide fallback */}
      {(office.name !== undefined && office.name !== null && office.name.trim() !== "") && (
        <Text style={[styles.officeName, { color: isPrimary ? colors.primary : colors.text }]}>
          {office.name}
        </Text>
      )}
      {/* Ensure office.address is a string or provide fallback */}
      {(office.address !== undefined && office.address !== null && office.address.trim() !== "") && (
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => office.mapLink && handleOpenLink(office.mapLink)}
        >
          <MapPin size={18} color={colors.textSecondary} style={styles.contactIcon}/>
          <Text style={[styles.contactText, styles.addressText, { color: colors.textSecondary }]}>
            {office.address}
          </Text>
        </TouchableOpacity>
      )}
      {/* Ensure office.tel is a string or provide fallback */}
      {(office.tel !== undefined && office.tel !== null && office.tel.trim() !== "") && (
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => handleOpenLink(`tel:${office.tel}`)}
        >
          <Phone size={18} color={colors.textSecondary} style={styles.contactIcon}/>
          <Text style={[styles.contactText, { color: colors.primary }]}>
            {`${t('telLabel', {defaultValue: "Tel"})}: ${office.tel}`}
          </Text>
        </TouchableOpacity>
      )}
      {/* Ensure office.fax is a string or provide fallback */}
      {(office.fax !== undefined && office.fax !== null && office.fax.trim() !== "") && (
         <View style={styles.contactRow}>
            <Phone size={18} color={colors.textSecondary} style={styles.contactIcon}/>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                {`${t('faxLabel', {defaultValue: "Fax"})}: ${office.fax}`}
            </Text>
        </View>
      )}
      {/* Ensure office.email is a string or provide fallback */}
      {(office.email !== undefined && office.email !== null && office.email.trim() !== "") && (
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => handleOpenLink(`mailto:${office.email}`)}
        >
          <Mail size={18} color={colors.textSecondary} style={styles.contactIcon}/>
          <Text style={[styles.contactText, { color: colors.primary }]}>
            {office.email}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (authLoading || isLoading || !activeContactInfo) { /* ... same loading ... */ return ( <View style={[styles.container, {backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center'}]}><Header title={t('contactUs', {defaultValue: "Contact Us"})} showBackButton={false}/><ActivityIndicator size="large" color={colors.primary} /></View> ); }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('contactUs', {defaultValue: 'Contact Us'})} showBackButton={false} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.countryHeader}>
            <Text style={styles.flagEmoji}>{activeContactInfo.flag}</Text>
            <Text style={[styles.countryName, { color: colors.text }]}>
              {t(activeContactInfo.nameKey, {defaultValue: activeContactInfo.name})}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('contactSubtitleWithCountry', { country: t(activeContactInfo.nameKey, {defaultValue: activeContactInfo.name}), defaultValue: `We're here to help in ${t(activeContactInfo.nameKey, {defaultValue: activeContactInfo.name})}`})}
          </Text>
          {renderOfficeDetails(activeContactInfo.primaryOffice, true, "primary")}
          {activeContactInfo.whatsapp && ( <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink(`https://wa.me/${activeContactInfo.whatsapp.replace(/\+/g, '')}`)} ><WhatsAppIcon size={18} color={colors.textSecondary} style={styles.contactIcon}/><Text style={[styles.contactText, { color: colors.primary }]}>{`${t('contactViaWhatsApp', {defaultValue: 'Contact via WhatsApp'})} (${activeContactInfo.whatsapp})`}</Text></TouchableOpacity> )}
          {activeContactInfo.emails && activeContactInfo.emails.length > 0 && ( <View style={styles.contactRow}><Mail size={18} color={colors.textSecondary} style={styles.contactIcon}/><View style={{flex: 1}}>{activeContactInfo.emails.map((email, index) => (<TouchableOpacity key={email} onPress={() => handleOpenLink(`mailto:${email}`)}><Text style={[styles.contactText, { color: colors.primary, marginBottom: index < activeContactInfo.emails.length - 1 ? 5 : 0 }]}>{email}</Text></TouchableOpacity>))}</View></View> )}
          <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink('https://www.compasslog.com')}><Globe size={18} color={colors.textSecondary} style={styles.contactIcon}/><Text style={[styles.contactText, { color: colors.primary }]}>www.compasslog.com</Text></TouchableOpacity>
        </View>
        {activeContactInfo.otherOffices && activeContactInfo.otherOffices.length > 0 && ( <View style={[styles.card, { backgroundColor: colors.card, marginTop: 24 }]}><Text style={[styles.otherOfficesTitle, { color: colors.text }]}>{t('otherOfficesIn', { country: t(activeContactInfo.nameKey, {defaultValue: activeContactInfo.name}), defaultValue: `Other Offices in ${t(activeContactInfo.nameKey, {defaultValue: activeContactInfo.name})}`})}</Text>{activeContactInfo.otherOffices.map((office, index) => renderOfficeDetails(office, false, `other-${index}`))}</View> )}
        <View style={[styles.hoursCard, { backgroundColor: colors.primaryLight, marginTop: 24 }]}><Text style={[styles.hoursTitle, { color: colors.primary }]}>{t('businessHours', { defaultValue: 'Business Hours' })}</Text><View style={styles.hoursContainer}><View style={styles.hoursRow}><Text style={[styles.dayText, { color: colors.text }]}>Sunday - Thursday</Text><Text style={[styles.timeText, { color: colors.text }]}>8:30 AM - 5:30 PM</Text></View><View style={styles.hoursRow}><Text style={[styles.dayText, { color: colors.text }]}>Saturday</Text><Text style={[styles.timeText, { color: colors.text }]}>Closed</Text></View><View style={styles.hoursRow}><Text style={[styles.dayText, { color: colors.text }]}>Friday</Text><Text style={[styles.timeText, { color: colors.text }]}>Closed</Text></View></View></View>
=======
  
  const openWebsite = () => {
    Linking.openURL('https://www.compasslog.com');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('contactUs')} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Get in Touch
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We're here to help with all your logistics needs
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Phone size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                Tel: +974 44370336
              </Text>
            </View>
            
            <View style={styles.contactRow}>
              <Phone size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                Mob: +974 33706307
              </Text>
            </View>
            
            <View style={styles.contactRow}>
              <Mail size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                essam.alkhayyat@compasslog.com
              </Text>
            </View>
            
            <TouchableOpacity style={styles.contactRow} onPress={openWebsite}>
              <Globe size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.primary }]}>
                www.compasslog.com
              </Text>
            </TouchableOpacity>
            
            <View style={styles.contactRow}>
              <MapPin size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                1st Floor, Office 103A, Al Nasr Twin Towers, Tower A{'\n'}
                West Bay, Doha, Qatar{'\n'}
                P.O.Box – 201585{'\n'}
                Zone.West Bay 60 | Street .950 | Bld.24
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.primary }]}>
          <Text style={[styles.title, { color: colors.white }]}>
            Business Hours
          </Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hoursRow}>
              <Text style={[styles.dayText, { color: colors.white }]}>
                Sunday - Thursday
              </Text>
              <Text style={[styles.timeText, { color: colors.white }]}>
                8:30 AM - 5:30 PM
              </Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={[styles.dayText, { color: colors.white }]}>
                Saturday
              </Text>
              <Text style={[styles.timeText, { color: colors.white }]}>
                Closed
              </Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={[styles.dayText, { color: colors.white }]}>
                Friday
              </Text>
              <Text style={[styles.timeText, { color: colors.white }]}>
                Closed
              </Text>
            </View>
          </View>
        </View>
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
      </ScrollView>
    </View>
  );
}
<<<<<<< HEAD
const styles = StyleSheet.create({ /* ... Same styles as before ... */ container: { flex: 1, }, scrollView: { flex: 1, }, content: { padding: 16, paddingBottom: 32, }, card: { borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, borderWidth: StyleSheet.hairlineWidth, }, countryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' }, flagEmoji: { fontSize: 28, marginRight: 10, }, countryName: { fontFamily: 'Poppins-Bold', fontSize: 22, textAlign: 'center', }, subtitle: { fontFamily: 'Inter-Regular', fontSize: 14, marginBottom: 24, lineHeight: 20, textAlign: 'center', }, officeDetailBlock: { marginBottom: 20, paddingTop: 15, borderTopWidth:1, }, secondaryOfficeDetailBlock: { paddingTop: 20, marginTop: 15, }, officeName: { fontFamily: 'Poppins-Medium', fontSize: 17, marginBottom: 12, }, contactRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, }, contactIcon: { marginRight: 12, marginTop: Platform.OS === 'ios' ? 3 : 5, width: 20, alignItems: 'center' }, contactText: { fontFamily: 'Inter-Regular', fontSize: 15, flex: 1, lineHeight: 22, }, addressText: {}, otherOfficesTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, marginBottom: 16, textAlign: 'center' }, hoursCard: { padding: 20, borderRadius: 12, }, hoursTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, marginBottom: 15, textAlign: 'center', }, hoursContainer: { marginTop: 8, }, hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, }, dayText: { fontFamily: 'Inter-Medium', fontSize: 15, }, timeText: { fontFamily: 'Inter-Regular', fontSize: 15, }, });
// --- END OF FILE app/(tabs)/contact.tsx (More Robust renderOfficeDetails) ---
=======

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
  card: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  contactInfo: {
    width: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  hoursContainer: {
    marginTop: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
