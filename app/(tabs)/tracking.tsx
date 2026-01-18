<<<<<<< HEAD
// --- START OF FILE app/(tabs)/tracking.tsx ---

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import Header from '@/components/common/Header';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { Ship, Package, Box } from 'lucide-react-native';

type TrackingServiceType = 'air_cargo' | 'bill_of_lading' | 'container';
=======
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import Header from '@/components/common/Header';
import { Search, Package, Calendar, MapPin, Ship, ArrowRight, CheckCircle2 } from 'lucide-react-native';
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0

export default function TrackingScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
<<<<<<< HEAD

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
=======
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  
  const handleTracking = () => {
    if (!trackingNumber.trim()) {
      setError(t('trackingNumberRequired'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (trackingNumber === 'COG12345') {
        setShipment({
          trackingNumber: 'COG12345',
          status: 'in_transit',
          origin: 'Shanghai, China',
          destination: 'Doha, Qatar',
          estimatedDelivery: '2025-04-15',
          shipmentMode: 'Sea Freight',
          currentLocation: 'Singapore Port',
          events: [
            { 
              date: '2025-03-01', 
              location: 'Shanghai Port', 
              description: 'Shipment collected from shipper' 
            },
            { 
              date: '2025-03-03', 
              location: 'Shanghai Port', 
              description: 'Shipment loaded on vessel' 
            },
            { 
              date: '2025-03-12', 
              location: 'Singapore Port', 
              description: 'Vessel arrived at transit port' 
            }
          ]
        });
      } else {
        setError(t('trackingNotFound'));
        setShipment(null);
      }
      setLoading(false);
    }, 1500);
  };
  
  const renderStatusLabel = (status) => {
    switch (status) {
      case 'in_transit':
        return (
          <View style={[styles.statusLabel, { backgroundColor: colors.warning + '20' }]}>
            <Text style={[styles.statusText, { color: colors.warning }]}>{t('inTransit')}</Text>
          </View>
        );
      case 'delivered':
        return (
          <View style={[styles.statusLabel, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>{t('delivered')}</Text>
          </View>
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('trackShipment')} />
      
      <View style={styles.content}>
        <View style={[styles.trackingForm, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.backgroundSecondary, 
              color: colors.text, 
              borderColor: error ? colors.error : colors.border 
            }]}
            placeholder={t('enterTrackingNumber')}
            placeholderTextColor={colors.textSecondary}
            value={trackingNumber}
            onChangeText={(text) => {
              setTrackingNumber(text);
              if (error) setError('');
            }}
          />
          
          {error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          ) : null}
          
          <TouchableOpacity 
            style={[styles.trackButton, { backgroundColor: colors.primary }]}
            onPress={handleTracking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Search size={20} color={colors.white} />
                <Text style={[styles.trackButtonText, { color: colors.white }]}>
                  {t('track')}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={[styles.sampleText, { color: colors.textSecondary }]}>
            {t('sampleTracking')}: COG12345
          </Text>
        </View>
        
        {shipment ? (
          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
            <View style={[styles.shipmentCard, { backgroundColor: colors.card }]}>
              <View style={styles.shipmentHeader}>
                <View>
                  <Text style={[styles.shipmentTitle, { color: colors.text }]}>
                    {t('shipmentDetails')}
                  </Text>
                  <Text style={[styles.shipmentNumber, { color: colors.textSecondary }]}>
                    {shipment.trackingNumber}
                  </Text>
                </View>
                {renderStatusLabel(shipment.status)}
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.shipmentInfo}>
                <View style={styles.infoItem}>
                  <Package size={18} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    {t('shipmentMode')}
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {shipment.shipmentMode}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Calendar size={18} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    {t('estimatedDelivery')}
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <MapPin size={18} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    {t('currentLocation')}
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {shipment.currentLocation}
                  </Text>
                </View>
              </View>
              
              <View style={styles.routeContainer}>
                <View style={styles.locationContainer}>
                  <View style={[styles.locationDot, { backgroundColor: colors.success }]} />
                  <Text style={[styles.locationText, { color: colors.text }]}>{shipment.origin}</Text>
                </View>
                
                <View style={styles.routeLine}>
                  <Ship size={20} color={colors.primary} style={styles.routeIcon} />
                </View>
                
                <View style={styles.locationContainer}>
                  <View style={[styles.locationDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.locationText, { color: colors.text }]}>{shipment.destination}</Text>
                </View>
              </View>
            </View>
            
            <Text style={[styles.timelineTitle, { color: colors.text }]}>
              {t('shipmentTimeline')}
            </Text>
            
            <View style={[styles.timelineCard, { backgroundColor: colors.card }]}>
              {shipment.events.map((event, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                    {index < shipment.events.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                  
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.timelineLocation, { color: colors.text }]}>
                      {event.location}
                    </Text>
                    <Text style={[styles.timelineDescription, { color: colors.textSecondary }]}>
                      {event.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.supportButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.supportButtonText, { color: colors.white }]}>
                {t('contactSupport')}
              </Text>
              <ArrowRight size={16} color={colors.white} />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Package size={64} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('noTrackingInfo')}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('enterTrackingDetails')}
            </Text>
          </View>
        )}
      </View>
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
<<<<<<< HEAD
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
=======
  content: {
    flex: 1,
    padding: 16,
  },
  trackingForm: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  },
  trackButton: {
    height: 50,
    borderRadius: 8,
<<<<<<< HEAD
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
=======
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  sampleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  shipmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shipmentTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginBottom: 4,
  },
  shipmentNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statusLabel: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  shipmentInfo: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  routeContainer: {
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  routeLine: {
    height: 40,
    borderLeftWidth: 2,
    borderLeftColor: '#DDDDDD',
    marginLeft: 5,
    position: 'relative',
  },
  routeIcon: {
    position: 'absolute',
    left: -10,
    top: 10,
  },
  timelineTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginBottom: 12,
  },
  timelineCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  timelineLocation: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  timelineDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 24,
  },
  supportButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
