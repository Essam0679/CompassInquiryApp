// --- START OF FILE app/settings.tsx (Corrected) ---
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth, UserProfile } from '@/context/AuthContext'; // UserProfile is imported
import { useRouter } from 'expo-router'; // Changed from 'expo-router'
import Header from '@/components/common/Header';
import { Lock, Shield, HelpCircle as HelpIcon, Bell, Moon, ChevronRight, Trash2, Globe as GlobeIcon, Phone as PhoneIcon, Mail as MailIcon } from 'lucide-react-native'; // <<<< Added MailIcon
import { deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore'; 
import { db } from '@/config/firebase'; 

export default function SettingsScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  const { t, setLocale, locale } = useTranslation();
  const { currentUser, userProfile, logout, updateUserProfileInFirestore, authLoading } = useAuth();
  const router = useRouter();

  // Initialize local state from userProfile or defaults
  // These will now correctly type-check against the updated UserProfile interface
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(userProfile?.pushNotificationsEnabled ?? true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(userProfile?.emailNotificationsEnabled ?? true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setPushNotificationsEnabled(userProfile.pushNotificationsEnabled ?? true);
      setEmailNotificationsEnabled(userProfile.emailNotificationsEnabled ?? true);
    }
  }, [userProfile]);

  if (authLoading && !currentUser) {
    return (<View style={[styles.container, {justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background}]}><Header title={t('settings', {defaultValue: "Settings"})} /><ActivityIndicator size="large" color={colors.primary} /></View>);
  }
  if (!currentUser) {
    router.replace({ pathname: '/(auth)/login' as any }); // Ensure navigation type is correct
    return null;
  }

  const handleSettingToggle = async (
    settingKey: 'pushNotificationsEnabled' | 'emailNotificationsEnabled', 
    value: boolean
  ) => {
    if (!currentUser) return;
    const originalValues = { pushNotificationsEnabled, emailNotificationsEnabled };

    if (settingKey === 'pushNotificationsEnabled') setPushNotificationsEnabled(value);
    if (settingKey === 'emailNotificationsEnabled') setEmailNotificationsEnabled(value);

    try {
      // UserProfile now includes these fields, so this should work.
      await updateUserProfileInFirestore({ [settingKey]: value });
    } catch (error) {
      console.error(`Failed to update ${settingKey}:`, error);
      Alert.alert(t('error', {defaultValue: "Error"}), t('failedToUpdateSettings', {defaultValue: "Failed to update settings."}));
      if (settingKey === 'pushNotificationsEnabled') setPushNotificationsEnabled(originalValues.pushNotificationsEnabled);
      if (settingKey === 'emailNotificationsEnabled') setEmailNotificationsEnabled(originalValues.emailNotificationsEnabled);
    }
  };
  
  const handleLanguagePress = async () => {
      const newLocale = locale === 'en' ? 'ar' : 'en';
      await setLocale(newLocale);
      if (currentUser) {
          try { 
            // UserProfile now includes languagePreference, this should work.
            await updateUserProfileInFirestore({ languagePreference: newLocale }); 
          }
          catch (e) { console.log("Could not save lang pref to Firestore:", e);}
      }
  };

  const handleDeleteAccount = async () => { /* ... Same as previous correct version ... */ Alert.alert( t('deleteAccountConfirmTitle', {defaultValue: 'Delete Account?'}), t('deleteAccountConfirmMessage', {defaultValue: 'This is permanent and cannot be undone. All your data, including quotes, will be erased.'}), [ { text: t('cancel', {defaultValue: 'Cancel'}), style: 'cancel' }, { text: t('delete', {defaultValue: 'Delete'}), style: 'destructive', onPress: async () => { if (!currentUser) return; setIsDeletingAccount(true); try { console.log("Attempting to delete user profile from Firestore..."); await deleteDoc(doc(db, "users", currentUser.uid)); console.log("Firestore user profile deleted. Attempting to delete Firebase Auth user..."); await firebaseDeleteUser(currentUser); console.log("Firebase Auth user deleted."); Alert.alert(t('accountDeleted', {defaultValue: 'Account Deleted'}), t('accountDeletedMessage', {defaultValue: 'Your account has been successfully deleted.'})); } catch (error: any) { console.error("Delete Account Error:", error); let message = t('failedToDeleteAccount', {defaultValue: 'Failed to delete account. Please try again.'}); if (error.code === 'auth/requires-recent-login') { message = t('requiresRecentLoginForDelete', {defaultValue: 'This sensitive action requires you to have signed in recently. Please sign out and sign back in to delete your account.'}); } Alert.alert(t('error', {defaultValue: 'Error'}), message); } finally { setIsDeletingAccount(false); } }} ] ); };
  const handleOpenPrivacyPolicy = async () => { /* ... Same as previous correct version ... */ const url = "https://www.compasslog.com/_uploads/files/General%20Terms%20and%20Conditions%2020140330.pdf"; try { const supported = await Linking.canOpenURL(url); if (supported) { await Linking.openURL(url); } else { Alert.alert(t('error') || 'Error', `${t('cannotOpenLink') || 'Cannot open this link:'} ${url}`); } } catch (error) { console.error('Failed to open URL:', error); Alert.alert(t('error') || 'Error', t('failedToOpenLink') || 'Failed to open the link. Please try again.'); } };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('settings', {defaultValue: 'Settings'})} showBackButton={true} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('appearance', {defaultValue: 'Appearance'})}</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
            <View style={styles.menuItem}>
              <Moon size={20} color={colors.primary} style={styles.menuIcon}/>
              <Text style={[styles.menuItemText, { color: colors.text }]}>{t('darkMode', {defaultValue: 'Dark Mode'})}</Text>
              <Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: colors.primaryLight }} thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}/>
            </View>
            <MenuButton icon={<GlobeIcon size={20} color={colors.primary}/>} text={t('language', {defaultValue: "Language"})} onPress={handleLanguagePress} currentLanguageValue={locale === 'en' ? "English" : "العربية"} colors={colors} noBorder/>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('notifications', {defaultValue: 'Notifications'})}</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
            <MenuButton icon={<Bell size={20} color={colors.primary}/>} text={t('pushNotifications', {defaultValue: "Push Notifications"})} value={pushNotificationsEnabled} onToggle={(val: boolean) => handleSettingToggle('pushNotificationsEnabled', val)} isToggle colors={colors}/>
            {/* --- CORRECTED MailIcon USAGE --- */}
            <MenuButton icon={<MailIcon size={20} color={colors.primary}/>} text={t('emailNotifications', {defaultValue: "Email Notifications"})} value={emailNotificationsEnabled} onToggle={(val: boolean) => handleSettingToggle('emailNotificationsEnabled', val)} isToggle colors={colors} noBorder/>
          </View>
        </View>

        {/* ... Other sections (Security, Support, Account, Version) remain the same as previous full code ... */}
        <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text }]}>{t('security', {defaultValue: 'Security'})}</Text><View style={[styles.menuCard, { backgroundColor: colors.card }]}><MenuButton icon={<Lock size={20} color={colors.primary}/>} text={t('changePassword', {defaultValue: "Change Password"})} onPress={() => router.push('/change-password')} colors={colors}/><MenuButton icon={<Shield size={20} color={colors.primary}/>} text={t('privacyPolicy', {defaultValue: "Privacy Policy"})} onPress={() => router.push('/privacy-policy')} colors={colors} noBorder/></View></View>
        <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text }]}>{t('support', {defaultValue: 'Support'})}</Text><View style={[styles.menuCard, { backgroundColor: colors.card }]}><MenuButton icon={<HelpIcon size={20} color={colors.primary}/>} text={t('helpCenter', {defaultValue: "Help Center"})} onPress={() => router.push('/help-center')} colors={colors}/><MenuButton icon={<PhoneIcon size={20} color={colors.primary}/>} text={t('contactSupport', {defaultValue: "Contact Support"})} onPress={() => router.push('/(tabs)/contact')} colors={colors} noBorder/></View></View>
        <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text }]}>{t('account', {defaultValue: 'Account'})}</Text><View style={[styles.menuCard, { backgroundColor: colors.card }]}><TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount} disabled={isDeletingAccount}>{isDeletingAccount ? <ActivityIndicator color={colors.error} style={styles.menuIcon}/> : <Trash2 size={20} color={colors.error} style={styles.menuIcon}/>}<Text style={[styles.menuItemText, { color: colors.error }]}>{t('deleteAccount', {defaultValue: 'Delete Account'})}</Text></TouchableOpacity></View></View>
        <View style={styles.versionContainer}><Text style={[styles.versionText, { color: colors.textSecondary }]}>{`${t('version', {defaultValue: 'Version'})} 1.0.0`}</Text></View>

      </ScrollView>
    </View>
  );
}

const MenuButton = ({icon, text, onPress, value, onToggle, isToggle, currentLanguageValue, colors, noBorder}: {icon?: JSX.Element, text: string, onPress?: () => void, value?: boolean, onToggle?: (val:boolean)=>void, isToggle?: boolean, currentLanguageValue?: string, colors: any, noBorder?: boolean}) => (
    <>
    <TouchableOpacity style={styles.menuItem} onPress={isToggle ? undefined : onPress} activeOpacity={onPress ? 0.7 : 1}>
      {icon && <View style={styles.menuIcon}>{icon}</View>}
      <Text style={[styles.menuItemText, {color: colors.text}]}>{text}</Text>
      {isToggle && (
        <Switch
          trackColor={{ false: "#767577", true: colors.primaryLight }}
          thumbColor={value ? colors.primary : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggle}
          value={value}
        />
      )}
      {currentLanguageValue && <Text style={[styles.languageValue, {color: colors.textSecondary}]}>{currentLanguageValue}</Text>}
      {!isToggle && onPress && <ChevronRight size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
    {!noBorder && <View style={[styles.divider, {backgroundColor: colors.border}]} />}
    </>
);

const styles = StyleSheet.create({ /* ... Styles from your previous settings.tsx ... */ container: { flex: 1, }, scrollView: { flex: 1, }, content: { paddingBottom: 32, }, section: { marginTop: 24, paddingHorizontal: 16, }, sectionTitle: { fontFamily: 'Poppins-Medium', fontSize: 14, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }, menuCard: { borderRadius: 12, overflow: 'hidden', elevation: 1, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, borderWidth: StyleSheet.hairlineWidth, }, menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, minHeight: 50, }, menuIcon: { marginRight: 16, width: 24, alignItems: 'center' }, menuItemText: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 16, }, languageValue: { fontFamily: 'Inter-Regular', fontSize: 15, marginRight: 8, }, divider: { height: StyleSheet.hairlineWidth, marginLeft: 16 + 24 + 16, }, versionContainer: { marginVertical: 30, alignItems: 'center', }, versionText: { fontFamily: 'Inter-Regular', fontSize: 12, }, });
// --- END OF FILE app/settings.tsx (Corrected) ---