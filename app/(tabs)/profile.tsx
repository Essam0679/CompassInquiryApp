// --- START OF FILE app/(tabs)/profile.tsx (Corrected) ---
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, ActivityIndicator } from 'react-native'; // Added Switch, ActivityIndicator
import { useAuth, UserProfile } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/context/I18nContext'; 
import Header from '@/components/common/Header'; 
import { User as UserIcon, Settings as SettingsIcon, LogOut, Edit3, Moon, Bell, Globe, Shield, ChevronRight, HelpCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react'; // Added useState, useEffect

export default function ProfileScreen() {
  const { currentUser, userProfile, logout, updateUserProfileInFirestore, loading: authContextLoading } = useAuth(); // Added updateUserProfileInFirestore
  const { colors, toggleTheme, theme } = useTheme();
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();

  // Initialize from userProfile if available, otherwise default
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(userProfile?.pushNotificationsEnabled ?? true);

  // Sync local state when userProfile loads or changes
  useEffect(() => {
    if (userProfile) {
      setPushNotificationsEnabled(userProfile.pushNotificationsEnabled ?? true);
    }
  }, [userProfile]);


  const handleLogout = async () => {
    try {
        await logout();
    } catch (error: any) { 
        console.error("PROFILE_SCREEN_DEBUG: Error during logout", error);
        Alert.alert(
            t('logoutErrorTitle', {defaultValue: "Logout Failed"}), 
            t('logoutErrorMessage', {defaultValue: "Could not log out. Please try again."}) // Removed error.message for generic user message
        );
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (!currentUser) return; // Should not happen if screen is protected

    setPushNotificationsEnabled(value); // Optimistic update
    try {
        // Ensure UserProfile in AuthContext has pushNotificationsEnabled
        await updateUserProfileInFirestore({ pushNotificationsEnabled: value });
    } catch (error) {
        console.error("Failed to update notification preference:", error);
        Alert.alert(t('error', {defaultValue: "Error"}), t('failedToUpdateSettings', {defaultValue: "Failed to update notification settings."}));
        setPushNotificationsEnabled(!value); // Revert on error
    }
  };
  
  const handleLanguagePress = async () => {
      const newLocale = locale === 'en' ? 'ar' : 'en';
      await setLocale(newLocale); // setLocale is async
      // Optionally store language preference in userProfile
      // if (currentUser) {
      //   try {
      //     await updateUserProfileInFirestore({ languagePreference: newLocale }); // Assuming languagePreference field
      //   } catch (langError) { console.error("Failed to save language pref:", langError); }
      // }
  };


  if (authContextLoading && !currentUser) { 
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        {/* No Header here, or a generic one, as profile data isn't ready */}
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Header title={t('profile', {defaultValue: "Profile"})} showBackButton={false}/>
        <Text style={[styles.messageText, { color: colors.text }]}>
          {t('signInToViewProfile', {defaultValue: "Please sign in to view your profile."})}
        </Text>
        <TouchableOpacity 
          style={[styles.buttonStyle, { backgroundColor: colors.primary }]} 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={[styles.buttonTextStyle, {color: colors.white}]}>{t('signIn', {defaultValue: "Sign In"})}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileName = userProfile?.name || currentUser.displayName || t('user', {defaultValue: "User"});
  const profileEmail = currentUser.email || t('emailNotAvailable', {defaultValue: "Email not available"});
  const initial = profileName ? profileName.charAt(0).toUpperCase() : "?";


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('profile', {defaultValue: "Profile"})} showBackButton={false}/>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainerScrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, {backgroundColor: colors.card}]}>
            <View style={[styles.avatarContainer, {backgroundColor: colors.primaryLight}]}>
                <Text style={[styles.avatarText, {color: colors.primary}]}>{initial}</Text>
            </View>
            <View style={styles.profileInfo}>
                <Text style={[styles.profileName, {color: colors.text}]}>{profileName}</Text>
                <Text style={[styles.profileEmail, {color: colors.textSecondary}]}>{profileEmail}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/personal-details')}>
                <Text style={{color: colors.primary, fontFamily: 'Inter-Medium'}}>{t('edit', {defaultValue: "Edit"})}</Text>
            </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('account', {defaultValue: "Account"})}</Text>
          <View style={[styles.menuCard, {backgroundColor: colors.card}]}>
            <MenuButton icon={<UserIcon size={20} color={colors.primary}/>} text={t('personalDetails', {defaultValue: "Personal Details"})} onPress={() => router.push('/personal-details')} colors={colors}/>
            <MenuButton icon={<SettingsIcon size={20} color={colors.primary}/>} text={t('settings', {defaultValue: "Settings"})} onPress={() => router.push('/settings')} colors={colors} noBorder/>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('preferences', {defaultValue: "Preferences"})}</Text>
          <View style={[styles.menuCard, {backgroundColor: colors.card}]}>
            <View style={styles.menuItem}>
                <Moon size={20} color={colors.primary} style={styles.menuIcon}/>
                <Text style={[styles.menuItemText, {color: colors.text}]}>{t('darkMode', {defaultValue: "Dark Mode"})}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: colors.primaryLight }}
                    thumbColor={theme === 'dark' ? colors.primary : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={theme === 'dark'}
                />
            </View>
            <MenuButton icon={<Bell size={20} color={colors.primary}/>} text={t('notifications', {defaultValue: "Notifications"})} value={pushNotificationsEnabled} onToggle={handleNotificationToggle} isToggle colors={colors} noBorderIfLast/>
            <MenuButton icon={<Globe size={20} color={colors.primary}/>} text={t('language', {defaultValue: "Language"})} onPress={handleLanguagePress} currentLanguageValue={locale === 'en' ? "English" : "العربية"} colors={colors} noBorder/>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>{t('more', {defaultValue: "More"})}</Text>
          <View style={[styles.menuCard, {backgroundColor: colors.card}]}>
            <MenuButton icon={<Shield size={20} color={colors.primary} />} text={t('aboutApp', {defaultValue: "About Compass"})} onPress={() => Alert.alert(t('aboutApp', {defaultValue: "About Compass"}), `${t('appName', {defaultValue: "Compass Ocean Logistics"})}\n${t('version', {defaultValue: "Version"})}: 1.0.0`)} colors={colors}/>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <LogOut size={20} color={colors.error} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, {color: colors.error}]}>{t('logout', {defaultValue: "Logout"})}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.versionContainer}>
            <Text style={[styles.versionText, {color: colors.textSecondary}]}>
                {`${t('version', {defaultValue: "Version"})} 1.0.0`}
            </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const MenuButton = ({icon, text, onPress, value, onToggle, isToggle, currentLanguageValue, colors, noBorder, noBorderIfLast}: any) => (
    <>
    <TouchableOpacity style={styles.menuItem} onPress={isToggle ? () => {} : onPress} activeOpacity={onPress ? 0.7 : 1}>
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
    {!(noBorder || noBorderIfLast) && <View style={[styles.divider, {backgroundColor: colors.border}]} />}
    </>
);

const styles = StyleSheet.create({
  container: { flex: 1, },
  scrollView: { flex: 1, },
  contentContainerScrollView: { paddingBottom: 30, },
  centerContent: { justifyContent: 'center', alignItems: 'center', padding: 20, flex: 1},
  messageText: { fontSize: 16, textAlign: 'center', marginBottom: 20, fontFamily: 'Inter-Regular' }, // Adjusted font size
  buttonStyle: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, alignItems: 'center', marginTop: 10, minWidth: 150, alignSelf: 'center' },
  buttonTextStyle: { fontSize: 16, fontFamily: 'Poppins-Medium', },
  profileHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, marginHorizontal:16, marginTop: 10, marginBottom: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16, },
  avatarText: { fontSize: 22, fontFamily: 'Poppins-Medium', },
  profileInfo: { flex: 1, },
  profileName: { fontSize: 18, fontFamily: 'Poppins-SemiBold', },
  profileEmail: { fontSize: 14, fontFamily: 'Inter-Regular', },
  section: { marginBottom: 24, paddingHorizontal: 16, },
  sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, marginBottom: 12, }, // Made section title bolder
  menuCard: { borderRadius: 12, overflow: 'hidden', elevation: 1, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, borderWidth: StyleSheet.hairlineWidth, },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, },
  menuIcon: { marginRight: 16, width: 24, alignItems: 'center' },
  menuItemText: { flex: 1, fontFamily: 'Inter-Medium', fontSize: 16, }, // Slightly bolder menu item text
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 16 + 24 + 16, },
  languageValue: { fontFamily: 'Inter-Regular', fontSize: 15, marginRight: 8, },
  versionContainer: { alignItems: 'center', paddingVertical: 20, },
  versionText: { fontFamily: 'Inter-Regular', fontSize: 12, },
  // Copied from previous profile screen for consistency - these might not be used directly if structure changes
  content: { paddingHorizontal: 0, paddingTop: 0, }, // Removed padding from content if sections handle it
  titleText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, fontFamily: 'Poppins-Bold', textAlign: 'center' },
});
// --- END OF FILE app/(tabs)/profile.tsx (Corrected & Updated) ---
