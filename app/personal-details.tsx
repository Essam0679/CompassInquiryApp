// --- START OF FILE app/personal-details.tsx (This is your Edit Profile Screen) ---

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform, Keyboard, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth, UserProfile } from '@/context/AuthContext'; // Use UserProfile type
import { useRouter } from 'expo-router'; // Changed from 'expo-router'
import Header from '@/components/common/Header';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { gccCountryOptionsForRegistration } from '@/config/contacts';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';

// Define FormData specifically for this screen
interface EditProfileFormData {
  name: string;
  // email is typically not editable directly or handled differently
  phone: string;
  companyName: string;
  businessType: string;
  country: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  country?: string;
}

export default function PersonalDetailsScreen() { // Renamed component
  const { colors } = useTheme();
  const { t } = useTranslation();
  // Use currentUser for auth details, userProfile for Firestore profile data
  const { currentUser, userProfile, updateUserProfileInFirestore, authLoading: contextAuthLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false); // Local loading for submit operation
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: '', phone: '', companyName: '',
    businessType: 'importer', // Default value
    country: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const businessTypes: ItemType<string>[] = [
    { label: t('importer', {defaultValue: 'Importer'}), value: 'importer' },
    { label: t('exporter', {defaultValue: 'Exporter'}), value: 'exporter' },
    { label: t('freightForwarder', {defaultValue: 'Freight Forwarder'}), value: 'freight_forwarder' },
    { label: t('personal', {defaultValue: 'Personal'}), value: 'personal' }
  ];

  const countryOptionsList = gccCountryOptionsForRegistration.map(opt => ({
      label: `${opt.flag} ${t(opt.nameKey, {defaultValue: opt.defaultName})}`,
      value: opt.value
  }));

  // Populate form when userProfile or currentUser data is available/changes
  useEffect(() => {
    if (userProfile || currentUser) {
      setFormData({
        name: userProfile?.name || currentUser?.displayName || '',
        phone: userProfile?.phone || '',
        companyName: userProfile?.companyName || '',
        businessType: userProfile?.businessType || 'importer',
        country: userProfile?.country || '',
      });
    }
  }, [userProfile, currentUser]);

  useEffect(() => { if (businessTypeOpen || countryOpen) Keyboard.dismiss(); }, [businessTypeOpen, countryOpen]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) { newErrors.name = t('nameRequired', {defaultValue: 'Name is required'}); isValid = false; }
    if (formData.phone && formData.phone.trim() && !/^\+?[0-9\s\-()]{7,15}$/.test(formData.phone.replace(/\s/g,''))) { 
      newErrors.phone = t('phoneInvalid', {defaultValue: 'Invalid phone number'}); isValid = false; 
    }
    if (!formData.country) { newErrors.country = t('countryRequired', {defaultValue: 'Country is required'}); isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof EditProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) { // Clear error when user starts typing
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }));
    }
  };

  const handleSubmit = async () => {
    setCountryOpen(false); setBusinessTypeOpen(false); // Close dropdowns
    if (!validateForm()) {
      Alert.alert(t('validationFailed', {defaultValue: 'Validation Failed'}), t('pleaseCheckErrors', {defaultValue: 'Please check the form for errors.'}));
      return;
    }
    if (!updateUserProfileInFirestore || !currentUser) {
      Alert.alert(t('error', {defaultValue: 'Error'}), t('profileUpdateErrorUnavailable', {defaultValue: 'Profile update feature is not available or user not found.'}));
      return;
    }
    setLoading(true);
    try {
      const updatedDataForFirestore: Partial<UserProfile> = {};
      const currentAuthDisplayName = currentUser?.displayName || '';
      const currentProfileName = userProfile?.name || currentAuthDisplayName;

      // Only include fields that have changed
      if (formData.name !== currentProfileName) updatedDataForFirestore.name = formData.name;
      if (formData.phone !== (userProfile?.phone || '')) updatedDataForFirestore.phone = formData.phone;
      if (formData.companyName !== (userProfile?.companyName || '')) updatedDataForFirestore.companyName = formData.companyName;
      if (formData.businessType !== (userProfile?.businessType || 'importer')) updatedDataForFirestore.businessType = formData.businessType;
      if (formData.country !== (userProfile?.country || '')) updatedDataForFirestore.country = formData.country;
      
      let authProfileUpdated = false;
      if (updatedDataForFirestore.name && updatedDataForFirestore.name !== currentUser.displayName) {
        await firebaseUpdateProfile(currentUser, { displayName: updatedDataForFirestore.name });
        authProfileUpdated = true;
        console.log("EDIT_PROFILE_DEBUG: Firebase Auth displayName updated.");
      }
      
      if (Object.keys(updatedDataForFirestore).length > 0) {
        await updateUserProfileInFirestore(updatedDataForFirestore);
        console.log("EDIT_PROFILE_DEBUG: Firestore userProfile updated.");
        Alert.alert(
          t('profileUpdated', {defaultValue: 'Profile Updated'}),
          t('profileUpdateSuccess', {defaultValue: 'Your profile has been updated successfully.'}),
          [{ text: t('ok', {defaultValue: 'OK'}), onPress: () => router.back() }]
        );
      } else if (authProfileUpdated) { // Name changed in Auth but no other changes for Firestore profile
         Alert.alert(
          t('profileUpdated', {defaultValue: 'Profile Updated'}),
          t('profileUpdateSuccess', {defaultValue: 'Your profile has been updated successfully.'}),
          [{ text: t('ok', {defaultValue: 'OK'}), onPress: () => router.back() }]
        );
      }
      else {
        Alert.alert(t('noChangesTitle', {defaultValue: 'No Changes'}), t('noChangesMessage', {defaultValue: 'No changes were made to your profile.'}), [{ text: t('ok', {defaultValue: 'OK'}), onPress: () => router.back()}] );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('error', {defaultValue: 'Error'}), (error as Error).message || t('profileUpdateError', {defaultValue: 'Failed to update profile. Please try again.'}));
    } finally {
      setLoading(false);
    }
  };

  if (contextAuthLoading && !currentUser) {
    return (<View style={[styles.container, {justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background}]}><ActivityIndicator size="large" color={colors.primary} /></View>);
  }
  if (!currentUser) { 
    if (router.canGoBack()) router.back(); else router.replace({ pathname: '/(auth)/login' as any });
    return (<View style={[styles.container, {justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background}]}><ActivityIndicator size="large" color={colors.primary} /></View>);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('editProfile', {defaultValue: 'Edit Profile'})} showBackButton={true} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" scrollEnabled={!businessTypeOpen && !countryOpen}>
        
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('personalDetails', {defaultValue: 'Personal Details'})}</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>{`${t('fullName', {defaultValue: 'Full Name'})} *`}</Text>
            <TextInput style={[styles.textInput, { backgroundColor: colors.card, color: colors.text, borderColor: errors.name ? colors.error : colors.border }]} value={formData.name} onChangeText={(text) => handleInputChange('name', text)} placeholder={t('enterFullName', {defaultValue: "Enter your full name"})} placeholderTextColor={colors.textSecondary} />
            {errors.name ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text> : null}
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>{t('email', {defaultValue: 'Email'})}</Text>
            <TextInput style={[styles.textInput, styles.disabledInput, { backgroundColor: colors.backgroundSecondary, color: colors.textSecondary, borderColor: colors.border }]} value={currentUser.email || ''} editable={false} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>{t('phone', {defaultValue: 'Phone Number (Optional)'})}</Text>
            <TextInput style={[styles.textInput, { backgroundColor: colors.card, color: colors.text, borderColor: errors.phone ? colors.error : colors.border }]} value={formData.phone} onChangeText={(text) => handleInputChange('phone', text)} keyboardType="phone-pad" placeholder={t('enterPhoneNumber', {defaultValue: "Enter your phone number"})} placeholderTextColor={colors.textSecondary} />
            {errors.phone ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text> : null}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('businessInformation', {defaultValue: 'Business Information'})}</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>{t('companyName', {defaultValue: 'Company Name (Optional)'})}</Text>
            <TextInput style={[styles.textInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} value={formData.companyName} onChangeText={(text) => handleInputChange('companyName', text)} placeholder={t('enterCompanyName', {defaultValue: "Enter your company name"})} placeholderTextColor={colors.textSecondary} />
          </View>

          <View style={[styles.inputGroup, { zIndex: countryOpen ? 3000 : 1000 } ]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>{`${t('country', {defaultValue: 'Country'})} *`}</Text>
            <DropDownPicker open={countryOpen} value={formData.country} items={countryOptionsList} setOpen={setCountryOpen} onOpen={() => setBusinessTypeOpen(false)} setValue={(callback) => { const value = typeof callback === 'function' ? callback(formData.country) : callback; handleInputChange('country', value || ''); }} style={[styles.dropdown, { backgroundColor: colors.card, borderColor: errors.country ? colors.error : colors.border }]} dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]} textStyle={[styles.dropdownText, { color: colors.text }]} listItemLabelStyle={{ color: colors.text }} placeholder={t('selectCountry', {defaultValue: 'Select your country'})} placeholderStyle={{ color: colors.textSecondary }} searchable={true} searchPlaceholder={t('searchCountry', {defaultValue: "Search country..."})} listMode="SCROLLVIEW" zIndex={countryOpen ? 3000 : 1000} zIndexInverse={2000} dropDownDirection="AUTO" />
            {errors.country ? <Text style={[styles.errorText, { color: colors.error, marginTop: 4 }]}>{errors.country}</Text> : null}
          </View>

          <View style={[styles.inputGroup, { zIndex: businessTypeOpen ? 4000 : (countryOpen ? 500 : 1500), marginTop: errors.country ? 8 : 16 }]} >
            <Text style={[styles.inputLabel, { color: colors.text }]}>{t('businessType', {defaultValue: 'Business Type'})}</Text>
            <DropDownPicker open={businessTypeOpen} value={formData.businessType} items={businessTypes} setOpen={setBusinessTypeOpen} onOpen={() => setCountryOpen(false)} setValue={(callback) => { const value = typeof callback === 'function' ? callback(formData.businessType) : callback; handleInputChange('businessType', value || 'importer');}} style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]} dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]} textStyle={[styles.dropdownText, { color: colors.text }]} listItemLabelStyle={{ color: colors.text }} placeholderStyle={{ color: colors.textSecondary }} listMode="SCROLLVIEW" zIndex={businessTypeOpen ? 4000 : 1500} zIndexInverse={3000} dropDownDirection="AUTO"/>
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary, opacity: loading || contextAuthLoading ? 0.7 : 1 }]} onPress={handleSubmit} disabled={loading || contextAuthLoading}>
          {(loading || contextAuthLoading) ? <ActivityIndicator color={colors.white || '#FFFFFF'} size="small" /> : <Text style={[styles.saveButtonText, { color: colors.white || '#FFFFFF' }]}>{t('saveChanges', {defaultValue: 'Save Changes'})}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 60 },
  formSection: { marginBottom: 10 }, // Reduced bottom margin for sections
  sectionTitle: { fontFamily: 'Poppins-Medium', fontSize: 18, marginBottom: 20, color: '#333' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, marginBottom: 8, color: '#4A5568' },
  // inputRow: { flexDirection: 'row', alignItems: 'center', position: 'relative' }, // Not used in this version of styles
  textInput: { height: 56, borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Inter-Regular', fontSize: 15, borderWidth: 1, },
  // inputIcon: { marginRight: 10 }, 
  disabledInput: { opacity: 0.7 }, 
  errorText: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 6, marginLeft: 2, color: 'red' }, // Adjusted margin
  dropdown: { borderRadius: 8, height: 56, borderWidth: 1, paddingLeft: 12, },
  dropdownContainer: { borderWidth: 1, borderRadius: 8, },
  dropdownText: { fontFamily: 'Inter-Regular', fontSize: 15 },
  saveButton: { height: 56, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 32 },
  saveButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16 },
});
// --- END OF FILE app/personal-details.tsx (This is your Edit Profile Screen) ---