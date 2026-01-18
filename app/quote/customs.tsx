<<<<<<< HEAD
// --- START OF FILE customs.tsx (Updated for In-Screen Cancel Button) ---

import { useState } from 'react'; // Removed useEffect
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native'; // Added Alert, Platform
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router'; // Removed useNavigation
import { Check, Plus, File, X } from 'lucide-react-native';
import Header from '@/components/common/Header';
import FormStepper from '@/components/quote/FormStepper';
import MultiForm from '@/components/quote/MultiForm';
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed: import ExitQuoteButton from '@/components/common/ExitQuoteButton';

interface DocumentFile {
  type: string;
  uri: string;
  name: string;
}

interface FormData {
  shipmentMode: string;
=======
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import { Check, Plus, File } from 'lucide-react-native';
import Header from '@/components/common/Header';
import FormStepper from '@/components/quote/FormStepper';
import MultiForm from '@/components/quote/MultiForm';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  importExportType: string;
  declarationType: string;
  originCountry: string;
  originCity: string;
<<<<<<< HEAD
  pickupAddress: string;
=======
  pickupLocation: string;
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  destinationCountry: string;
  destinationCity: string;
  deliveryAddress: string;
  commodity: string;
  hsCode: string;
  value: string;
  dutyExemption: boolean;
<<<<<<< HEAD
  documents: {
    commercialInvoice: DocumentFile | null;
    certificateOfOrigin: DocumentFile | null;
    transportDocument: DocumentFile | null;
    packingList: DocumentFile | null;
    otherDocuments: DocumentFile[];
  };
=======
  documents: string | null;
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  notes: string;
}

export default function CustomsQuoteScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
<<<<<<< HEAD
    shipmentMode: 'sea_freight',
=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    importExportType: 'permanent',
    declarationType: 'standard',
    originCountry: '',
    originCity: '',
<<<<<<< HEAD
    pickupAddress: '',
=======
    pickupLocation: '',
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    destinationCountry: '',
    destinationCity: '',
    deliveryAddress: '',
    commodity: '',
    hsCode: '',
    value: '',
    dutyExemption: false,
<<<<<<< HEAD
    documents: {
      commercialInvoice: null,
      certificateOfOrigin: null,
      transportDocument: null,
      packingList: null,
      otherDocuments: []
    },
    notes: ''
  });
  
  const [shipmentModeOpen, setShipmentModeOpen] = useState(false);
  const [importExportTypeOpen, setImportExportTypeOpen] = useState(false);
  const [declarationTypeOpen, setDeclarationTypeOpen] = useState(false);
  
  const shipmentModes = [
    { label: t('seaFreight'), value: 'sea_freight' },
    { label: t('airFreight'), value: 'air_freight' },
    { label: t('landFreight'), value: 'land_freight' },
    { label: t('breakbulk'), value: 'breakbulk' }
  ];
  
=======
    documents: null,
    notes: ''
  });
  
  const [importExportTypeOpen, setImportExportTypeOpen] = useState(false);
  const [declarationTypeOpen, setDeclarationTypeOpen] = useState(false);
  
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  const importExportTypes = [
    { label: t('permanent'), value: 'permanent' },
    { label: t('temporary'), value: 'temporary' },
    { label: t('reExport'), value: 're_export' }
  ];
  
  const declarationTypes = [
    { label: 'Standard', value: 'standard' },
    { label: 'Simplified', value: 'simplified' },
    { label: 'ATA Carnet', value: 'ata_carnet' }
  ];
  
<<<<<<< HEAD
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

=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
<<<<<<< HEAD
  const pickDocument = async (documentType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "*/*"
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const documentFile: DocumentFile = {
          type: documentType,
          uri: result.assets[0].uri,
          name: result.assets[0].name || 'document'
        };
        
        setFormData(prev => {
          const updatedDocuments = { ...prev.documents };
          
          switch (documentType) {
            case 'commercialInvoice':
              updatedDocuments.commercialInvoice = documentFile;
              break;
            case 'certificateOfOrigin':
              updatedDocuments.certificateOfOrigin = documentFile;
              break;
            case 'transportDocument':
              updatedDocuments.transportDocument = documentFile;
              break;
            case 'packingList':
              updatedDocuments.packingList = documentFile;
              break;
            case 'other':
              updatedDocuments.otherDocuments = [...updatedDocuments.otherDocuments, documentFile];
              break;
          }
          
          return { ...prev, documents: updatedDocuments };
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  
  const removeDocument = (documentType: string, index?: number) => {
    setFormData(prev => {
      const updatedDocuments = { ...prev.documents };
      
      switch (documentType) {
        case 'commercialInvoice':
          updatedDocuments.commercialInvoice = null;
          break;
        case 'certificateOfOrigin':
          updatedDocuments.certificateOfOrigin = null;
          break;
        case 'transportDocument':
          updatedDocuments.transportDocument = null;
          break;
        case 'packingList':
          updatedDocuments.packingList = null;
          break;
        case 'other':
          if (index !== undefined) {
            updatedDocuments.otherDocuments = updatedDocuments.otherDocuments.filter((_, i) => i !== index);
          }
          break;
      }
      
      return { ...prev, documents: updatedDocuments };
    });
=======
  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });
    
    if (!result.canceled) {
      handleInputChange('documents', result.assets[0].uri);
    }
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      await AsyncStorage.setItem('lastQuoteData', JSON.stringify({
        ...formData,
        quoteType: 'Customs Clearance'
      }));
      
      router.push('/quote/share-options');
    } catch (error) {
      console.error('Error saving quote data:', error);
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD

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
=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  
  const steps = [
    {
      title: t('shipmentDetails'),
<<<<<<< HEAD
      form: ( /* ... Your existing form content for step 1 ... */
        <View style={styles.formStep}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('shipmentMode')}
          </Text>
          
          <DropDownPicker
            open={shipmentModeOpen}
            value={formData.shipmentMode}
            items={shipmentModes}
            setOpen={setShipmentModeOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.shipmentMode);
                handleInputChange('shipmentMode', value);
              } else {
                handleInputChange('shipmentMode', callback);
              }
            }}
            style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            textStyle={[styles.dropdownText, { color: colors.text }]}
            zIndex={4000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
=======
      form: (
        <View style={styles.formStep}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
            {t('importExportType')}
          </Text>
          
          <DropDownPicker
            open={importExportTypeOpen}
            value={formData.importExportType}
            items={importExportTypes}
            setOpen={setImportExportTypeOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.importExportType);
                handleInputChange('importExportType', value);
              } else {
                handleInputChange('importExportType', callback);
              }
            }}
            style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            textStyle={[styles.dropdownText, { color: colors.text }]}
            zIndex={3000}
<<<<<<< HEAD
            zIndexInverse={2000}
            listMode="SCROLLVIEW"
=======
            zIndexInverse={1000}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
          />
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
            {t('declarationType')}
          </Text>
          
          <DropDownPicker
            open={declarationTypeOpen}
            value={formData.declarationType}
            items={declarationTypes}
            setOpen={setDeclarationTypeOpen}
            setValue={(callback) => {
              if (typeof callback === 'function') {
                const value = callback(formData.declarationType);
                handleInputChange('declarationType', value);
              } else {
                handleInputChange('declarationType', callback);
              }
            }}
            style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            textStyle={[styles.dropdownText, { color: colors.text }]}
            zIndex={2000}
<<<<<<< HEAD
            zIndexInverse={3000}
            listMode="SCROLLVIEW"
=======
            zIndexInverse={2000}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
          />
        </View>
      )
    },
    {
      title: t('routeInformation'),
<<<<<<< HEAD
      form: ( /* ... Your existing form content for step 2 ... */
=======
      form: (
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
        <View style={styles.formStep}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('originCountry')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterOriginCountry')}
              placeholderTextColor={colors.textSecondary}
              value={formData.originCountry}
              onChangeText={(text) => handleInputChange('originCountry', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('originCity')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterOriginCity')}
              placeholderTextColor={colors.textSecondary}
              value={formData.originCity}
              onChangeText={(text) => handleInputChange('originCity', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
<<<<<<< HEAD
              {t('pickupAddress')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterPickupAddress')}
              placeholderTextColor={colors.textSecondary}
              value={formData.pickupAddress}
              onChangeText={(text) => handleInputChange('pickupAddress', text)}
=======
              {t('pickupLocation')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterPickupLocation')}
              placeholderTextColor={colors.textSecondary}
              value={formData.pickupLocation}
              onChangeText={(text) => handleInputChange('pickupLocation', text)}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('destinationCountry')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterDestinationCountry')}
              placeholderTextColor={colors.textSecondary}
              value={formData.destinationCountry}
              onChangeText={(text) => handleInputChange('destinationCountry', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('destinationCity')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterDestinationCity')}
              placeholderTextColor={colors.textSecondary}
              value={formData.destinationCity}
              onChangeText={(text) => handleInputChange('destinationCity', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('deliveryAddress')}
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterDeliveryAddress')}
              placeholderTextColor={colors.textSecondary}
              value={formData.deliveryAddress}
              onChangeText={(text) => handleInputChange('deliveryAddress', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      )
    },
    {
      title: t('cargoDetails'),
<<<<<<< HEAD
      form: ( /* ... Your existing form content for step 3 ... */
=======
      form: (
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
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
              {t('hsCode')}
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder={t('enterHsCode')}
              placeholderTextColor={colors.textSecondary}
              value={formData.hsCode}
              onChangeText={(text) => handleInputChange('hsCode', text)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {t('value')} (USD)
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter shipment value"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.value}
              onChangeText={(text) => handleInputChange('value', text)}
            />
          </View>
        </View>
      )
    },
    {
<<<<<<< HEAD
      title: t('additionalServices'), // Renamed from 'documents' in original to match other forms' last step title
      form: ( // This is the LAST step
        <View style={styles.formStep}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Required Documents
          </Text>
          
          {/* Commercial Invoice */}
          <View style={styles.documentSection}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              Commercial Invoice
            </Text>
            {formData.documents.commercialInvoice ? (
              <View style={[styles.documentItem, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {formData.documents.commercialInvoice.name}
                </Text>
                <TouchableOpacity onPress={() => removeDocument('commercialInvoice')}>
                  <X size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => pickDocument('commercialInvoice')}
              >
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentButtonText, { color: colors.text }]}>
                  Upload Commercial Invoice
                </Text>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Certificate of Origin */}
          <View style={styles.documentSection}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              Certificate of Origin
            </Text>
            {formData.documents.certificateOfOrigin ? (
              <View style={[styles.documentItem, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {formData.documents.certificateOfOrigin.name}
                </Text>
                <TouchableOpacity onPress={() => removeDocument('certificateOfOrigin')}>
                  <X size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => pickDocument('certificateOfOrigin')}
              >
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentButtonText, { color: colors.text }]}>
                  Upload Certificate of Origin
                </Text>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* BL/AWB */}
          <View style={styles.documentSection}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              BL/AWB
            </Text>
            {formData.documents.transportDocument ? (
              <View style={[styles.documentItem, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {formData.documents.transportDocument.name}
                </Text>
                <TouchableOpacity onPress={() => removeDocument('transportDocument')}>
                  <X size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => pickDocument('transportDocument')}
              >
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentButtonText, { color: colors.text }]}>
                  Upload BL/AWB
                </Text>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Packing List */}
          <View style={styles.documentSection}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              Packing List
            </Text>
            {formData.documents.packingList ? (
              <View style={[styles.documentItem, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {formData.documents.packingList.name}
                </Text>
                <TouchableOpacity onPress={() => removeDocument('packingList')}>
                  <X size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={() => pickDocument('packingList')}
              >
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentButtonText, { color: colors.text }]}>
                  Upload Packing List
                </Text>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Other Documents */}
          <View style={styles.documentSection}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              Other Documents
            </Text>
            
            {formData.documents.otherDocuments.map((doc, index) => (
              <View key={index} style={[styles.documentItem, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <File size={20} color={colors.primary} />
                <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {doc.name}
                </Text>
                <TouchableOpacity onPress={() => removeDocument('other', index)}>
                  <X size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity 
              style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={() => pickDocument('other')}
            >
              <File size={20} color={colors.primary} />
              <Text style={[styles.documentButtonText, { color: colors.text }]}>
                Upload Additional Document
              </Text>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
=======
      title: t('additionalServices'),
      form: (
        <View style={styles.formStep}>
          <TouchableOpacity 
            style={[styles.documentButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            onPress={pickDocument}
          >
            <File size={20} color={colors.primary} />
            <Text style={[styles.documentButtonText, { color: colors.text }]}>
              {formData.documents ? 'Documents Uploaded' : 'Upload Supporting Documents'}
            </Text>
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => handleInputChange('dutyExemption', !formData.dutyExemption)}
          >
            <View style={[styles.checkbox, { 
              backgroundColor: formData.dutyExemption ? colors.primary : colors.backgroundSecondary,
              borderColor: formData.dutyExemption ? colors.primary : colors.border
            }]}>
              {formData.dutyExemption && <Check size={16} color={colors.white} />}
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>
              {t('dutyExemption')}
            </Text>
          </TouchableOpacity>
          
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
      <Header title={t('customsQuote')} showBackButton={true} />
      
      <FormStepper 
        steps={steps.map(step => step.title)}
        currentStep={activeStep}
        colors={colors}
      />
      
<<<<<<< HEAD
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        nestedScrollEnabled={true}
        scrollEnabled={!shipmentModeOpen && !importExportTypeOpen && !declarationTypeOpen}
      >
        {activeStep > 0 && !shipmentModeOpen && !importExportTypeOpen && !declarationTypeOpen && (
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
=======
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <MultiForm
          forms={steps.map(step => step.form)}
          activeForm={activeStep}
          onNext={() => {
            if (activeStep < steps.length - 1) {
              setActiveStep(activeStep + 1);
            }
          }}
          onPrevious={() => {
            if (activeStep > 0) {
              setActiveStep(activeStep - 1);
            }
          }}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
          isLastStep={activeStep === steps.length - 1}
          colors={colors}
          t={t}
        />
<<<<<<< HEAD

        {/* "Cancel and Exit" Button - Placed after MultiForm */}
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.error }]}
          onPress={handleCancelExit}
        >
          <Text style={[styles.cancelButtonText, { color: colors.error }]}>
            {t('cancelAndExit') || "Cancel and Exit"} 
          </Text>
        </TouchableOpacity>

=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
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
<<<<<<< HEAD
    textAlignVertical: 'top',
  },
  documentSection: {
    marginBottom: 16,
  },
  documentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
<<<<<<< HEAD
  },
  documentButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  documentName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  optionsContainer: { // This style was defined but not used in original customs.tsx, keeping for consistency
    marginVertical: 16,
=======
    marginBottom: 16,
  },
  documentButtonText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginVertical: 16, 
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
=======
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  submitButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
  },
  submitButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
<<<<<<< HEAD
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
// --- END OF FILE customs.tsx (Updated for In-Screen Cancel Button) ---
=======
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
