// --- START OF FILE land.tsx (Updated for In-Screen Cancel Button) ---

import { useState } from 'react'; // Removed useEffect
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native'; // Added Alert, Platform
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router'; // Removed useNavigation
import { Check, Plus, File } from 'lucide-react-native';
import Header from '@/components/common/Header';
import FormStepper from '@/components/quote/FormStepper';
import MultiForm from '@/components/quote/MultiForm';
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed: import ExitQuoteButton from '@/components/common/ExitQuoteButton';

interface FormData {
  shipmentType: string;
  truckType: string;
  originCountry: string;
  originCity: string;
  pickupAddress: string;
  destinationCountry: string;
  destinationCity: string;
  deliveryAddress: string;
  commodity: string;
  hsCode: string;
  packingList: string | null;
  weight: string;
  dimensions: string;
  cargoReady: string;
  incoterms: string;
  insurance: boolean;
  clearance: boolean;
  notes: string;
}

export default function LandFreightQuoteScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    shipmentType: 'import',
    truckType: 'ftl',
    originCountry: '',
    originCity: '',
    pickupAddress: '',
    destinationCountry: '',
    destinationCity: '',
    deliveryAddress: '',
    commodity: '',
    hsCode: '',
    packingList: null,
    weight: '',
    dimensions: '',
    cargoReady: '',
    incoterms: 'dap',
    insurance: false,
    clearance: false,
    notes: ''
  });
  
  const [shipmentTypeOpen, setShipmentTypeOpen] = useState(false);
  const [truckTypeOpen, setTruckTypeOpen] = useState(false);
  const [incotermsOpen, setIncotermsOpen] = useState(false);
  
  const shipmentTypes = [
    { label: t('import'), value: 'import' },
    { label: t('export'), value: 'export' }
  ];
  
  const truckTypes = [
    { label: t('fullTruck'), value: 'ftl' },
    { label: t('lessTruck'), value: 'ltl' },
    { label: t('refrigerated'), value: 'reefer' },
    { label: t('flatbed'), value: 'flatbed' }
  ];
  
  const incotermsOptions = [
    { label: 'DAP', value: 'dap' },
    { label: 'DDP', value: 'ddp' },
    { label: 'EXW', value: 'exw' }
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
    setLoading(true);
    
    try {
      await AsyncStorage.setItem('lastQuoteData', JSON.stringify({
        ...formData,
        quoteType: 'Land Freight'
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
            {t('truckType')}
          </Text>
          
          <DropDownPicker
            open={truckTypeOpen}
            value={formData.truckType}
            items={truckTypes}
            setOpen={setTruckTypeOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.truckType);
                handleInputChange('truckType', value);
              } else {
                handleInputChange('truckType', callback);
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
              {formData.shipmentType === 'export' ? t('pickupAddress') : t('deliveryAddress')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterPickupAddress') : t('enterDeliveryAddress')}
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
              {formData.shipmentType === 'export' ? t('deliveryAddress') : t('pickupAddress')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={formData.shipmentType === 'export' ? t('enterDeliveryAddress') : t('enterPickupAddress')}
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
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('grossWeight')} (KG)
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterGrossWeight')}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('dimensions')} (L x W x H cm)
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterDimensions')}
              placeholderTextColor={colors.textSecondary}
              value={formData.dimensions}
              onChangeText={(text) => handleInputChange('dimensions', text)}
            />
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
      form: ( // This is the LAST step
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
            zIndex={3000} // Corrected from previous copy-paste error
            zIndexInverse={1000} // Corrected from previous copy-paste error
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
                {t('requireCustomsClearance')}
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
          
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
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
      <Header title={t('landFreightQuote')} showBackButton={true} />
      
      <FormStepper 
        steps={steps.map(step => step.title)}
        currentStep={activeStep}
        colors={colors}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        nestedScrollEnabled={true}
        scrollEnabled={!shipmentTypeOpen && !truckTypeOpen && !incotermsOpen}
      >
        {activeStep > 0 && !shipmentTypeOpen && !truckTypeOpen && !incotermsOpen && (
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
          onNext={handleNext}
          onPrevious={handleBack}
          isLastStep={activeStep === steps.length - 1}
          colors={colors}
          t={t}
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
  submitButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  backButton: {
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
  // Styles for the NEW Cancel and Exit button
  cancelButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 16, 
    marginBottom: 16,
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});
// --- END OF FILE land.tsx (Updated for In-Screen Cancel Button) ---
