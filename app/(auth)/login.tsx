// --- START OF FILE app/(auth)/login.tsx (CORRECTED for Firebase Auth) ---

import { useState } from 'react'; // Removed useEffect as it wasn't used
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext'; // Your NEW AuthContext
import { useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { t, setLocale, locale } = useTranslation();
  const { login, authLoading } = useAuth(); // Use 'login' and 'authLoading' from NEW AuthContext
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // No longer need local 'loading' state; use 'authLoading' from context
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLanguageChange = async (newLocale: 'en' | 'ar') => {
    if (newLocale !== locale) { await setLocale(newLocale); }
  };
  
  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue.trim()) { setEmailError(t('emailRequired', {defaultValue: "Email is required."})); return false; }
    if (!emailRegex.test(emailValue)) { setEmailError(t('emailInvalid', {defaultValue: "Invalid email format."})); return false; }
    setEmailError(''); return true;
  };
  
  const validatePassword = (passwordValue: string): boolean => {
    if (!passwordValue) { setPasswordError(t('passwordRequired', {defaultValue: "Password is required."})); return false; }
    if (passwordValue.length < 6) { setPasswordError(t('passwordTooShort', {defaultValue: "Password must be at least 6 characters."})); return false; }
    setPasswordError(''); return true;
  };
  
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) return;
    
    // authLoading state is now managed by AuthContext's login function
    try {
      console.log("LOGIN_SCREEN_DEBUG: Attempting Firebase login with email:", email);
      await login(email, password); // Call the Firebase Auth login from context
      console.log("LOGIN_SCREEN_DEBUG: AuthContext.login call completed.");
      // Navigation will be handled by RootLayout based on currentUser state changes
    } catch (error: any) {
      console.error("LOGIN_SCREEN_DEBUG: Firebase Login Error - Code:", error.code, "Message:", error.message);
      let friendlyMessage = t('loginFailed', {defaultValue: "Login Failed"});
      if (error.code === 'auth/user-not-found' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/invalid-credential' || // Broader error for invalid email/password
          error.code === 'auth/invalid-email') { // Specific invalid email format by Firebase
        friendlyMessage = t('invalidEmailOrPassword', {defaultValue: "Invalid email or password."});
      } else if (error.code === 'auth/too-many-requests') {
        friendlyMessage = t('tooManyLoginAttempts', {defaultValue: "Too many login attempts. Please try again later or reset your password."});
      } else {
        friendlyMessage = t('loginFailedSeeConsole', {defaultValue: "Login failed. Please check details or try again."}); 
      }
      Alert.alert(t('loginFailed', {defaultValue: "Login Failed"}), friendlyMessage);
    }
    // setLoading(false); // Not needed, authLoading handles this
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Language Switcher */}
      <View style={styles.languageSwitcherContainer}>
        <TouchableOpacity style={[styles.languageButton, locale === 'en' ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 },]} onPress={() => handleLanguageChange('en')} >
          <Text style={[styles.languageButtonText, locale === 'en' ? { color: colors.white } : { color: colors.textSecondary }]}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.languageButton, locale === 'ar' ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 },]} onPress={() => handleLanguageChange('ar')} >
          <Text style={[styles.languageButtonText, locale === 'ar' ? { color: colors.white } : { color: colors.textSecondary }]}>العربية</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: colors.primary }]}>
          {t('appName', {defaultValue: "Compass App"})}
        </Text>
      </View>
      
      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{t('signIn', {defaultValue: "Sign In"})}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('signInSubtitle', {defaultValue: "Welcome back! Sign in to continue."})}</Text>
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: emailError ? colors.error : colors.border }]} placeholder={t('email', {defaultValue: "Email"})} placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(text) => { setEmail(text); if (emailError) validateEmail(text); }} onBlur={() => validateEmail(email)}/>
        </View>
        {emailError ? <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text> : null}
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: passwordError ? colors.error : colors.border }]} placeholder={t('password', {defaultValue: "Password"})} placeholderTextColor={colors.textSecondary} secureTextEntry={!showPassword} value={password} onChangeText={(text) => { setPassword(text); if (passwordError) validatePassword(text); }} onBlur={() => validatePassword(password)}/>
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}</TouchableOpacity>
        </View>
        {passwordError ? <Text style={[styles.errorText, { color: colors.error }]}>{passwordError}</Text> : null}
        
        <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push({ pathname: '/(auth)/forgot-password' as any })}>
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>{t('forgotPassword', {defaultValue: "Forgot Password?"})}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.primary }]} 
            onPress={handleLogin} 
            disabled={authLoading} // Use authLoading from context
        >
          {authLoading ? (<ActivityIndicator color={colors.white} size="small" />) 
                       : (<Text style={[styles.loginButtonText, { color: colors.white }]}>{t('signIn', {defaultValue: "Sign In"})}</Text>)}
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>{t('dontHaveAccount', {defaultValue: "Don't have an account?"})}</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)/register' as any })}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>{t('register', {defaultValue: "Register"})}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ /* ... Your existing styles from before ... */ container: { flex: 1, }, contentContainer: { flexGrow: 1, justifyContent: 'center', padding: 24, }, languageSwitcherContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginTop: Platform.OS === 'ios' ? 40 : 20, }, languageButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginHorizontal: 5, minWidth: 100, alignItems: 'center', }, languageButtonText: { fontFamily: 'Inter-SemiBold', fontSize: 14, }, logoContainer: { alignItems: 'center', marginBottom: 40, }, logoText: { fontFamily: 'Poppins-Bold', fontSize: 32, }, formContainer: { width: '100%', }, title: { fontFamily: 'Poppins-Bold', fontSize: 28, marginBottom: 8, textAlign: 'center' }, subtitle: { fontFamily: 'Inter-Regular', fontSize: 16, marginBottom: 32, textAlign: 'center' }, inputContainer: { position: 'relative', marginBottom: 8, }, input: { height: 56, borderRadius: 8, paddingLeft: 48, paddingRight: 48, fontSize: 16, fontFamily: 'Inter-Regular', borderWidth: 1, }, inputIcon: { position: 'absolute', left: 16, top: 18, zIndex: 1, }, eyeButton: { position: 'absolute', right: 0, top: 0, height: 56, width: 56, justifyContent: 'center', alignItems: 'center', zIndex: 1, }, errorText: { fontFamily: 'Inter-Regular', fontSize: 12, marginBottom: 8, marginLeft: 4, }, forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, }, forgotPasswordText: { fontFamily: 'Inter-Regular', fontSize: 14, }, loginButton: { height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 24, }, loginButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, }, registerContainer: { flexDirection: 'row', justifyContent: 'center', }, registerText: { fontFamily: 'Inter-Regular', fontSize: 14, marginRight: 4, }, registerLink: { fontFamily: 'Inter-SemiBold', fontSize: 14, }, });
// --- END OF FILE app/(auth)/login.tsx (CORRECTED for Firebase Auth) ---
