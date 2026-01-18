// --- START OF FILE app/(tabs)/history.tsx (Corrected - Merging Working JSX with New Logic) ---
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useAuth, UserProfile } from '@/context/AuthContext'; // Using new AuthContext
import { useRouter } from 'expo-router';
import Header from '@/components/common/Header';
import { collection, query, where, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Mail, Phone } from 'lucide-react-native';
import { Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { formatQuoteDataForMessage, QuoteData } from '@/utils/quoteFormatter';
import { getContactInfoForCountry } from '@/config/contacts';

interface FirestoreQuote {
  id: string; 
  quoteType: string; 
  createdAt: string; 
  status: 'pending' | 'sent' | string; // User action status
  internalStatus?: string; // Status set by your team
  shipmentType?: string;
  containerType?: string;
  sendCount?: number;
  lastSentTimestamp?: string | null;
  sendMethod?: 'email' | 'whatsapp' | 'saved_only' | string;
  // Fields from original quote data that might be useful for display or resend
  requesterName?: string; 
  requesterEmail?: string; 
  requesterPhone?: string; 
  requesterCompany?: string; 
  requesterBusinessType?: string; 
  requesterCountry?: string; // Country of user at time of quote
  userAppCountry?: string; // Country context for routing the quote
  targetEmails?: string[]; 
  targetWhatsApp?: string;
  userId?: string; // This MUST match currentUser.uid
  [key: string]: any;
}

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { currentUser, userProfile, loading: authContextLoading } = useAuth(); // Using new AuthContext
  const router = useRouter();

  const [quotes, setQuotes] = useState<FirestoreQuote[]>([]);
  const [loadingData, setLoadingData] = useState(true); // Specific for quotes data loading
  const [refreshing, setRefreshing] = useState(false);
  const [updatingQuoteId, setUpdatingQuoteId] = useState<string | null>(null);

  const setupRealtimeQuotesListener = useCallback(() => {
    if (!currentUser?.uid) { 
      setQuotes([]); 
      setLoadingData(false); 
      return () => {}; 
    }
    console.log("HISTORY_SCREEN_DEBUG: Setting up listener for UID:", currentUser.uid);
    setLoadingData(true);
    const quotesRef = collection(db, 'quotes');
    const q = query(quotesRef, where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("HISTORY_SCREEN_DEBUG: onSnapshot data received, docs count:", querySnapshot.docs.length);
      const quotesList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as FirestoreQuote[];
      setQuotes(quotesList);
      setLoadingData(false); 
      setRefreshing(false);
    }, (error) => {
      console.error('HISTORY_SCREEN_DEBUG: Error listening to real-time quote updates:', error);
      Alert.alert(t('error', {defaultValue: "Error"}), t('failedToLoadHistory', {defaultValue: "Could not load quote history."}));
      setLoadingData(false); 
      setRefreshing(false);
    });
    return unsubscribe;
  }, [currentUser, t]); 

  useEffect(() => {
    let unsubscribe = () => {};
    if (currentUser) { // Only setup listener if user is authenticated
      unsubscribe = setupRealtimeQuotesListener();
    } else if (!authContextLoading) { // If auth check is done and no user, clear data
      setQuotes([]);
      setLoadingData(false);
    }
    return () => { unsubscribe(); };
  }, [currentUser, authContextLoading, setupRealtimeQuotesListener]);

  const onRefresh = useCallback(() => { 
    setRefreshing(true);
    // The onSnapshot listener will refresh data if underlying data changes.
    // If you want a manual re-fetch independent of onSnapshot, you'd call a getDocs version here.
    // For now, just setting refreshing to true will show the indicator, and onSnapshot will eventually set it to false.
    // To ensure it visually stops if no data change, we can call setupRealtimeQuotesListener again,
    // but it's usually not needed if the listener is robust.
    // For simplicity, if the listener is active, it should catch up.
    // If no listener (e.g. user logged out then in), useEffect handles it.
    // The current setupRealtimeQuotesListener will setRefreshing(false)
    if(currentUser) setupRealtimeQuotesListener(); else setRefreshing(false);

  }, [currentUser, setupRealtimeQuotesListener]);

  const buildUserInfoString = (quote: FirestoreQuote) => {
    const userName = quote.requesterName || userProfile?.name || currentUser?.displayName || t('notProvided', {defaultValue: 'Not Provided'});
    const userEmail = quote.requesterEmail || userProfile?.email || currentUser?.email || t('notProvided', {defaultValue: 'Not Provided'});
    const userPhone = quote.requesterPhone || userProfile?.phone || t('notProvided', {defaultValue: 'Not Provided'});
    const userCompany = quote.requesterCompany || userProfile?.companyName || t('notProvided', {defaultValue: 'Not Provided'});
    const userBusinessTypeDisplay = quote.requesterBusinessType ? (t(quote.requesterBusinessType) || quote.requesterBusinessType) : (userProfile?.businessType ? (t(userProfile.businessType) || userProfile.businessType) : t('notProvided', {defaultValue: 'Not Provided'}));
    const userCountryDisplay = quote.requesterCountry ? (t(quote.requesterCountry) || quote.requesterCountry) : (userProfile?.country ? (t(userProfile.country) || userProfile.country) : t('notProvided', {defaultValue: 'Not Provided'}));
    return `${t('userNameLabel', {defaultValue: 'Requester Name'})}: ${userName}\n${t('userEmailLabel', {defaultValue: 'Requester Email'})}: ${userEmail}\n${t('userPhoneLabel', {defaultValue: 'Requester Phone'})}: ${userPhone}\n${t('userCompanyNameLabel', {defaultValue: 'Requester Company'})}: ${userCompany}\n${t('userBusinessTypeLabel', {defaultValue: 'Requester Business Type'})}: ${userBusinessTypeDisplay}\n${t('userCountryLabel', {defaultValue: 'Requester Country'})}: ${userCountryDisplay}\n\n`;
  };
  
  const handleSendAction = async (quote: FirestoreQuote, method: 'email' | 'whatsapp') => {
    console.log(`HISTORY_SCREEN_DEBUG: handleSendAction START - Quote ID: ${quote.id}, Method: ${method}, User Status: ${quote.status}, Send Count: ${quote.sendCount ?? 0}`);
    setUpdatingQuoteId(quote.id);
    const contactInfoContext = quote.userAppCountry || userProfile?.country; 
    let recipients: string[] = []; let whatsappNumber: string = "";

    if (method === 'email') {
        recipients = quote.targetEmails && quote.targetEmails.length > 0 ? quote.targetEmails : getContactInfoForCountry(contactInfoContext).emails;
    } else {
        whatsappNumber = quote.targetWhatsApp || getContactInfoForCountry(contactInfoContext).whatsapp;
    }

    if ((method === 'email' && recipients.length === 0) || (method === 'whatsapp' && !whatsappNumber)) {
        Alert.alert(t('error', {defaultValue: 'Error'}), t('contactInfoMissing', {defaultValue: 'Contact information for this action is missing.'}));
        setUpdatingQuoteId(null); return;
    }
    
    const isInitialSendFromPending = quote.status === 'pending';
    const currentSendCount = quote.sendCount || 0;
    const newSendCount = isInitialSendFromPending ? 1 : currentSendCount + 1;

    const quoteDetailsForFormatter: QuoteData = { ...quote, quoteType: quote.quoteType as string, shipmentType: quote.shipmentType || t('valueNotProvidedShipmentType', {defaultValue: '(Shipment Type N/A)'}), };
    ['id', 'userId', 'userAppCountry', 'targetEmails', 'targetWhatsApp', 'status', 'sendCount', 'lastSentTimestamp', 'sendMethod', 'createdAt', 'requesterName', 'requesterEmail', 'requesterPhone', 'requesterCompany', 'requesterBusinessType', 'requesterCountry', 'internalStatus'].forEach(key => delete (quoteDetailsForFormatter as any)[key]);
    
    const formattedQuoteBody = formatQuoteDataForMessage(quoteDetailsForFormatter, t);
    const userInfo = buildUserInfoString(quote);
    const quoteRefDisplay = `${t('quoteRefShort', {defaultValue: 'Ref'})}: ${quote.id.slice(0,8)}`;
    const commonSubjectPart = `${t(quote.quoteType, {defaultValue: quote.quoteType})} - ${quoteRefDisplay}`;
    let subject = ""; let messageIntro = "";

    if (isInitialSendFromPending) {
        subject = `${t('quoteInquiryPrefix', {defaultValue: 'Quote Inquiry'})}: ${commonSubjectPart}`;
        messageIntro = `${t('initialSendWhatsAppIntro', {defaultValue: `Inquiring about this quote (${quoteRefDisplay}):\n\n`})}${userInfo}${t('quoteDetailsLabel', {defaultValue: 'Quote Details:'})}`;
    } else {
        subject = `${t('resendAttemptPrefix', { count: newSendCount, defaultValue: `[RESEND - Attempt #${newSendCount}]` })} ${commonSubjectPart}`;
        messageIntro = `${t('followUpWhatsAppIntro', { count: newSendCount, defaultValue: `Following up (Attempt #${newSendCount}) on quote (${quoteRefDisplay}):\n\n`})}${userInfo}${t('quoteDetailsLabel', {defaultValue: 'Quote Details:'})}`;
    }
    const emailBody = `${isInitialSendFromPending ? t('initialSendEmailBodyIntro', {defaultValue: `Dear Team,\n\nI am inquiring about the following quote:\n\n`}) : t('followUpEmailBodyIntro', { count: newSendCount, defaultValue: `Dear Team,\n\nI am following up (Attempt #${newSendCount}) on the following quote:\n\n`})}${userInfo}${t('quoteDetailsLabel', {defaultValue: 'Quote Details:'})}\n${formattedQuoteBody}`;
    const whatsAppFullMessage = `${messageIntro}\n${formattedQuoteBody}`;

    try {
        if (method === 'email') {
            const isMailComposerAvailable = await MailComposer.isAvailableAsync();
            if (!isMailComposerAvailable) {
                const subjectEncoded = encodeURIComponent(subject); const bodyEncoded = encodeURIComponent(emailBody);
                const mailtoUrl = `mailto:${recipients.join(',')}?subject=${subjectEncoded}&body=${bodyEncoded}`;
                if (await Linking.canOpenURL(mailtoUrl)) { await Linking.openURL(mailtoUrl); }
                else { throw new Error(t('failedToOpenEmailClient', {defaultValue: 'Failed to open email client.'})); }
            } else { await MailComposer.composeAsync({ recipients, subject, body: emailBody }); }
        } else {
            const encodedMessage = encodeURIComponent(whatsAppFullMessage);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            if (await Linking.canOpenURL(whatsappURL)) { await Linking.openURL(whatsappURL); }
            else { throw new Error(t('whatsAppNotInstalledOrSharingUnavailable', {defaultValue: 'WhatsApp not installed or sharing unavailable.'})); }
        }
        
        const quoteDocRef = doc(db, 'quotes', quote.id);
        const updateData: Partial<FirestoreQuote> = { status: 'sent', sendCount: newSendCount, lastSentTimestamp: new Date().toISOString(), ...(isInitialSendFromPending && { sendMethod: method, internalStatus: 'received' }) }; // Update internalStatus if it was pending
        await updateDoc(quoteDocRef, updateData);
        // No need to call setQuotes, onSnapshot will handle it.
        Alert.alert(t('statusUpdated', {defaultValue: "Status Updated"}), t('quoteMarkedAsSent', {defaultValue: "Your quote has been marked as sent."}));
    } catch (error: any) {
      console.error(`HISTORY_SCREEN_DEBUG: ERROR in handleSendAction for quote ID ${quote.id}:`, error.message, error.stack);
      Alert.alert(t('error', {defaultValue: 'Error'}), error.message || t('failedToSendAndMarkSent', {method: method, defaultValue: `Failed to send ${method} and update status.`}));
    } finally {
      setUpdatingQuoteId(null);
    }
  };

  // Render logic based on authContextLoading first, then currentUser, then loadingData
  if (authContextLoading) { 
    return (<View style={[styles.container, styles.loadingContainer, {backgroundColor: colors.background}]}><Header title={t('quoteHistory', {defaultValue: 'Quote History'})} /><ActivityIndicator size="large" color={colors.primary} /></View>);
  }
  if (!currentUser) { 
    return (<View style={[styles.container, { backgroundColor: colors.background }]}><Header title={t('quoteHistory', {defaultValue: 'Quote History'})} /><View style={styles.centerContent}><Text style={[styles.signInText, { color: colors.text }]}>{t('signInToViewHistory', {defaultValue: 'Please sign in to view your quote history.'})}</Text><TouchableOpacity style={[styles.signInButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/(auth)/login')}><Text style={[styles.signInButtonText, { color: colors.white }]}>{t('signIn', {defaultValue: 'Sign In'})}</Text></TouchableOpacity></View></View>);
  }
  if (loadingData && quotes.length === 0) { // Show loading if fetching initial quotes
    return ( <View style={[styles.container, { backgroundColor: colors.background }]}><Header title={t('quoteHistory', {defaultValue: 'Quote History'})} /><View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View></View> );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('quoteHistory', {defaultValue: 'Quote History'})} />
      {quotes.length === 0 && !loadingData ? ( // Show empty state only if not loading and quotes array is empty
        <ScrollView contentContainerStyle={styles.emptyStateContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}>
            <View style={styles.emptyState}><Text style={[styles.emptyTitle, { color: colors.text }]}>{t('noQuotesYet', {defaultValue: 'No Quotes Yet'})}</Text><Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('noQuotesDescHistory', {defaultValue: 'You haven’t requested or saved any quotes. Start by requesting one!'})}</Text><TouchableOpacity style={[styles.newQuoteButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/(tabs)/quote')}><Text style={[styles.newQuoteButtonText, { color: colors.white }]}>{t('requestNewQuote', {defaultValue: 'Request a New Quote'})}</Text></TouchableOpacity></View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}>
          {quotes.map((quote) => (
            <View key={quote.id} style={[styles.quoteCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth }]}>
              <View style={styles.quoteHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.quoteType, { color: colors.text }]}>{t(quote.quoteType, {defaultValue: quote.quoteType})}</Text>
                  <Text style={[styles.quoteDate, { color: colors.textSecondary }]}>{`${t('createdDateLabel', {defaultValue: "Created"})}: ${new Date(quote.createdAt).toLocaleDateString()}`}</Text>
                  {quote.status === 'sent' && quote.lastSentTimestamp && (
                    <Text style={[styles.quoteDate, { color: colors.textSecondary, fontSize: 12, marginTop: 2 }]}>
                      {`${t('lastSentLabel', {defaultValue: 'Last Sent'})}: ${new Date(quote.lastSentTimestamp).toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'})} ${new Date(quote.lastSentTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                    </Text>
                  )}
                </View>
                <View style={[ styles.statusBadge, { 
                    backgroundColor: quote.internalStatus === 'quoted' ? colors.success + '20' // Lighter background
                                    : quote.internalStatus === 'processing' ? colors.info + '20'
                                    : quote.internalStatus === 'more_info_needed' ? colors.warning + '20' // Using warning color with transparency
                                    : quote.status === 'pending' ? colors.warning + '20' 
                                    : colors.success + '20', // Default for 'sent' or other internal statuses
                    borderColor: quote.internalStatus === 'quoted' ? colors.success
                                : quote.internalStatus === 'processing' ? colors.info
                                : quote.internalStatus === 'more_info_needed' ? colors.warning 
                                : quote.status === 'pending' ? colors.warning
                                : colors.success,
                  }]}
                >
                  <Text style={[ styles.statusText, { 
                      color: quote.internalStatus === 'quoted' ? colors.success
                            : quote.internalStatus === 'processing' ? colors.info
                            : quote.internalStatus === 'more_info_needed' ? colors.warning
                            : quote.status === 'pending' ? colors.warning
                            : colors.success 
                    }]}
                  >
                    {`${t(quote.internalStatus || quote.status, {defaultValue: quote.internalStatus || quote.status})}${
                      quote.status === 'sent' && 
                      (!quote.internalStatus || quote.internalStatus === 'received' || quote.internalStatus === 'processing') && // Show count if user sent it and it's not yet fully quoted/resolved by admin
                      typeof quote.sendCount === 'number' && quote.sendCount > 0 
                      ? ` (${t('sentCountBadge', { count: quote.sendCount, defaultValue: `${quote.sendCount}x` })})` 
                      : '' 
                    }`}
                  </Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.quoteDetails}>
                {quote.shipmentType && (<><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('shipmentType', {defaultValue: 'Shipment Type'})}</Text><Text style={[styles.detailValue, { color: colors.text }]}>{t(quote.shipmentType, {defaultValue: quote.shipmentType})}</Text></>)}
                {quote.containerType && (<><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('containerType', {defaultValue: 'Container Type'})}</Text><Text style={[styles.detailValue, { color: colors.text }]}>{t(quote.containerType, {defaultValue: quote.containerType})}</Text></>)}
              </View>
              <View style={styles.actionButtons}>
                 {updatingQuoteId === quote.id ? ( <ActivityIndicator size="small" color={colors.primary} style={{flex: 1, height: 42}}/> ) : ( <><TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => handleSendAction(quote, 'email')}><Mail size={18} color={colors.white} /><Text style={[styles.actionButtonText, { color: colors.white }]}>{quote.status === 'sent' ? t('sendAgainEmail', {defaultValue: 'Email Again'}) : t('sendEmail', {defaultValue: 'Send Email'})}</Text></TouchableOpacity><TouchableOpacity style={[styles.actionButton, { backgroundColor: '#25D366' }]} onPress={() => handleSendAction(quote, 'whatsapp')}><Phone size={18} color={colors.white} /><Text style={[styles.actionButtonText, { color: colors.white }]}>{quote.status === 'sent' ? t('sendAgainWhatsApp', {defaultValue: 'WhatsApp Again'}) : t('sendWhatsApp', {defaultValue: 'Send WhatsApp'})}</Text></TouchableOpacity></> )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({ /* ... Your existing styles from your "old history file" ... */ container: { flex: 1, }, centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, }, signInText: { fontFamily: 'Poppins-Medium', fontSize: 16, textAlign: 'center', marginBottom: 16, }, signInButton: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, }, signInButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, }, loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', }, scrollView: { flex: 1, }, content: { padding: 16, paddingBottom: 32, }, emptyStateContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }, emptyState: { alignItems: 'center', }, emptyTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, marginBottom: 8, textAlign: 'center', }, emptyText: { fontFamily: 'Inter-Regular', fontSize: 16, textAlign: 'center', marginBottom: 24, lineHeight: 22 }, newQuoteButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, }, newQuoteButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, }, quoteCard: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1, shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, }, quoteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, }, quoteType: { fontFamily: 'Poppins-SemiBold', fontSize: 16, marginBottom: 4, }, quoteDate: { fontFamily: 'Inter-Regular', fontSize: 13, }, statusBadge: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start', minWidth: 70, alignItems: 'center' }, statusText: { fontFamily: 'Inter-Medium', fontSize: 11, textTransform: 'capitalize' }, divider: { height: StyleSheet.hairlineWidth, marginVertical: 12, }, quoteDetails: { marginBottom: 16, }, detailLabel: { fontFamily: 'Inter-Regular', fontSize: 13, marginBottom: 2, opacity: 0.7}, detailValue: { fontFamily: 'Inter-Medium', fontSize: 14, marginBottom: 10, }, actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, }, actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 8, height: 42 }, actionButtonText: { fontFamily: 'Poppins-Medium', fontSize: 13, }, });
// --- END OF FILE app/(tabs)/history.tsx (Corrected - Merging Working JSX with New Logic) ---
