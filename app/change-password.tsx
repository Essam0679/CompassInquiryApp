// --- START OF FILE app/change-password.tsx (Corrected) ---
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native'; // Added ScrollView, ActivityIndicator
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import Header from '@/components/common/Header';
import { updatePassword as firebaseUpdatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { currentUser } = useAuth(); // Get currentUser from useAuth
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    setError('');
    if (!currentUser || !currentUser.email) { // Check for currentUser and email
      Alert.alert(t('error', {defaultValue: "Error"}), t('notLoggedInOrEmailMissing', {defaultValue: "You are not logged in or your email is missing."}));
      return;
    }
    if (!newPassword) {
        setError(t('newPasswordRequired', {defaultValue: 'New password is required.'}));
        return;
    }
    if (newPassword.length < 6) {
      setError(t('passwordTooShort', {defaultValue: "Password must be at least 6 characters."}));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t('passwordsDoNotMatch', {defaultValue: "Passwords do not match."}));
      return;
    }
    // Check if the user signed in with Email/Password provider
    const isEmailProvider = currentUser.providerData.some(
      (provider) => provider.providerId === EmailAuthProvider.PROVIDER_ID
    );

    if (isEmailProvider && !currentPassword) {
        setError(t('currentPasswordRequiredForChange', {defaultValue: "Current password is required to change password."}));
        return;
    }


    setLoading(true);
    try {
      if (isEmailProvider && currentPassword) { // Only re-authenticate if email provider and current password provided
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        console.log("Attempting to re-authenticate...");
        await reauthenticateWithCredential(currentUser, credential);
        console.log("User re-authenticated successfully.");
      }
      // If not email provider (e.g. Google Sign In), re-authentication is different or might not be needed for all actions.
      // For password change specifically, it's usually tied to email/password auth.

      console.log("Attempting to update password...");
      await firebaseUpdatePassword(currentUser, newPassword);
      Alert.alert(
        t('passwordChangedSuccessTitle', {defaultValue: "Success"}), 
        t('passwordChangedSuccessMessage', {defaultValue: "Your password has been changed successfully."}),
        [{ text: t('ok', {defaultValue: "OK"}), onPress: () => router.back()}]
      );
      setCurrentPassword(''); // Clear fields
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error("Change Password Error:", err.code, err.message);
      let friendlyMessage = t('failedToChangePassword', {defaultValue: "Failed to change password. Please try again."});
      if (err.code === 'auth/wrong-password') {
        friendlyMessage = t('currentPasswordIncorrect', {defaultValue: "The current password you entered is incorrect."});
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = t('newPasswordTooWeak', {defaultValue: "The new password is too weak."});
      } else if (err.code === 'auth/requires-recent-login') {
        friendlyMessage = t('requiresRecentLogin', {defaultValue: "This operation is sensitive and requires recent authentication. Please sign out and sign back in."});
      }
      setError(friendlyMessage);
      Alert.alert(t('error', {defaultValue: "Error"}), friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('changePassword', {defaultValue: 'Change Password'})} showBackButton={true} />
      <ScrollView style={styles.contentScrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>{t('currentPassword', {defaultValue: 'Current Password'})}</Text>
            <TextInput
                style={[styles.input, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder={t('enterCurrentPassword', {defaultValue: 'Enter your current password'})}
                placeholderTextColor={colors.textSecondary}
            />
        </View>
        <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>{t('newPassword', {defaultValue: 'New Password'})}</Text>
            <TextInput
                style={[styles.input, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder={t('enterNewPassword', {defaultValue: 'Enter new password (min. 6 characters)'})}
                placeholderTextColor={colors.textSecondary}
            />
        </View>
        <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>{t('confirmNewPassword', {defaultValue: 'Confirm New Password'})}</Text>
            <TextInput
                style={[styles.input, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry
                placeholder={t('confirmNewPasswordPlaceholder', {defaultValue: 'Re-enter new password'})}
                placeholderTextColor={colors.textSecondary}
            />
        </View>
        {error ? <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text> : null}
        <TouchableOpacity 
            style={[styles.button, {backgroundColor: colors.primary, opacity: loading ? 0.7 : 1}]}
            onPress={handleChangePassword}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color={colors.white}/> : <Text style={[styles.buttonText, {color: colors.white}]}>{t('updatePassword', {defaultValue: 'Update Password'})}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  contentScrollView: {flex: 1},
  content: { padding: 20, paddingTop: 30 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 15, marginBottom: 10, fontFamily: 'Inter-Medium' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, fontFamily: 'Inter-Regular' },
  button: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { fontSize: 16, fontFamily: 'Poppins-Medium' },
  errorText: { textAlign: 'center', marginBottom: 15, fontFamily: 'Inter-Regular' } // Made error text red by default in component
});
// --- END OF FILE app/change-password.tsx (Corrected) ---