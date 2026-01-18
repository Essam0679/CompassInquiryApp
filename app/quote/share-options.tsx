<<<<<<< HEAD
// --- START OF FILE app/quote/share-options.tsx (MODIFIED for new AuthContext & userCountryForRouting fix) ---

import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
=======
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import { Mail, Phone, X } from 'lucide-react-native';
import { Linking } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
<<<<<<< HEAD
import { useAuth } from '@/context/AuthContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MailComposer from 'expo-mail-composer';
import * as Sharing from 'expo-sharing';
import { getContactInfoForCountry, CountryContactInfo } from '@/config/contacts';
import { formatQuoteDataForMessage, formatDisplayValue, QuoteData } from '@/utils/quoteFormatter';

interface DocumentFile { uri?: string | null; name?: string; type?: string; }
interface QuoteDocuments { commercialInvoice?: DocumentFile | null; certificateOfOrigin?: DocumentFile | null; transportDocument?: DocumentFile | null; packingList?: DocumentFile | null; otherDocuments?: Array<DocumentFile>; }
=======
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0

export default function ShareOptionsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
<<<<<<< HEAD
  const { currentUser, userProfile } = useAuth(); 

  const getPrimaryDocumentUri = (quoteData: QuoteData): string | null => { if (quoteData.quoteType === 'Customs Clearance' && quoteData.documents) { return quoteData.documents.commercialInvoice?.uri || quoteData.documents.packingList?.uri || quoteData.documents.transportDocument?.uri || null; } return typeof quoteData.packingList === 'string' ? quoteData.packingList : null; };

  const saveQuoteToFirestore = async (quoteData: QuoteData, sendMethodUsed: string, contactInfo: CountryContactInfo) => {
    if (!currentUser) { Alert.alert(t('error', {defaultValue: "Error"}), t('userNotAuthenticated', {defaultValue: "User not authenticated. Please login again."})); throw new Error("User not authenticated for Firestore save."); }
    const firestoreQuoteData = { ...quoteData };
    if (firestoreQuoteData.packingList && typeof firestoreQuoteData.packingList === 'string' && firestoreQuoteData.packingList.startsWith('file://')) { firestoreQuoteData.packingList = 'local_file_uri_placeholder'; }
    if (firestoreQuoteData.documents) { const docsToUpdate = firestoreQuoteData.documents as any; (Object.keys(docsToUpdate) as Array<keyof QuoteDocuments>).forEach(docKey => { const documentEntry = docsToUpdate[docKey]; if (docKey === 'otherDocuments' && Array.isArray(documentEntry)) { docsToUpdate.otherDocuments = documentEntry.map(otherDoc => (otherDoc && otherDoc.uri && typeof otherDoc.uri === 'string' && otherDoc.uri.startsWith('file://') ? { ...otherDoc, uri: 'local_file_uri_placeholder' } : otherDoc)); } else if (documentEntry && typeof documentEntry === 'object' && 'uri' in documentEntry && documentEntry.uri && typeof documentEntry.uri === 'string' && documentEntry.uri.startsWith('file://')) { docsToUpdate[docKey] = { ...documentEntry, uri: 'local_file_uri_placeholder' }; } }); }
    const enrichedFirestoreQuoteData = { ...firestoreQuoteData, requesterName: userProfile?.name || currentUser?.displayName || t('notProvided', { defaultValue: 'Not Provided' }), requesterEmail: userProfile?.email || currentUser?.email || t('notProvided', { defaultValue: 'Not Provided' }), requesterPhone: userProfile?.phone || t('notProvided', { defaultValue: 'Not Provided' }), requesterCompany: userProfile?.companyName || t('notProvided', { defaultValue: 'Not Provided' }), requesterBusinessType: userProfile?.businessType ? (t(userProfile.businessType) || userProfile.businessType) : t('notProvided', { defaultValue: 'Not Provided' }), requesterCountry: userProfile?.country ? (t(userProfile.country) || userProfile.country) : t('notProvided', { defaultValue: 'Not Provided' }), };
    let firestoreUserActionStatus: 'pending' | 'sent'; let firestoreSendCount: number; let firestoreLastSentTimestamp: string | null = null;
    if (sendMethodUsed === 'email' || sendMethodUsed === 'whatsapp') { firestoreUserActionStatus = 'sent'; firestoreSendCount = 1; firestoreLastSentTimestamp = new Date().toISOString(); } else { firestoreUserActionStatus = 'pending'; firestoreSendCount = 0; }
    const finalDataForFirestore = { ...enrichedFirestoreQuoteData, userId: currentUser.uid, userAppCountry: userProfile?.country || 'UNKNOWN', status: firestoreUserActionStatus, sendCount: firestoreSendCount, lastSentTimestamp: firestoreLastSentTimestamp, createdAt: new Date().toISOString(), sendMethod: sendMethodUsed || 'saved_only', targetEmails: contactInfo.emails, targetWhatsApp: contactInfo.whatsapp, internalStatus: 'received', };
    console.log("SHARE_OPTIONS_DEBUG: Final data for Firestore:", JSON.stringify(finalDataForFirestore, null, 2));
    try { await addDoc(collection(db, 'quotes'), finalDataForFirestore); console.log("SHARE_OPTIONS_DEBUG: Quote saved to Firestore."); } catch (e: any) { console.error("SHARE_OPTIONS_DEBUG: CRITICAL ERROR saving to Firestore:", e.message, e.code); Alert.alert(t('error', {defaultValue: "Error"}), t('failedToSaveQuoteDetailsSystem', {defaultValue: "Failed to save quote details to our system. Error: " + e.message })); throw e; }
  };

  const proceedToSuccess = async (clearData: boolean) => { if (clearData) { await AsyncStorage.removeItem('lastQuoteData'); } router.push('/quote/success'); };

  const handleShareAction = async (sendMethod?: 'email' | 'whatsapp') => {
    try {
      const quoteDataString = await AsyncStorage.getItem('lastQuoteData');
      if (!quoteDataString) { Alert.alert(t('error', {defaultValue: 'Error'}), t('noQuoteDataFound', {defaultValue: 'No quote data found to share.'})); return; }
      const rawQuoteData: QuoteData = JSON.parse(quoteDataString);
      
      const userCountryForRouting: string | undefined = userProfile?.country || undefined; 

      const contactInfo = getContactInfoForCountry(userCountryForRouting);
      const primaryDocumentUri = getPrimaryDocumentUri(rawQuoteData);
      await saveQuoteToFirestore(rawQuoteData, sendMethod || 'saved_only', contactInfo);
      if (sendMethod === 'email') { await sendEmailWithMessage(rawQuoteData, contactInfo.emails, primaryDocumentUri); await proceedToSuccess(true); } 
      else if (sendMethod === 'whatsapp') { await sendWhatsAppWithMessage(rawQuoteData, contactInfo.whatsapp, primaryDocumentUri); /* proceedToSuccess handled within */ } 
      else { await proceedToSuccess(true); }
    } catch (error: any) { console.error('Error in handleShareAction:', error.message); }
  };

  const sendEmailWithMessage = async (quoteData: QuoteData, recipients: string[], fileUri: string | null) => { /* ... (Same as previous, ensure userProfile/currentUser for details) ... */ try { const userName = userProfile?.name || currentUser?.displayName || t('notProvided', {defaultValue: 'Not Provided'}); const userEmail = userProfile?.email || currentUser?.email || t('notProvided', {defaultValue: 'Not Provided'}); const userPhone = userProfile?.phone || t('notProvided', {defaultValue: 'Not Provided'}); const userCompany = userProfile?.companyName || t('notProvided', {defaultValue: 'Not Provided'}); const userBusinessType = userProfile?.businessType ? (t(userProfile.businessType) || userProfile.businessType) : t('notProvided', {defaultValue: 'Not Provided'}); const userCountry = userProfile?.country ? (t(userProfile.country) || userProfile.country) : t('notProvided', {defaultValue: 'Not Provided'}); const isAvailable = await MailComposer.isAvailableAsync(); if (!isAvailable) { throw new Error(t('emailNotAvailableTryMailto', {defaultValue: 'Email client not available. Attempting mailto link.'})); } const formattedDetails = formatQuoteDataForMessage(quoteData, t); const subject = `${t('newQuoteRequest', {defaultValue: 'New Quote Request'})} - ${t(quoteData.quoteType, {defaultValue: quoteData.quoteType})}`; const userInfoForBody = `${t('userNameLabel', {defaultValue: 'Requester Name'})}: ${userName}\n${t('userEmailLabel', {defaultValue: 'Requester Email'})}: ${userEmail}\n${t('userPhoneLabel', {defaultValue: 'Requester Phone'})}: ${userPhone}\n${t('userCompanyNameLabel', {defaultValue: 'Requester Company'})}: ${userCompany}\n${t('userBusinessTypeLabel', {defaultValue: 'Requester Business Type'})}: ${userBusinessType}\n${t('userCountryLabel', {defaultValue: 'Requester Country'})}: ${userCountry}\n\n`; const body = `${t('newQuoteRequestMessageBody', {defaultValue: `Dear Team,\n\nPlease find below a new quote request.\n\n`})}${userInfoForBody}${t('quoteDetailsLabel', {defaultValue: 'Quote Details:'})}\n${formattedDetails}`; const attachments = fileUri ? [fileUri] : []; await MailComposer.composeAsync({ recipients, subject, body, attachments }); } catch (error: any) { console.error('Error in sendEmailWithMessage (MailComposer or fallback):', error.message); const userName = userProfile?.name || currentUser?.displayName || t('notProvided', {defaultValue: 'Not Provided'}); const userEmail = userProfile?.email || currentUser?.email || t('notProvided', {defaultValue: 'Not Provided'}); const userPhone = userProfile?.phone || t('notProvided', {defaultValue: 'Not Provided'}); const userCompany = userProfile?.companyName || t('notProvided', {defaultValue: 'Not Provided'}); const userBusinessType = userProfile?.businessType ? (t(userProfile.businessType) || userProfile.businessType) : t('notProvided', {defaultValue: 'Not Provided'}); const userCountry = userProfile?.country ? (t(userProfile.country) || userProfile.country) : t('notProvided', {defaultValue: 'Not Provided'}); const formattedDetails = formatQuoteDataForMessage(quoteData, t); const subject = `${t('newQuoteRequest', {defaultValue: 'New Quote Request'})} - ${t(quoteData.quoteType, {defaultValue: quoteData.quoteType})}`; const userInfoForBody = `${t('userNameLabel', {defaultValue: 'Requester Name'})}: ${userName}\n${t('userEmailLabel', {defaultValue: 'Requester Email'})}: ${userEmail}\n${t('userPhoneLabel', {defaultValue: 'Requester Phone'})}: ${userPhone}\n${t('userCompanyNameLabel', {defaultValue: 'Requester Company'})}: ${userCompany}\n${t('userBusinessTypeLabel', {defaultValue: 'Requester Business Type'})}: ${userBusinessType}\n${t('userCountryLabel', {defaultValue: 'Requester Country'})}: ${userCountry}\n\n`; const body = `${t('newQuoteRequestMessageBody', {defaultValue: `Dear Team,\n\nPlease find below a new quote request.\n\n`})}${userInfoForBody}${t('quoteDetailsLabel', {defaultValue: 'Quote Details:'})}\n${formattedDetails}`; const subjectEncoded = encodeURIComponent(subject); const bodyEncoded = encodeURIComponent(body); const recipientsString = recipients.join(','); const mailtoUrl = `mailto:${recipientsString}?subject=${subjectEncoded}&body=${bodyEncoded}`; try { if (await Linking.canOpenURL(mailtoUrl)) { await Linking.openURL(mailtoUrl); } else { Alert.alert(t('error', {defaultValue: 'Error'}), t('failedToSendEmail', {defaultValue: 'Failed to open email client.'}));} } catch (linkingError) { console.error('Error opening mailto link:', linkingError); Alert.alert(t('error', {defaultValue: 'Error'}), t('failedToSendEmailManually', {defaultValue: 'Failed to open email client. Please copy details manually.'}));} } };
  const sendWhatsAppWithMessage = async (quoteData: QuoteData, whatsappNumber: string, fileUri: string | null) => { /* ... (Same as previous, ensure userProfile/currentUser for details, and calls proceedToSuccess) ... */ try { const userName = userProfile?.name || currentUser?.displayName || t('notProvided', {defaultValue: 'Not Provided'}); const userEmail = userProfile?.email || currentUser?.email || t('notProvided', {defaultValue: 'Not Provided'}); const userPhone = userProfile?.phone || t('notProvided', {defaultValue: 'Not Provided'}); const userCompany = userProfile?.companyName || t('notProvided', {defaultValue: 'Not Provided'}); const userBusinessType = userProfile?.businessType ? (t(userProfile.businessType) || userProfile.businessType) : t('notProvided', {defaultValue: 'Not Provided'}); const userCountry = userProfile?.country ? (t(userProfile.country) || userProfile.country) : t('notProvided', {defaultValue: 'Not Provided'}); const formattedDetails = formatQuoteDataForMessage(quoteData, t); const userInfoForWhatsApp = `${t('userNameLabel', {defaultValue: 'Name'})}: ${userName}\n${t('userEmailLabel', {defaultValue: 'Email'})}: ${userEmail}\n${t('userPhoneLabel', {defaultValue: 'Phone'})}: ${userPhone}\n${t('userCompanyNameLabel', {defaultValue: 'Company'})}: ${userCompany}\n${t('userBusinessTypeLabel', {defaultValue: 'Business'})}: ${userBusinessType}\n${t('userCountryLabel', {defaultValue: 'Country'})}: ${userCountry}\n`; const messageIntro = `${t('newQuoteRequestWhatsappIntro', {defaultValue: `New Quote Request:\n`})}${userInfoForWhatsApp}\n${t('quoteDetailsLabel', {defaultValue: 'Quote Details:'})}`; const fullMessage = `${messageIntro}\n${formattedDetails}`; const encodedMessage = encodeURIComponent(fullMessage); const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`; const canOpenWhatsApp = await Linking.canOpenURL(whatsappURL); if (!canOpenWhatsApp) { Alert.alert(t('error', {defaultValue: 'Error'}), t('whatsAppNotInstalledOrSharingUnavailable', {defaultValue: 'WhatsApp not installed.'})); await proceedToSuccess(true); return; } await Linking.openURL(whatsappURL); if (fileUri && typeof fileUri === 'string' && (await Sharing.isAvailableAsync())) { Alert.alert( t('documentForWhatsAppTitle', {defaultValue: "Share Document to WhatsApp"}), t('documentForWhatsAppMessage', { companyNumber: whatsappNumber, defaultValue: `The quote text has been prepared. Would you also like to share the document to your WhatsApp chat with ${whatsappNumber}? You'll need to select the chat manually.` }), [ { text: t('yesShareDocument', {defaultValue: "Yes, Share Document"}), onPress: async () => { try { await Sharing.shareAsync(fileUri, { mimeType: Platform.OS === 'ios' ? 'application/octet-stream' : 'application/pdf', dialogTitle: t('shareDocumentViaWhatsApp', {defaultValue: 'Share Document to WhatsApp Chat'}), UTI: Platform.OS === 'ios' ? 'public.item' : undefined, }); Alert.alert( t('findChatAndAttachTitle', {defaultValue: "Find Chat & Send Document"}), t('findChatAndAttachMessage', { companyNumber: whatsappNumber, defaultValue: `Please find your chat with ${whatsappNumber} (or the number you were sending to) in the share sheet and send the document.`}) ); } catch (shareError) { console.error('Error sharing file via WhatsApp:', shareError); Alert.alert(t('error', {defaultValue: 'Error'}), t('failedToShareDocument', {defaultValue: 'Failed to share document.'})); } finally { await proceedToSuccess(true); } } }, { text: t('noThanksJustText', {defaultValue: "No, Text is Enough"}), style: 'cancel', onPress: async () => { await proceedToSuccess(true); } } ],{ cancelable: false }); } else { await proceedToSuccess(true); } } catch (error:any) { console.error('Error in sendWhatsAppWithMessage:', error.message); Alert.alert(t('error', {defaultValue: 'Error'}), t('failedToOpenWhatsApp', {defaultValue: 'Failed to open WhatsApp.'})); await proceedToSuccess(true); } };

  return ( /* ... JSX for UI remains the same ... */ <View style={[styles.container, { backgroundColor: colors.background }]}><View style={[styles.card, { backgroundColor: colors.card }]}><TouchableOpacity style={styles.closeButton} onPress={() => router.back()}><X size={24} color={colors.text} /></TouchableOpacity><Text style={[styles.title, { color: colors.text }]}>{t('shareQuote', {defaultValue: 'Share Quote Options'})}</Text><Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('shareQuoteDesc', {defaultValue: 'Choose how you want to send or save your quote request.'})}</Text><View style={styles.buttons}><TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => handleShareAction('email')}><Mail size={24} color={colors.white} /><Text style={[styles.buttonText, { color: colors.white }]}>{t('sendEmail', {defaultValue: 'Send via Email'})}</Text></TouchableOpacity><TouchableOpacity style={[styles.button, { backgroundColor: '#25D366' }]} onPress={() => handleShareAction('whatsapp')}><Phone size={24} color={colors.white} /><Text style={[styles.buttonText, { color: colors.white }]}>{t('sendWhatsApp', {defaultValue: 'Send via WhatsApp'})}</Text></TouchableOpacity><TouchableOpacity style={[styles.button, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, borderWidth: 1 }]} onPress={() => handleShareAction()}><Text style={[styles.buttonText, { color: colors.text }]}>{t('saveOnly', {defaultValue: 'Save for Later'})}</Text></TouchableOpacity></View></View></View> );
}
// Styles remain the same
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, }, card: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 24, paddingTop: 48, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, }, closeButton: { position: 'absolute', top: 16, right: 16, padding: 8, zIndex: 1, }, title: { fontFamily: 'Poppins-Bold', fontSize: 24, marginBottom: 8, textAlign: 'center', }, subtitle: { fontFamily: 'Inter-Regular', fontSize: 16, marginBottom: 24, textAlign: 'center', lineHeight: 24, }, buttons: { gap: 12, }, button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 8, gap: 10, }, buttonText: { fontFamily: 'Poppins-Medium', fontSize: 16, }, });
// --- END OF FILE app/quote/share-options.tsx (MODIFIED for new AuthContext & userCountryForRouting fix) ---
=======
  const { user } = useAuth();

  const saveQuote = async (sendMethod = null) => {
    try {
      const quoteData = JSON.parse(await AsyncStorage.getItem('lastQuoteData'));
      
      const quoteRef = await addDoc(collection(db, 'quotes'), {
        ...quoteData,
        userId: user?.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        sendMethod
      });
      
      if (sendMethod === 'email') {
        sendEmail(quoteData);
      } else if (sendMethod === 'whatsapp') {
        sendWhatsApp(quoteData);
      }
      
      router.push('/quote/success');
    } catch (error) {
      console.error('Error saving quote:', error);
      Alert.alert('Error', 'Failed to save quote. Please try again.');
    }
  };

  const sendEmail = (quoteData) => {
    const subject = encodeURIComponent('New Quote Request');
    const body = encodeURIComponent(`
Quote Type: ${quoteData.quoteType}
Shipment Type: ${quoteData.shipmentType}

Details:
${JSON.stringify(quoteData, null, 2)}
    `);
    
    Linking.openURL(`mailto:essam.alkhayyat@compasslog.com,mohammed.shafeeq@compasslog.com?subject=${subject}&body=${body}`);
  };

  const sendWhatsApp = (quoteData) => {
    const message = encodeURIComponent(`
New Quote Request:

Quote Type: ${quoteData.quoteType}
Shipment Type: ${quoteData.shipmentType}

Details:
${JSON.stringify(quoteData, null, 2)}
    `);
    
    Linking.openURL(`https://wa.me/+97433706307?text=${message}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: colors.text }]}>
          {t('shareQuote')}
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('shareQuoteDesc')}
        </Text>
        
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => saveQuote('email')}
          >
            <Mail size={24} color={colors.white} />
            <Text style={[styles.buttonText, { color: colors.white }]}>
              {t('sendEmail')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#25D366' }]}
            onPress={() => saveQuote('whatsapp')}
          >
            <Phone size={24} color={colors.white} />
            <Text style={[styles.buttonText, { color: colors.white }]}>
              {t('sendWhatsApp')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => saveQuote()}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {t('saveOnly')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
