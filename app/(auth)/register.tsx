<<<<<<< HEAD
// --- START OF FILE app/(auth)/register.tsx (Corrected Full Version with Guard & All JSX) ---

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Keyboard, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth, UserProfile } from '@/context/AuthContext'; 
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Phone, Building, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { gccCountryOptionsForRegistration } from '@/config/contacts';

type OptionalProfileFields = 'companyName' | 'businessType' | 'phone' | 'country';
interface RegistrationFormSpecificFields {
    password: string;
    confirmPassword: string;
    email: string; 
    name: string; 
}
type RegistrationFormData = Partial<Pick<UserProfile, OptionalProfileFields>> & RegistrationFormSpecificFields;
type RegistrationFormErrors = Partial<Record<keyof RegistrationFormData, string>>;

=======
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Phone, Building, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
<<<<<<< HEAD
  const { register, authLoading } = useAuth(); 
  const router = useRouter();

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    companyName: '', businessType: 'importer', country: '', 
  });
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Local loading state for the button

  const businessTypes: ItemType<string>[] = [ { label: t('importer') || 'Importer', value: 'importer' }, { label: t('exporter') || 'Exporter', value: 'exporter' }, { label: t('freightForwarder') || 'Freight Forwarder', value: 'freight_forwarder' }, { label: t('personal') || 'Personal', value: 'personal' } ];
  const countryOptionsList = gccCountryOptionsForRegistration.map(opt => ({ label: `${opt.flag} ${t(opt.nameKey) || opt.defaultName}`, value: opt.value }));

  useEffect(() => { if (typeOpen || countryOpen) { Keyboard.dismiss(); } }, [typeOpen, countryOpen]);

  const validateField = (field: keyof RegistrationFormData, value: string): boolean => {
    let errorMessage = '';
    switch (field) {
      case 'name': if (!value.trim()) errorMessage = t('nameRequired', {defaultValue: 'Name is required'}); break;
      case 'email':
        if (!value.trim()) errorMessage = t('emailRequired', {defaultValue: 'Email is required'});
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMessage = t('emailInvalid', {defaultValue: 'Invalid email format'});
        break;
      case 'phone':
        if (value && value.trim() && !/^\+?[0-9\s\-()]{7,15}$/.test(value.replace(/\s/g, ''))) {
             errorMessage = t('phoneInvalid', {defaultValue: 'Invalid phone number'});
        }
        break;
      case 'password':
        if (!value) errorMessage = t('passwordRequired', {defaultValue: 'Password is required'});
        else if (value.length < 6) errorMessage = t('passwordTooShort', {defaultValue: 'Password must be at least 6 characters'});
        break;
      case 'confirmPassword':
        if (!value) errorMessage = t('confirmPasswordRequired', {defaultValue: 'Confirm password is required'});
        else if (value !== formData.password) errorMessage = t('passwordsDoNotMatch', {defaultValue: 'Passwords do not match'});
        break;
      case 'country': 
        if (!value.trim()) { 
             errorMessage = t('countryRequired', {defaultValue: 'Country is required'});
        }
        break;
    }
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
  };

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field] || field === 'password' || field === 'confirmPassword') {
      validateField(field, value); 
    }
    if (field === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword); 
    }
  };
  
  const handleBlur = (field: keyof RegistrationFormData) => {
    validateField(field, formData[field] || ''); 
  };

  const handleRegister = async () => {
    if (isRegistering || authLoading) { 
        console.log("REGISTER_SCREEN_DEBUG: Registration already in progress, skipping.");
        return; 
    }
    setIsRegistering(true); 

    setCountryOpen(false); setTypeOpen(false); 
    const requiredFieldsForValidation: (keyof RegistrationFormData)[] = ['name', 'email', 'password', 'confirmPassword', 'country'];
    let isFormValid = true;
    for (const field of requiredFieldsForValidation) {
        if (!validateField(field, formData[field] || '')) {
            isFormValid = false;
        }
    }
    if (formData.phone && formData.phone.trim() && !validateField('phone', formData.phone)) { isFormValid = false; }

    if (!isFormValid) {
      Alert.alert(t('validationFailed', {defaultValue: "Validation Failed"}), t('pleaseCheckErrors', {defaultValue: "Please check the errors in the form."}));
      setIsRegistering(false); 
      return;
    }
    try {
      const { password } = formData; 
      const profileDataForContext = (({ password: _p, confirmPassword: _cp, ...rest }) => rest)(formData);
      const profileToRegister: Pick<UserProfile, 'email' | 'name' | 'phone' | 'companyName' | 'businessType' | 'country'> = {
          email: profileDataForContext.email, 
          name: profileDataForContext.name,   
          phone: profileDataForContext.phone || undefined,
          companyName: profileDataForContext.companyName || undefined,
          businessType: profileDataForContext.businessType || undefined,
          country: profileDataForContext.country || undefined,
      };
      console.log("REGISTER_SCREEN_DEBUG: Calling AuthContext.register with profile:", JSON.stringify(profileToRegister));
      await register(profileToRegister, password); 
      console.log("REGISTER_SCREEN_DEBUG: AuthContext.register call completed.");
    } catch (error: any) {
      console.error("REGISTER_SCREEN_DEBUG: Error during registration process:", error.code, error.message);
      let friendlyMessage = t('registrationFailed', {defaultValue: "Registration Failed"});
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = t('emailAlreadyInUse', {defaultValue: "This email address is already in use."});
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = t('weakPassword', {defaultValue: "The password is too weak."});
      } else {
        friendlyMessage = t('registrationFailedSeeConsole', {defaultValue: "Registration failed. Please try again."});
      }
      Alert.alert(t('registrationFailed', {defaultValue: "Registration Failed"}), friendlyMessage);
    } finally {
      setIsRegistering(false); 
    }
  };

  const onCountryOpen = () => { setTypeOpen(false); };
  const onTypeOpen = () => { setCountryOpen(false); };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled" scrollEnabled={!typeOpen && !countryOpen}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace({ pathname: '/(auth)/login' as any })}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>{t('createAccount', {defaultValue: 'Create Account'})}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('createAccountSubtitle', {defaultValue: 'Join us to access exclusive features'})}</Text>
      
      {/* --- FORM JSX RESTORED --- */}
      <View style={styles.form}>
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: errors.name ? colors.error : colors.border }]} placeholder={t('fullName', {defaultValue: 'Full Name'})} placeholderTextColor={colors.textSecondary} value={formData.name} onChangeText={(text) => handleChange('name', text)} onBlur={() => handleBlur('name')} />
        </View>
        {errors.name ? (<Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>) : null}
        
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: errors.email ? colors.error : colors.border }]} placeholder={t('email', {defaultValue: 'Email'})} placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(text) => handleChange('email', text)} onBlur={() => handleBlur('email')} />
        </View>
        {errors.email ? (<Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>) : null}
        
        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: errors.phone ? colors.error : colors.border }]} placeholder={t('phone', {defaultValue: 'Phone Number (Optional)'})} placeholderTextColor={colors.textSecondary} keyboardType="phone-pad" value={formData.phone || ''} onChangeText={(text) => handleChange('phone', text)} onBlur={() => handleBlur('phone')} />
        </View>
        {errors.phone ? (<Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text>) : null}
        
        {/* Country Dropdown */}
        <View style={{ zIndex: countryOpen ? 5000 : 3000, marginBottom: errors.country ? 0 : 16 }}>
            <Text style={[styles.dropdownLabel, { color: colors.text, marginTop: 8 }]}>
                {`${t('country', {defaultValue: 'Country'})}`} 
                <Text style={{color: colors.error}}> *</Text> 
            </Text>
            <DropDownPicker
                open={countryOpen} value={formData.country || null} items={countryOptionsList}
                setOpen={setCountryOpen}
                setValue={(callback) => { const val = typeof callback === 'function' ? callback(formData.country || null) : callback; handleChange('country', val || ''); }}
                onOpen={onCountryOpen} style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: errors.country ? colors.error : colors.border }]} dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} textStyle={[styles.dropdownText, { color: colors.text }]} listItemLabelStyle={{ color: colors.text }} placeholder={t('selectCountry', {defaultValue: 'Select your country'})} placeholderStyle={{ color: colors.textSecondary }} searchable={true} searchPlaceholder={t('searchCountry', {defaultValue: "Search country..."})} listMode="SCROLLVIEW" zIndex={countryOpen ? 5000 : 3000} zIndexInverse={1000} dropDownDirection="AUTO"/>
        </View>
        {errors.country ? (<Text style={[styles.errorText, { color: colors.error, marginTop: 8, marginBottom: 8 }]}>{errors.country}</Text>) : (<View style={{height: errors.country ? 0 : (Platform.OS === 'ios' ? 0 : 8)}} />) }

        {/* Company Name Input */}
        <View style={styles.inputContainer}>
          <Building size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]} placeholder={t('companyNameOptional', {defaultValue: 'Company Name (Optional)'})} placeholderTextColor={colors.textSecondary} value={formData.companyName || ''} onChangeText={(text) => handleChange('companyName', text)} onBlur={() => handleBlur('companyName')} />
        </View>
        
        {/* Business Type Dropdown */}
        <View style={{ zIndex: typeOpen ? 4000 : 2000, marginBottom: 16 }}>
            <Text style={[styles.dropdownLabel, { color: colors.text }]}>{t('businessType', {defaultValue: 'Business Type'})}</Text>
            <DropDownPicker
                open={typeOpen} value={formData.businessType || null} items={businessTypes}
                setOpen={setTypeOpen}
                setValue={(callback) => { const val = typeof callback === 'function' ? callback(formData.businessType || null) : callback; handleChange('businessType', val || 'importer'); }}
                onOpen={onTypeOpen} style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} textStyle={[styles.dropdownText, { color: colors.text }]} listItemLabelStyle={{ color: colors.text }} placeholderStyle={{ color: colors.textSecondary }} listMode="SCROLLVIEW" zIndex={typeOpen ? 4000 : 2000} zIndexInverse={2000} dropDownDirection="AUTO"/>
        </View>
        
        {/* Password Input */}
        <View style={styles.inputContainer}><Lock size={20} color={colors.textSecondary} style={styles.inputIcon} /><TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: errors.password ? colors.error : colors.border }]} placeholder={t('password', {defaultValue: 'Password'})} placeholderTextColor={colors.textSecondary} secureTextEntry={!showPassword} value={formData.password} onChangeText={(text) => handleChange('password', text)} onBlur={() => handleBlur('password')} /><TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}</TouchableOpacity></View>
        {errors.password ? (<Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>) : null}

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}><Lock size={20} color={colors.textSecondary} style={styles.inputIcon} /><TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: errors.confirmPassword ? colors.error : colors.border }]} placeholder={t('confirmPassword', {defaultValue: 'Confirm Password'})} placeholderTextColor={colors.textSecondary} secureTextEntry={!showConfirmPassword} value={formData.confirmPassword} onChangeText={(text) => handleChange('confirmPassword', text)} onBlur={() => handleBlur('confirmPassword')} /><TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}</TouchableOpacity></View>
        {errors.confirmPassword ? (<Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>) : null}

        {/* Register Button */}
        <TouchableOpacity 
            style={[styles.registerButton, { backgroundColor: colors.primary }]} 
            onPress={handleRegister} 
            disabled={isRegistering || authLoading} 
        >
          {(isRegistering || authLoading) ? (<ActivityIndicator color={colors.white || '#FFFFFF'} size="small" />) : (<Text style={[styles.registerButtonText, { color: colors.white || '#FFFFFF' }]}>{t('createAccount', {defaultValue: 'Create Account'})}</Text>)}
        </TouchableOpacity>
        
        {/* Login Link Section - RESTORED */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>{t('alreadyHaveAccount', {defaultValue: 'Already have an account?'})}</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)/login' as any })}> 
            <Text style={[styles.loginLink, { color: colors.primary }]}>{t('signIn', {defaultValue: 'Sign In'})}</Text>
=======
  const { login } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    businessType: 'importer'
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [typeOpen, setTypeOpen] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([
    { label: t('importer'), value: 'importer' },
    { label: t('exporter'), value: 'exporter' },
    { label: t('freightForwarder'), value: 'freight_forwarder' },
    { label: t('personal'), value: 'personal' }
  ]);
  
  const validateField = (field: string, value: string) => {
    let errorMessage = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errorMessage = t('nameRequired');
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMessage = t('emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = t('emailInvalid');
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errorMessage = t('phoneRequired');
        } else if (!/^\+?[0-9]{7,15}$/.test(value.replace(/\s/g, ''))) {
          errorMessage = t('phoneInvalid');
        }
        break;
      case 'password':
        if (!value) {
          errorMessage = t('passwordRequired');
        } else if (value.length < 6) {
          errorMessage = t('passwordTooShort');
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errorMessage = t('confirmPasswordRequired');
        } else if (value !== formData.password) {
          errorMessage = t('passwordsDoNotMatch');
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
  };
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
    
    // Validate confirmPassword if password changes
    if (field === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };
  
  const handleBlur = (field: string) => {
    validateField(field, formData[field]);
  };
  
  const handleRegister = async () => {
    // Validate all fields
    const nameValid = validateField('name', formData.name);
    const emailValid = validateField('email', formData.email);
    const phoneValid = validateField('phone', formData.phone);
    const passwordValid = validateField('password', formData.password);
    const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);
    
    if (nameValid && emailValid && phoneValid && passwordValid && confirmPasswordValid) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        login({
          id: '1',
          email: formData.email,
          name: formData.name,
          company: formData.company,
          type: formData.businessType
        });
        setLoading(false);
        router.replace('/(tabs)');
      }, 1500);
    }
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]}>
        {t('createAccount')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {t('createAccountSubtitle')}
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: errors.name ? colors.error : colors.border
              }
            ]}
            placeholder={t('fullName')}
            placeholderTextColor={colors.textSecondary}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            onBlur={() => handleBlur('name')}
          />
        </View>
        {errors.name ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: errors.email ? colors.error : colors.border
              }
            ]}
            placeholder={t('email')}
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
          />
        </View>
        {errors.email ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: errors.phone ? colors.error : colors.border
              }
            ]}
            placeholder={t('phone')}
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            onBlur={() => handleBlur('phone')}
          />
        </View>
        {errors.phone ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Building size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            placeholder={t('companyName')}
            placeholderTextColor={colors.textSecondary}
            value={formData.company}
            onChangeText={(text) => handleChange('company', text)}
          />
        </View>
        <Text style={[styles.optionalText, { color: colors.textSecondary }]}>
          ({t('optional')})
        </Text>
        
        <Text style={[styles.dropdownLabel, { color: colors.text }]}>
          {t('businessType')}
        </Text>
        <DropDownPicker
          open={typeOpen}
          value={formData.businessType}
          items={businessTypes}
          setOpen={setTypeOpen}
          setValue={(callback) => {
            if (typeof callback === 'function') {
              const value = callback(formData.businessType);
              setFormData(prev => ({ ...prev, businessType: value }));
            } else {
              setFormData(prev => ({ ...prev, businessType: callback }));
            }
          }}
          setItems={setBusinessTypes}
          style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
          dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
          textStyle={[styles.dropdownText, { color: colors.text }]}
          listItemLabelStyle={{ color: colors.text }}
          placeholderStyle={{ color: colors.textSecondary }}
          zIndex={3000}
          zIndexInverse={1000}
        />
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: errors.password ? colors.error : colors.border
              }
            ]}
            placeholder={t('password')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            onBlur={() => handleBlur('password')}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: errors.confirmPassword ? colors.error : colors.border
              }
            ]}
            placeholder={t('confirmPassword')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            onBlur={() => handleBlur('confirmPassword')}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>
        ) : null}
        
        <TouchableOpacity 
          style={[styles.registerButton, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={[styles.registerButtonText, { color: colors.white }]}>
              {t('createAccount')}
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            {t('alreadyHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              {t('signIn')}
            </Text>
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({ /* ... Your existing styles from previous full file ... */ container: { flex: 1, }, contentContainer: { flexGrow: 1, padding: 24, paddingBottom: Platform.OS === 'ios' ? 100 : 60, }, backButton: { marginBottom: 24, alignSelf: 'flex-start', padding: 4, }, title: { fontFamily: 'Poppins-Bold', fontSize: 28, marginBottom: 8, textAlign: 'left', }, subtitle: { fontFamily: 'Inter-Regular', fontSize: 16, marginBottom: 32, textAlign: 'left', }, form: { width: '100%', }, inputContainer: { position: 'relative', marginBottom: 0, }, input: { height: 56, borderRadius: 8, paddingLeft: 48, paddingRight: 48, fontSize: 16, fontFamily: 'Inter-Regular', borderWidth: 1, }, inputIcon: { position: 'absolute', left: 16, top: 18, zIndex: 1, }, eyeButton: { position: 'absolute', right: 0, top: 0, height: 56, width: 56, justifyContent: 'center', alignItems: 'center', zIndex: 1, }, errorText: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 4, marginBottom: 12, marginLeft: 4, }, optionalText: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: -4, marginBottom: 16, marginLeft: 4, }, dropdownLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, marginBottom: 8, marginTop: 16, }, dropdown: { borderRadius: 8, height: 56, borderWidth: 1, paddingLeft: 8, }, dropdownContainer: { borderWidth: 1, borderRadius: 8, }, dropdownText: { fontFamily: 'Inter-Regular', fontSize: 16, }, registerButton: { height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 24, }, registerButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, }, loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }, loginText: { fontFamily: 'Inter-Regular', fontSize: 14, marginRight: 4, }, loginLink: { fontFamily: 'Inter-SemiBold', fontSize: 14, }, });
// --- END OF FILE app/(auth)/register.tsx (Corrected Full Version with Guard & All JSX) ---
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 8,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 18,
    zIndex: 1,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  optionalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 16,
    marginLeft: 4,
  },
  dropdownLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderRadius: 8,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
  },
  dropdownContainer: {
    borderWidth: 1,
  },
  dropdownText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  registerButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  registerButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  loginLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
