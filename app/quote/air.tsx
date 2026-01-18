// --- START OF FILE air.tsx (Updated for In-Screen Cancel Button) ---

import { useState } from 'react'; // Removed useEffect
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native'; // Added Alert, Platform
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router'; // Removed useNavigation as it's not directly needed for this approach now
import { Check, Plus, File, Trash2 } from 'lucide-react-native';
import Header from '@/components/common/Header';
import FormStepper from '@/components/quote/FormStepper';
import MultiForm from '@/components/quote/MultiForm';
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed: import ExitQuoteButton from '@/components/common/ExitQuoteButton';

interface Package {
  length: string;
  width: string;
  height: string;
  weight: string;
  pieces: string;
  volumetricWeight: string;
}

interface FormData {
  shipmentType: string;
  serviceType: string;
  originCountry: string;
  originCity: string;
  originAirport: string;
  pickupAddress: string;
  destinationCountry: string;
  destinationCity: string;
  destinationAirport: string;
  deliveryAddress: string;
  commodity: string;
  hsCode: string;
  packingList: string | null;
  packages: Package[];
  totalActualWeight: string;
  totalVolumetricWeight: string;
  chargeableWeight: string;
  cargoReady: string;
  incoterms: string;
  insurance: boolean;
  clearance: boolean;
  notes: string;
}

const emptyPackage: Package = {
  length: '',
  width: '',
  height: '',
  weight: '',
  pieces: '1',
  volumetricWeight: '0'
};

export default function AirFreightQuoteScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    shipmentType: 'import',
    serviceType: 'standard',
    originCountry: '',
    originCity: '',
    originAirport: '',
    pickupAddress: '',
    destinationCountry: '',
    destinationCity: '',
    destinationAirport: '',
    deliveryAddress: '',
    commodity: '',
    hsCode: '',
    packingList: null,
    packages: [{ ...emptyPackage }],
    totalActualWeight: '0',
    totalVolumetricWeight: '0',
    chargeableWeight: '0',
    cargoReady: '',
    incoterms: 'fob',
    insurance: false,
    clearance: false,
    notes: ''
  });
  
  const [shipmentTypeOpen, setShipmentTypeOpen] = useState(false);
  const [serviceTypeOpen, setServiceTypeOpen] = useState(false);
  const [incotermsOpen, setIncotermsOpen] = useState(false);
  
  const shipmentTypes = [
    { label: t('import'), value: 'import' },
    { label: t('export'), value: 'export' }
  ];
  
  const serviceTypes = [
    { label: t('standard'), value: 'standard' },
    { label: t('express'), value: 'express' },
    { label: t('nextFlight'), value: 'next_flight' }
  ];
  
  const incotermsOptions = [
    { label: 'FOB', value: 'fob' },
    { label: 'CIF', value: 'cif' },
    { label: 'EXW', value: 'exw' },
    { label: 'DAP', value: 'dap' },
    { label: 'DDP', value: 'ddp' }
  ];

  // Removed useEffect for navigation.setOptions

  const handleCancelExit = () => {
    Alert.alert(
      t('exitQuoteInquiry') || "Exit Quote Inquiry",
      t('exitQuoteConfirmation') || "Are you sure you want to exit? Any unsaved data will be lost.",
      [
        {
          text: t('stay') || "Stay",
          onPress: () => console.log("User chose to stay."),
          style: "cancel"
        },
        {
          text: t('exit') || "Exit",
          onPress: () => {
            router.replace('/'); // Navigate to Home
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };


  const calculateWeights = (packages: Package[]) => {
    let totalActual = 0;
    let totalVolumetric = 0;

    packages.forEach(pkg => {
      if (pkg.length && pkg.width && pkg.height && pkg.weight && pkg.pieces) {
        const pieces = parseInt(pkg.pieces) || 0;
        const volume = (parseFloat(pkg.length) * parseFloat(pkg.width) * parseFloat(pkg.height)) / 6000;
        const volumetricWeight = volume * pieces;
        const actualWeight = parseFloat(pkg.weight) * pieces;

        pkg.volumetricWeight = volumetricWeight.toFixed(2);
        totalActual += actualWeight;
        totalVolumetric += volumetricWeight;
      }
    });

    const chargeable = Math.max(totalActual, totalVolumetric);

    setFormData(prev => ({
      ...prev,
      packages: [...packages],
      totalActualWeight: totalActual.toFixed(2),
      totalVolumetricWeight: totalVolumetric.toFixed(2),
      chargeableWeight: chargeable.toFixed(2)
    }));
  };

  const handlePackageChange = (index: number, field: keyof Package, value: string) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    calculateWeights(updatedPackages);
  };

  const addPackage = () => {
    if (formData.packages.length < 5) {
      const updatedPackages = [...formData.packages, { ...emptyPackage }];
      setFormData(prev => ({
        ...prev,
        packages: updatedPackages
      }));
    }
  };

  const removePackage = (index: number) => {
    if (formData.packages.length > 1) {
      const updatedPackages = formData.packages.filter((_, i) => i !== index);
      calculateWeights(updatedPackages);
    }
  };
  
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "*/*"
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleInputChange('packingList', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  
  const handleSubmit = async () => {
    // This function is called when the user submits the form on the LAST step.
    // The "Cancel" button is separate from this.
    setLoading(true);
    try {
      await AsyncStorage.setItem('lastQuoteData', JSON.stringify({
        ...formData,
        quoteType: 'Air Freight'
      }));
      router.push('/quote/share-options');
    } catch (error) {
      console.error('Error saving quote data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const steps = [
    {
      title: t('shipmentDetails'),
      form: ( /* ... Your existing form content for step 1 ... */
        <View style={styles.formStep}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('shipmentType')}
          </Text>
          
          <DropDownPicker
            open={shipmentTypeOpen}
            value={formData.shipmentType}
            items={shipmentTypes}
            setOpen={setShipmentTypeOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.shipmentType);
                handleInputChange('shipmentType', value);
              } else {
                handleInputChange('shipmentType', callback);
              }
            }}
            style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            textStyle={[styles.dropdownText, { color: colors.text }]}
            zIndex={3000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
            {t('serviceType')}
          </Text>
          
          <DropDownPicker
            open={serviceTypeOpen}
            value={formData.serviceType}
            items={serviceTypes}
            setOpen={setServiceTypeOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.serviceType);
                handleInputChange('serviceType', value);
              } else {
                handleInputChange('serviceType', callback);
              }
            }}
            style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            textStyle={[styles.dropdownText, { color: colors.text }]}
            zIndex={2000}
            zIndexInverse={2000}
            listMode="SCROLLVIEW"
          />
        </View>
      )
    },
    {
      title: t('routeInformation'),
      form: ( /* ... Your existing form content for step 2 ... */
        <View style={styles.formStep}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('originCountry') : t('destinationCountry')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterOriginCountry') : t('enterDestinationCountry')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.originCountry : formData.destinationCountry}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'originCountry' : 'destinationCountry', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('originCity') : t('destinationCity')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterOriginCity') : t('enterDestinationCity')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.originCity : formData.destinationCity}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'originCity' : 'destinationCity', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('originAirport') : t('destinationAirport')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterOriginAirport') : t('enterDestinationAirport')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.originAirport : formData.destinationAirport}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'originAirport' : 'destinationAirport', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('pickupLocation') : t('deliveryAddress')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterPickupLocation') : t('enterDeliveryAddress')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.pickupAddress : formData.deliveryAddress}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'pickupAddress' : 'deliveryAddress', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('destinationCountry') : t('originCountry')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterDestinationCountry') : t('enterOriginCountry')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.destinationCountry : formData.originCountry}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'destinationCountry' : 'originCountry', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('destinationCity') : t('originCity')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterDestinationCity') : t('enterOriginCity')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.destinationCity : formData.originCity}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'destinationCity' : 'originCity', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('destinationAirport') : t('originAirport')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterDestinationAirport') : t('enterOriginAirport')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.destinationAirport : formData.originAirport}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'destinationAirport' : 'originAirport', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {formData.shipmentType === 'export' ? t('deliveryAddress') : t('pickupLocation')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterDeliveryAddress') : t('enterPickupLocation')}
              placeholderTextColor={colors.textSecondary}
              value={formData.shipmentType === 'export' ? formData.deliveryAddress : formData.pickupAddress}
              onChangeText={(text) => handleInputChange(formData.shipmentType === 'export' ? 'deliveryAddress' : 'pickupAddress', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      )
    },
    {
      title: t('cargoDetails'),
      form: ( /* ... Your existing form content for step 3 ... */
        <View style={styles.formStep}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('commodityDescription')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterCommodityDescription')}
              placeholderTextColor={colors.textSecondary}
              value={formData.commodity}
              onChangeText={(text) => handleInputChange('commodity', text)}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('hsCode')} <Text style={{ color: colors.textSecondary }}>({t('optional')})</Text>
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterHsCode')}
              placeholderTextColor={colors.textSecondary}
              value={formData.hsCode}
              onChangeText={(text) => handleInputChange('hsCode', text)}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            onPress={pickDocument}
          >
            <File size={20} color={colors.primary} />
            <Text style={[styles.documentButtonText, { color: colors.text }]}>
              {formData.packingList ? t('packingListUploaded') : t('uploadPackingList')}
            </Text>
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
          
          {/* Package Management Section */}
          <View style={styles.packageSection}>
            <View style={styles.packageHeader}>
              <Text style={[styles.packageTitle, { color: colors.text }]}>
                {t('dimensions')} & {t('grossWeight')}
              </Text>
              {formData.packages.length < 5 && (
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={addPackage}
                >
                  <Plus size={16} color={colors.white} />
                  <Text style={[styles.addButtonText, { color: colors.white }]}>
                    Add Package
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {formData.packages.map((pkg, index) => (
              <View key={index} style={styles.packageItem}>
                <View style={styles.packageItemHeader}>
                  <Text style={[styles.packageItemTitle, { color: colors.text }]}>
                    Package {index + 1}
                  </Text>
                  {formData.packages.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removePackage(index)}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.dimensionsRow}>
                  <View style={[styles.dimensionField, { marginRight: 8 }]}>
                    <Text style={[styles.dimensionLabel, { color: colors.text }]}>L (cm)</Text>
                    <TextInput
                      style={[styles.dimensionInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={pkg.length}
                      onChangeText={(text) => handlePackageChange(index, 'length', text)}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={[styles.dimensionField, { marginHorizontal: 4 }]}>
                    <Text style={[styles.dimensionLabel, { color: colors.text }]}>W (cm)</Text>
                    <TextInput
                      style={[styles.dimensionInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={pkg.width}
                      onChangeText={(text) => handlePackageChange(index, 'width', text)}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={[styles.dimensionField, { marginLeft: 8 }]}>
                    <Text style={[styles.dimensionLabel, { color: colors.text }]}>H (cm)</Text>
                    <TextInput
                      style={[styles.dimensionInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={pkg.height}
                      onChangeText={(text) => handlePackageChange(index, 'height', text)}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                
                <View style={styles.weightRow}>
                  <View style={[styles.weightField, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.dimensionLabel, { color: colors.text }]}>{t('grossWeight')} (kg)</Text>
                    <TextInput
                      style={[styles.dimensionInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={pkg.weight}
                      onChangeText={(text) => handlePackageChange(index, 'weight', text)}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={[styles.weightField, { width: 80, marginLeft: 8 }]}>
                    <Text style={[styles.dimensionLabel, { color: colors.text }]}>Pieces</Text>
                    <TextInput
                      style={[styles.dimensionInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={pkg.pieces}
                      onChangeText={(text) => handlePackageChange(index, 'pieces', text)}
                      placeholder="1"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                
                <View style={styles.volumetricRow}>
                  <Text style={[styles.volumetricLabel, { color: colors.textSecondary }]}>
                    Volumetric Weight:
                  </Text>
                  <Text style={[styles.volumetricValue, { color: colors.text }]}>
                    {pkg.volumetricWeight} kg
                  </Text>
                </View>
              </View>
            ))}
            
            <View style={styles.weightSummary}>
              <View style={styles.weightSummaryRow}>
                <Text style={[styles.weightSummaryLabel, { color: colors.text }]}>
                  Total Actual Weight:
                </Text>
                <Text style={[styles.weightSummaryValue, { color: colors.text }]}>
                  {formData.totalActualWeight} kg
                </Text>
              </View>
              <View style={styles.weightSummaryRow}>
                <Text style={[styles.weightSummaryLabel, { color: colors.text }]}>
                  Total Volumetric Weight:
                </Text>
                <Text style={[styles.weightSummaryValue, { color: colors.text }]}>
                  {formData.totalVolumetricWeight} kg
                </Text>
              </View>
              <View style={styles.weightSummaryRow}>
                <Text style={[styles.weightSummaryLabel, { color: colors.primary, fontFamily: 'Poppins-SemiBold' }]}>
                  Chargeable Weight:
                </Text>
                <Text style={[styles.weightSummaryValue, { color: colors.primary, fontFamily: 'Poppins-SemiBold' }]}>
                  {formData.chargeableWeight} kg
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('cargoReadyDate')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterCargoReadyDate')}
              placeholderTextColor={colors.textSecondary}
              value={formData.cargoReady}
              onChangeText={(text) => handleInputChange('cargoReady', text)}
            />
          </View>
        </View>
      )
    },
    {
      title: t('additionalServices'),
      form: ( // This is the LAST step, so the submit button is here
        <View style={styles.formStep}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('incoterms')}
          </Text>
          
          <DropDownPicker
            open={incotermsOpen}
            value={formData.incoterms}
            items={incotermsOptions}
            setOpen={setIncotermsOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.incoterms);
                handleInputChange('incoterms', value);
              } else {
                handleInputChange('incoterms', callback);
              }
            }}
            style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            textStyle={[styles.dropdownText, { color: colors.text }]}
            zIndex={3000} 
            zIndexInverse={1000} 
            listMode="SCROLLVIEW"
          />
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleInputChange('insurance', !formData.insurance)}
            >
              <View style={[styles.checkbox, { 
                backgroundColor: formData.insurance ? colors.primary : colors.backgroundSecondary,
                borderColor: formData.insurance ? colors.primary : colors.border
              }]}>
                {formData.insurance && <Check size={16} color={colors.white} />}
              </View>
              <Text style={[styles.optionText, { color: colors.text }]}>
                {t('requireInsurance')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleInputChange('clearance', !formData.clearance)}
            >
              <View style={[styles.checkbox, { 
                backgroundColor: formData.clearance ? colors.primary : colors.backgroundSecondary,
                borderColor: formData.clearance ? colors.primary : colors.border
              }]}>
                {formData.clearance && <Check size={16} color={colors.white} />}
              </View>
              <Text style={[styles.optionText, { color: colors.text }]}>
                {t('requireClearance')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('additionalNotes')} <Text style={{ color: colors.textSecondary }}>({t('optional')})</Text>
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterAdditionalNotes')}
              placeholderTextColor={colors.textSecondary}
              value={formData.notes}
              onChangeText={(text) => handleInputChange('notes', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* SUBMIT BUTTON FOR THE ENTIRE FORM - RENDERED ON THE LAST STEP */}
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit} // This is your existing submit for the whole form
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[styles.submitButtonText, { color: colors.white }]}>
                {t('submitQuoteRequest')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )
    }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('airFreightQuote')} showBackButton={true} />
      
      <FormStepper 
        steps={steps.map(step => step.title)}
        currentStep={activeStep}
        colors={colors}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        nestedScrollEnabled={true}
        scrollEnabled={!shipmentTypeOpen && !serviceTypeOpen && !incotermsOpen} 
      >
        {activeStep > 0 && !shipmentTypeOpen && !serviceTypeOpen && !incotermsOpen && (
          <TouchableOpacity 
            style={[styles.backButton, { borderColor: colors.border }]}
            onPress={handleBack}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              {t('back')}
            </Text>
          </TouchableOpacity>
        )}
        
        <MultiForm
          forms={steps.map(step => step.form)}
          activeForm={activeStep}
          onNext={handleNext} // Your MultiForm likely handles its own Next button internally
          onPrevious={handleBack} // Your MultiForm likely handles its own Back button internally
          isLastStep={activeStep === steps.length - 1}
          colors={colors}
          t={t}
          // If MultiForm doesn't render the final submit button, you might render it here based on isLastStep
          // For now, assuming your last step's 'form' content includes the main submit button.
        />

        {/* "Cancel and Exit" Button - Placed after MultiForm */}
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.error }]}
          onPress={handleCancelExit}
        >
          <Text style={[styles.cancelButtonText, { color: colors.error }]}>
            {t('cancelAndExit') || "Cancel and Exit"} 
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// Add styles for the new cancel button
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  formStep: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 16,
  },
  dropdown: {
    borderRadius: 8,
    height: 50,
    borderWidth: 1,
  },
  dropdownContainer: {
    borderWidth: 1,
  },
  dropdownText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  documentButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
  optionsContainer: {
    marginVertical: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  submitButton: { // This is your main form submission button
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24, // Existing margin
    // It's already styled in your steps, no need to duplicate here unless it's outside MultiForm
  },
  submitButtonText: { // For your main form submission button
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  backButton: { // Your existing custom back button for steps
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  packageSection: {
    marginBottom: 16,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  packageItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  packageItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageItemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  dimensionsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dimensionField: {
    flex: 1,
  },
  dimensionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  dimensionInput: {
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  weightRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end', 
  },
  weightField: {
  },
  volumetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8, 
  },
  volumetricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  volumetricValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  weightSummary: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
  },
  weightSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weightSummaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  weightSummaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  // Styles for the NEW Cancel and Exit button
  cancelButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 16, // Add some space above it
    marginBottom: 16, // Add some space below it if needed
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});
// --- END OF FILE air.tsx (Updated for In-Screen Cancel Button) ---
