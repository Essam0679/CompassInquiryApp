// --- START OF FILE app/(tabs)/tracking.tsx ---

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import Header from '@/components/common/Header';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { Ship, Package, Box } from 'lucide-react-native';

type TrackingServiceType = 'air_cargo' | 'bill_of_lading' | 'container';

export default function TrackingScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [trackingType, setTrackingType] = useState<TrackingServiceType>('air_cargo');
  const [trackingTypeOpen, setTrackingTypeOpen] = useState(false);
  const [isPickerReady, setIsPickerReady] = useState(false);

  const [awbPrefix, setAwbPrefix] = useState('');
  const [awbNumber, setAwbNumber] = useState('');
  const [genericTrackingNumber, setGenericTrackingNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsPickerReady(true);
  }, []);

  const trackingTypeOptions: ItemType<TrackingServiceType>[] = [
    { label: t('airFreight') || 'Air Cargo (AWB)', value: 'air_cargo', icon: () => <Package size={18} color={colors.text} /> },
    { label: t('billOfLading') || 'Bill of Lading (B/L)', value: 'bill_of_lading', icon: () => <Ship size={18} color={colors.text} /> },
    { label: t('containerTracking') || 'Container', value: 'container', icon: () => <Box size={18} color={colors.text} /> },
  ];

  const handleTrackShipment = async () => {
    setIsLoading(true);
    let url = '';
    let valid = false;

    if (trackingType === 'air_cargo') {
      if (awbPrefix.trim() && awbNumber.trim()) {
        if (/^\d{3}$/.test(awbPrefix.trim()) && /^\d{7,8}$/.test(awbNumber.trim())) {
          url = `https://www.track-trace.com/aircargo/result/${awbPrefix.trim()}-${awbNumber.trim()}`;
          valid = true;
        } else {
          Alert.alert(t('error') || 'Error', t('invalidAWBFormat') || 'Invalid AWB format. Prefix 3 digits, number 7-8 digits.');
        }
      } else {
        Alert.alert(t('error') || 'Error', t('awbPrefixNumberRequired') || 'AWB Prefix and Number are required.');
      }
    } else if (trackingType === 'bill_of_lading') {
      if (genericTrackingNumber.trim()) {
        url = `https://www.track-trace.com/bol`;
        valid = true;
      } else {
        Alert.alert(t('error') || 'Error', t('trackingNumberRequired') || 'Tracking number is required.');
      }
    } else if (trackingType === 'container') {
      if (genericTrackingNumber.trim()) {
        url = `https://www.track-trace.com/container`;
        valid = true;
      } else {
        Alert.alert(t('error') || 'Error', t('trackingNumberRequired') || 'Tracking number is required.');
      }
    }

    if (valid && url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
        else Alert.alert(t('error') || 'Error', `${t('cannotOpenLink') || 'Cannot open this link:'} ${url}`);
      } catch (error) {
        console.error("Failed to open URL:", error);
        Alert.alert(t('error') || 'Error', t('failedToOpenLink') || 'Failed to open the link. Please try again.');
      }
    }
    setIsLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('tracking') || 'Track Shipment'} showBackButton={false} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!trackingTypeOpen}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {t('trackYourShipment') || 'Track Your Shipment'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('selectTrackingService') || 'Select service and enter your tracking ID.'}
        </Text>

        <View style={[styles.inputGroup, { zIndex: 3000 }]}>
          <Text style={[styles.label, { color: colors.text }]}>{t('trackingType') || 'Tracking Type'}</Text>
          {isPickerReady && (
            <DropDownPicker
              open={trackingTypeOpen}
              value={trackingType}
              items={trackingTypeOptions}
              setOpen={setTrackingTypeOpen}
              setValue={(callback) => {
                  const val = typeof callback === 'function' ? callback(trackingType) : callback;
                  if (val) setTrackingType(val as TrackingServiceType);
              }}
              style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
              dropDownContainerStyle={[styles.dropDownContainer, { backgroundColor: colors.card, borderColor: colors.border }]} // Ensure styles.dropDownContainer exists
              textStyle={{ color: colors.text, fontFamily: 'Inter-Regular' }}
              placeholder={t('selectTrackingType') || "Select Tracking Type"}
              listMode="SCROLLVIEW"
              zIndex={3000}
              zIndexInverse={1000}
            />
          )}
        </View>

        {trackingType === 'air_cargo' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('awbPrefix') || 'AWB Prefix (e.g., 160)'}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="XXX"
                placeholderTextColor={colors.textSecondary}
                value={awbPrefix}
                onChangeText={setAwbPrefix}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('awbNumber') || 'AWB Number (8 digits)'}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="NNNNNNNN"
                placeholderTextColor={colors.textSecondary}
                value={awbNumber}
                onChangeText={setAwbNumber}
                keyboardType="number-pad"
                maxLength={8}
              />
            </View>
          </>
        )}

        {trackingType === 'bill_of_lading' && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('blNumber') || 'B/L Number'}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterTrackingId') || "Enter Tracking ID"}
              placeholderTextColor={colors.textSecondary}
              value={genericTrackingNumber}
              onChangeText={setGenericTrackingNumber}
              autoCapitalize="characters"
            />
          </View>
        )}

        {trackingType === 'container' && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('containerNumber') || 'Container Number'}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterTrackingId') || "Enter Tracking ID"}
              placeholderTextColor={colors.textSecondary}
              value={genericTrackingNumber}
              onChangeText={setGenericTrackingNumber}
              autoCapitalize="characters"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.trackButton, { backgroundColor: colors.primary }]}
          onPress={handleTrackShipment}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color={colors.white || '#FFFFFF'} /> : <Text style={[styles.trackButtonText, { color: colors.white || '#FFFFFF' }]}>{t('track') || 'Track'}</Text>}
        </TouchableOpacity>

        {(trackingType === 'bill_of_lading' || trackingType === 'container') && (
             <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {t('trackTraceInfo') || 'You will be redirected to track-trace.com where you may need to select the carrier and re-enter the number.'}
            </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  dropdown: { // Style for the main dropdown button
    height: 50,
    fontFamily: 'Inter-Regular',
    borderRadius: 8, // Ensure consistency
    borderWidth: 1,   // Ensure consistency
  },
  dropDownContainer: { // Style for the container that holds the list of items
    // backgroundColor will be set by inline style using colors.card
    // borderColor will be set by inline style using colors.border
    // Add other shared styles if needed, e.g.:
    borderRadius: 8,
    borderWidth: 1, // Match the main dropdown style
  },
  trackButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  trackButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  }
});
// --- END OF FILE app/(tabs)/tracking.tsx ---
