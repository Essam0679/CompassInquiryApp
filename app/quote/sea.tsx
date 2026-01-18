// --- START OF FILE app/quote/sea.tsx (Full Code - Focus on Item Titles) ---

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/I18nContext';
import { useRouter } from 'expo-router';
import { Check, Plus, File, Trash2 } from 'lucide-react-native';
import Header from '@/components/common/Header';
import FormStepper from '@/components/quote/FormStepper';
import MultiForm from '@/components/quote/MultiForm';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerResult, DocumentPickerSuccessResult } from 'expo-document-picker'; 
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ... (Interfaces and Utility functions remain the same as previous full code response) ...
interface FclContainer { id: string; size: string; quantity: string; }
interface LclPackage { id: string; length: string; width: string; height: string; weight: string; pieces: string; volumeCBM: string; }
interface FormData {
  shipmentType: string; containerType: string; fclContainers: FclContainer[]; lclPackages: LclPackage[];
  totalLclVolumeCBM: string; totalLclGrossWeight: string; originCountry: string; originCity: string;
  originPort: string; pickupAddress: string; destinationCountry: string; destinationCity: string;
  destinationPort: string; deliveryAddress: string; commodity: string; hsCode: string;
  packingList: string | null; weight?: string; cargoReady: string; incoterms: string;
  insurance: boolean; clearance: boolean; notes: string;
}
const generateId = () => Math.random().toString(36).substr(2, 9);
const emptyFclContainer: Omit<FclContainer, 'id'> = { size: '20ft_standard_dry', quantity: '1' };
const emptyLclPackage: Omit<LclPackage, 'id' | 'volumeCBM'> = { length: '', width: '', height: '', weight: '', pieces: '1' };


export default function SeaFreightQuoteScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const styles = useMemo(() => StyleSheet.create({ // Styles remain the same
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 32 },
    formStep: { marginBottom: 16 },
    sectionTitle: { fontFamily: 'Poppins-Medium', fontSize: 16, marginBottom: 16, color: colors.text },
    subSection: { marginTop: 20, marginBottom: 10 },
    subSectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15, marginBottom: 10, color: colors.text },
    dropdown: { borderRadius: 8, height: 50, borderWidth: 1, marginBottom: Platform.OS === 'android' ? 8 : 0, backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
    dropdownContainer: { borderWidth: 1, backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
    dropdownText: { fontFamily: 'Inter-Regular', fontSize: 14, color: colors.text },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, marginBottom: 8, color: colors.text },
    inputLabelSmall: { fontFamily: 'Inter-Regular', fontSize: 12, marginBottom: 4, color: colors.text },
    textInput: { height: 50, borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Inter-Regular', fontSize: 14, borderWidth: 1, backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border },
    smallInput: { height: 40, paddingHorizontal: 10, fontSize: 13 },
    textArea: { minHeight: 100, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 14, borderWidth: 1, textAlignVertical: 'top', backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border },
    documentButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, marginBottom: 16, backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
    documentButtonText: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 14, marginLeft: 8, color: colors.text },
    optionsContainer: { marginVertical: 16 },
    optionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    optionText: { fontFamily: 'Inter-Regular', fontSize: 14, color: colors.text },
    submitButton: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24, backgroundColor: colors.primary },
    submitButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, color: colors.white },
    backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, marginBottom: 16, borderColor: colors.border },
    backButtonText: { fontFamily: 'Inter-Medium', fontSize: 14, color: colors.text },
    cancelButton: { height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginTop: 16, marginBottom: 16, borderColor: colors.error },
    cancelButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, color: colors.error },
    itemCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12, borderColor: colors.border },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    itemTitle: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.text },
    removeButton: { padding: 4 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginTop: 8, alignSelf: 'flex-start', backgroundColor: colors.primary },
    addButtonText: { fontFamily: 'Poppins-Medium', fontSize: 14, marginLeft: 6, color: colors.white },
    dimensionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 8 },
    dimensionField: { flex: 1 },
    calculatedValue: { fontFamily: 'Inter-Medium', fontSize: 14, marginTop: Platform.OS === 'android' ? 8 : 6 , textAlign: 'left', color: colors.text, marginBottom: 4 },
    totalsCard: { marginTop: 16, padding: 12, borderRadius: 8, borderWidth: 1, backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
    totalText: { fontFamily: 'Inter-SemiBold', fontSize: 14, marginBottom: 6, color: colors.text },
  }), [colors]);

  // ... (State, useEffects, Callbacks for FCL/LCL, handleInputChange, pickDocument, handleSubmit, handleCancelExit, handleNext, handleBack remain THE SAME as the previous full code response) ...
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    shipmentType: 'import', containerType: 'fcl', fclContainers: [{ ...emptyFclContainer, id: generateId() }],
    lclPackages: [], totalLclVolumeCBM: '0.000', totalLclGrossWeight: '0.00',
    originCountry: '', originCity: '', originPort: '', pickupAddress: '',
    destinationCountry: '', destinationCity: '', destinationPort: '', deliveryAddress: '',
    commodity: '', hsCode: '', packingList: null, weight: '', cargoReady: '',
    incoterms: 'fob', insurance: false, clearance: false, notes: ''
  });
  const [shipmentTypeOpen, setShipmentTypeOpen] = useState(false);
  const [containerTypeOpen, setContainerTypeOpen] = useState(false);
  const [incotermsOpen, setIncotermsOpen] = useState(false);
  const [fclContainerSizeOpenStates, setFclContainerSizeOpenStates] = useState<boolean[]>(() => formData.fclContainers.map(() => false));
  useEffect(() => { setFclContainerSizeOpenStates(formData.fclContainers.map(() => false)); }, [formData.fclContainers.length]);
  const shipmentTypes = useMemo(() => [{ label: t('import'), value: 'import' }, { label: t('export'), value: 'export' }], [t]);
  const containerTypes = useMemo(() => [{ label: t('fcl'), value: 'fcl' }, { label: t('lcl'), value: 'lcl' }], [t]);
  const containerSizes = useMemo(() => [ { label: t('20ft_standard_dry'), value: '20ft_standard_dry' }, { label: t('40ft_standard_dry'), value: '40ft_standard_dry' }, { label: t('40ft_high_cube_dry'), value: '40ft_high_cube_dry' }, { label: t('20ft_reefer'), value: '20ft_reefer' }, { label: t('40ft_high_cube_reefer'), value: '40ft_high_cube_reefer' }, { label: t('20ft_open_top'), value: '20ft_open_top' }, { label: t('40ft_open_top'), value: '40ft_open_top' }, { label: t('20ft_flat_rack'), value: '20ft_flat_rack' }, { label: t('40ft_flat_rack'), value: '40ft_flat_rack' }, ], [t]);
  const incotermsOptions = useMemo(() => [ { label: 'FOB', value: 'fob' }, { label: 'CIF', value: 'cif' }, { label: 'EXW', value: 'exw' }, { label: 'DAP', value: 'dap' }, { label: 'DDP', value: 'ddp' }], []);
  const calculateLclTotals = useCallback((packagesToCalc: LclPackage[]) => { let newTotalVolume = 0; let newTotalWeight = 0; const newCalculatedPackages = packagesToCalc.map(pkg => { const length = parseFloat(pkg.length) || 0; const width = parseFloat(pkg.width) || 0; const height = parseFloat(pkg.height) || 0; const itemWeight = parseFloat(pkg.weight) || 0; const pieces = parseInt(pkg.pieces) || 0; let currentPackageVolumeCBM = 0; if (length > 0 && width > 0 && height > 0 && pieces > 0) { currentPackageVolumeCBM = (length / 100) * (width / 100) * (height / 100) * pieces; newTotalVolume += currentPackageVolumeCBM; newTotalWeight += itemWeight * pieces; } return { ...pkg, volumeCBM: currentPackageVolumeCBM.toFixed(3) }; }); setFormData(prev => { const lclPackagesContentChanged = JSON.stringify(prev.lclPackages.map(p => ({l:p.length, w:p.width, h:p.height, wt:p.weight, pcs:p.pieces, vCBM: p.volumeCBM }))) !== JSON.stringify(newCalculatedPackages.map(p => ({l:p.length, w:p.width, h:p.height, wt:p.weight, pcs:p.pieces, vCBM: p.volumeCBM }))); const totalsChanged = prev.totalLclVolumeCBM !== newTotalVolume.toFixed(3) || prev.totalLclGrossWeight !== newTotalWeight.toFixed(2); if (lclPackagesContentChanged || totalsChanged) { return { ...prev, lclPackages: newCalculatedPackages, totalLclVolumeCBM: newTotalVolume.toFixed(3), totalLclGrossWeight: newTotalWeight.toFixed(2) }; } return prev; }); }, []);
  const addFclContainer = useCallback(() => { if (formData.fclContainers.length < 10) { setFormData(prev => ({ ...prev, fclContainers: [...prev.fclContainers, { ...emptyFclContainer, id: generateId() }] })); }}, [formData.fclContainers.length]);
  const removeFclContainer = useCallback((index: number) => { if (formData.fclContainers.length > 1) { setFormData(prev => ({ ...prev, fclContainers: prev.fclContainers.filter((_, i) => i !== index) })); }}, [formData.fclContainers.length]);
  const handleFclContainerChange = useCallback((index: number, field: keyof Omit<FclContainer, 'id'>, value: string) => { setFormData(prev => { const updatedContainers = prev.fclContainers.map((c, i) => i === index ? { ...c, [field]: value } : c); return { ...prev, fclContainers: updatedContainers }; });}, []);
  const toggleFclContainerSizeOpen = useCallback((index: number, open?: boolean) => { setFclContainerSizeOpenStates(prevOpenStates => prevOpenStates.map((item, i) => (i === index ? (open !== undefined ? open : !item) : false)));}, []);
  const addLclPackage = useCallback(() => { if (formData.lclPackages.length < 10) { setFormData(prev => ({ ...prev, lclPackages: [...prev.lclPackages, { ...emptyLclPackage, id: generateId(), volumeCBM: '0.000' }] })); }}, [formData.lclPackages.length]);
  const removeLclPackage = useCallback((index: number) => { if (formData.lclPackages.length > 0) { setFormData(prev => ({ ...prev, lclPackages: prev.lclPackages.filter((_, i) => i !== index) })); }}, [formData.lclPackages.length]);
  const handleLclPackageChange = useCallback((index: number, field: keyof Omit<LclPackage, 'id' | 'volumeCBM'>, value: string) => { setFormData(prev => { const updatedPackages = prev.lclPackages.map((pkg, i) => i === index ? { ...pkg, [field]: value } : pkg ); return { ...prev, lclPackages: updatedPackages }; }); }, []);
  useEffect(() => { if (formData.containerType === 'lcl') { calculateLclTotals(formData.lclPackages); }}, [JSON.stringify(formData.lclPackages.map(p => ({ l:p.length, w:p.width, h:p.height, wt:p.weight, pcs:p.pieces }))), formData.containerType, calculateLclTotals]);
  const handleInputChange = useCallback((field: keyof FormData, value: any) => { setFormData(prev => { const newState = { ...prev, [field]: value }; if (field === 'containerType') { if (value === 'fcl') { newState.lclPackages = []; newState.totalLclGrossWeight = '0.00'; newState.totalLclVolumeCBM = '0.000'; if (newState.fclContainers.length === 0) newState.fclContainers = [{ ...emptyFclContainer, id: generateId() }]; } else if (value === 'lcl') { newState.fclContainers = []; if (newState.lclPackages.length === 0) newState.lclPackages = [{ ...emptyLclPackage, id: generateId(), volumeCBM: '0.000' }]; } } return newState; }); }, []);
  const pickDocument = useCallback(async () => { try { const result: DocumentPickerResult = await DocumentPicker.getDocumentAsync({ type: [ "application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ], copyToCacheDirectory: true, }); if ('canceled' in result && result.canceled) { console.log('Document picking was cancelled by the user.'); } else if ('assets' in result && result.assets && !('canceled' in result && result.canceled)) { const successResult = result as DocumentPickerSuccessResult; if (successResult.assets.length > 0) { handleInputChange('packingList', successResult.assets[0].uri); } else { console.log('Document picking success, but no assets found.'); Alert.alert( t('error', {defaultValue: "Error"}), t('failedToProcessDocument', {defaultValue: "Could not process the selected document."}) ); } } else { console.log('Document picking resulted in an unexpected state:', result); Alert.alert( t('error', {defaultValue: "Error"}), t('failedToProcessDocument', {defaultValue: "Could not process the selected document."}) ); } } catch (err) { console.warn('Error picking document:', err); let errorMessage = t('failedToPickDocumentUnknown', {defaultValue: "An unknown error occurred while picking the document."}); if (err instanceof Error) { errorMessage = err.message; } Alert.alert( t('error', {defaultValue: "Error"}), `${t('failedToPickDocument', {defaultValue: "Failed to pick document"})}: ${errorMessage}` ); } }, [handleInputChange, t]);
  const handleSubmit = useCallback(async () => { setLoading(true); if (formData.containerType === 'fcl' && formData.fclContainers.some(c => !c.size || !c.quantity || parseInt(c.quantity) <= 0)) { Alert.alert(t('validationError', {defaultValue: "Validation Error"}), t('fillAllContainerDetails', {defaultValue: "Please fill in all details (size and valid quantity) for each FCL container."})); setLoading(false); return; } if (formData.containerType === 'lcl' && formData.lclPackages.some(p => !p.length || !p.width || !p.height || !p.weight || !p.pieces || parseInt(p.pieces) <= 0)) { Alert.alert(t('validationError', {defaultValue: "Validation Error"}), t('fillAllPackageDetails', {defaultValue: "Please fill in all details (dimensions, weight, and valid pieces) for each LCL package."})); setLoading(false); return; } try { const quoteDataForStorage = { ...formData, quoteType: 'Sea Freight' }; console.log("SeaFreight form: Preparing to save to AsyncStorage:", JSON.stringify(quoteDataForStorage, null, 2)); await AsyncStorage.setItem('lastQuoteData', JSON.stringify(quoteDataForStorage)); router.push('/quote/share-options'); } catch (error) { console.error("Error saving sea freight data to AsyncStorage or navigating:", error); const errorMessage = error instanceof Error ? error.message : t('tryAgainLater', {defaultValue: "An unexpected error occurred. Please try again."}); Alert.alert(t('error', {defaultValue: "Error"}), errorMessage); } finally { setLoading(false); } }, [formData, router, t]);
  const handleCancelExit = useCallback(() => { Alert.alert( t('exitQuoteInquiry', {defaultValue: "Exit Quote Inquiry"}), t('exitQuoteConfirmation', {defaultValue: "Are you sure you want to exit? Any unsaved changes will be lost."}), [ { text: t('stay', {defaultValue: "Stay"}), style: 'cancel' }, { text: t('exit', {defaultValue: "Exit"}), onPress: () => router.back(), style: 'destructive' } ] ); }, [router, t]);
  const currentStepsLength = useRef(0);
  const handleNext = useCallback(() => { if (activeStep < currentStepsLength.current - 1) setActiveStep(activeStep + 1); }, [activeStep]);
  const handleBack = useCallback(() => { if (activeStep > 0) setActiveStep(activeStep - 1); }, [activeStep]);


  // Define steps for the multi-step form
  const steps = useMemo(() => {
    const stepData = [
    { 
      title: t('shipmentDetails', {defaultValue: "Shipment Details"}), 
      form: () => ( 
        <View style={styles.formStep}>
          <Text style={styles.sectionTitle}>{t('shipmentType', {defaultValue: "Shipment Type"})}</Text>
          <DropDownPicker<string> open={shipmentTypeOpen} value={formData.shipmentType} items={shipmentTypes} setOpen={setShipmentTypeOpen} setValue={(val) => handleInputChange('shipmentType', typeof val === 'function' ? val(formData.shipmentType) : val)} style={styles.dropdown} dropDownContainerStyle={styles.dropdownContainer} textStyle={styles.dropdownText} zIndex={5000} listMode="SCROLLVIEW"/>
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('containerOrPackageDetails', {defaultValue: "Container/Package Details"})}</Text>
          <DropDownPicker<string> open={containerTypeOpen} value={formData.containerType} items={containerTypes} setOpen={setContainerTypeOpen} setValue={(val) => handleInputChange('containerType', typeof val === 'function' ? val(formData.containerType) : val)} style={styles.dropdown} dropDownContainerStyle={styles.dropdownContainer} textStyle={styles.dropdownText} zIndex={4000} listMode="SCROLLVIEW"/>
          
          {formData.containerType === 'fcl' && ( 
            <View style={styles.subSection}> 
              <Text style={styles.subSectionTitle}>{t('fclContainers', {defaultValue: "FCL Containers"})}</Text> 
              {formData.fclContainers.map((container, index) => ( 
                <View key={container.id} style={[styles.itemCard, { zIndex: 3000 - (index * 100) }]}> 
                  <View style={styles.itemHeader}>
                    {/* MODIFIED LINE BELOW */}
                    <Text style={styles.itemTitle}>{`${t('container', {defaultValue: "Container"})} ${index + 1}`}</Text>
                    {formData.fclContainers.length > 1 && (<TouchableOpacity onPress={() => removeFclContainer(index)} style={styles.removeButton}><Trash2 size={18} color={colors.error} /></TouchableOpacity>)}
                  </View> 
                  <DropDownPicker<string> 
                    open={fclContainerSizeOpenStates[index]} 
                    value={container.size} 
                    items={containerSizes} 
                    setOpen={(openVal) => toggleFclContainerSizeOpen(index, typeof openVal === 'function' ? openVal(fclContainerSizeOpenStates[index]) : openVal)} 
                    setValue={(val) => handleFclContainerChange(index, 'size', typeof val === 'function' ? val(container.size) : (val || ''))} 
                    style={[styles.dropdown, { marginBottom: 8 }]} 
                    dropDownContainerStyle={styles.dropdownContainer} 
                    textStyle={styles.dropdownText} 
                    placeholder={t('selectContainerSize', {defaultValue: "Select Container Size"})} 
                    listMode="SCROLLVIEW" 
                    zIndex={2000 - (index * 10)}
                    dropDownDirection="AUTO" 
                    multiple={false} 
                  /> 
                  <Text style={[styles.inputLabelSmall, { marginTop: 8 }]}>{t('quantity', {defaultValue: "Quantity"})}</Text> 
                  <TextInput style={[styles.textInput, styles.smallInput]} placeholder="1" value={container.quantity} onChangeText={(text) => handleFclContainerChange(index, 'quantity', text)} keyboardType="numeric" /> 
                </View> 
              ))} 
              {formData.fclContainers.length < 10 && (<TouchableOpacity onPress={addFclContainer} style={styles.addButton}><Plus size={16} color={colors.white} /><Text style={styles.addButtonText}>{t('addContainer', {defaultValue: "Add Container"})}</Text></TouchableOpacity>)}
            </View> 
          )}

          {formData.containerType === 'lcl' && ( 
            <View style={styles.subSection}> 
              <Text style={styles.subSectionTitle}>{t('lclPackagesOrPallets', {defaultValue: "LCL Packages/Pallets"})}</Text>
              {formData.lclPackages.map((pkg, index) => (
                <View key={pkg.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                     {/* MODIFIED LINE BELOW */}
                    <Text style={styles.itemTitle}>{`${t('package', {defaultValue: "Package"})} ${index + 1}`}</Text>
                    {formData.lclPackages.length > 0 && (<TouchableOpacity onPress={() => removeLclPackage(index)} style={styles.removeButton}><Trash2 size={18} color={colors.error} /></TouchableOpacity>)}
                  </View>
                  {/* ... Dimension Inputs ... */}
                  <View style={styles.dimensionRow}><View style={styles.dimensionField}><Text style={styles.inputLabelSmall}>{t('lengthCm', {defaultValue: "Length (cm)"})}</Text><TextInput style={[styles.textInput, styles.smallInput]} value={pkg.length} onChangeText={text => handleLclPackageChange(index, 'length', text)} keyboardType="numeric" placeholder={t('eg120', {defaultValue: "e.g., 120"})} /></View><View style={styles.dimensionField}><Text style={styles.inputLabelSmall}>{t('widthCm', {defaultValue: "Width (cm)"})}</Text><TextInput style={[styles.textInput, styles.smallInput]} value={pkg.width} onChangeText={text => handleLclPackageChange(index, 'width', text)} keyboardType="numeric" placeholder={t('eg80', {defaultValue: "e.g., 80"})} /></View><View style={styles.dimensionField}><Text style={styles.inputLabelSmall}>{t('heightCm', {defaultValue: "Height (cm)"})}</Text><TextInput style={[styles.textInput, styles.smallInput]} value={pkg.height} onChangeText={text => handleLclPackageChange(index, 'height', text)} keyboardType="numeric" placeholder={t('eg100', {defaultValue: "e.g., 100"})} /></View></View>
                  <View style={styles.dimensionRow}><View style={styles.dimensionField}><Text style={styles.inputLabelSmall}>{t('weightKgPerItem', {defaultValue: "Weight (kg/item)"})}</Text><TextInput style={[styles.textInput, styles.smallInput]} value={pkg.weight} onChangeText={text => handleLclPackageChange(index, 'weight', text)} keyboardType="numeric" placeholder={t('eg50', {defaultValue: "e.g., 50"})} /></View><View style={styles.dimensionField}><Text style={styles.inputLabelSmall}>{t('pieces', {defaultValue: "Pieces"})}</Text><TextInput style={[styles.textInput, styles.smallInput]} value={pkg.pieces} onChangeText={text => handleLclPackageChange(index, 'pieces', text)} keyboardType="numeric" placeholder={t('eg1', {defaultValue: "e.g., 1"})} /></View></View>
                  {/* MODIFIED LINE BELOW */}
                  <Text style={styles.calculatedValue}>{`${t('volume', {defaultValue: "Volume"})}: ${pkg.volumeCBM || '0.000'} ${t('cbm', {defaultValue: "CBM"})}`}</Text>
                </View>
              ))}
              {formData.lclPackages.length < 10 && (<TouchableOpacity onPress={addLclPackage} style={styles.addButton}><Plus size={16} color={colors.white} /><Text style={styles.addButtonText}>{t('addPackage', {defaultValue: "Add Package"})}</Text></TouchableOpacity>)}
              {formData.lclPackages.length > 0 && (
                <View style={styles.totalsCard}>
                    {/* MODIFIED LINES BELOW */}
                    <Text style={styles.totalText}>{`${t('totalVolumeCBM', {defaultValue: "Total Volume (CBM)"})}: ${formData.totalLclVolumeCBM}`}</Text>
                    <Text style={styles.totalText}>{`${t('totalGrossWeightKg', {defaultValue: "Total Gross Weight (kg)"})}: ${formData.totalLclGrossWeight}`}</Text>
                </View>
              )}
            </View> 
          )}
        </View>
      )
    },
    // ... (Other steps' JSX remains the same as the previous full code response - they generally looked okay for Text wrappers)
    { title: t('routeInformation', {defaultValue: "Route Information"}), form: () => ( <View style={styles.formStep}><Text style={styles.sectionTitle}>{t(formData.shipmentType === 'import' ? 'originDetails' : 'destinationDetails', {defaultValue: formData.shipmentType === 'import' ? "Origin Details" : "Destination Details"})}</Text><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('originCountry', {defaultValue: "Origin Country"})}</Text><TextInput style={styles.textInput} value={formData.originCountry} onChangeText={text => handleInputChange('originCountry', text)} placeholder={t('enterOriginCountry', {defaultValue: "Enter origin country"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('originCity', {defaultValue: "Origin City"})}</Text><TextInput style={styles.textInput} value={formData.originCity} onChangeText={text => handleInputChange('originCity', text)} placeholder={t('enterOriginCity', {defaultValue: "Enter origin city"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('originPort', {defaultValue: "Origin Port/Airport"})}</Text><TextInput style={styles.textInput} value={formData.originPort} onChangeText={text => handleInputChange('originPort', text)} placeholder={t('enterOriginPort', {defaultValue: "Enter origin port/airport"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('pickupAddress', {defaultValue: "Pickup Address"})} <Text style={{ color: colors.textSecondary }}>({t('optional', {defaultValue: "Optional"})})</Text></Text><TextInput style={styles.textArea} value={formData.pickupAddress} onChangeText={text => handleInputChange('pickupAddress', text)} placeholder={t('enterPickupLocation', {defaultValue: "Enter full pickup address if door service"})} placeholderTextColor={colors.textSecondary} multiline /></View><Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t(formData.shipmentType === 'import' ? 'destinationDetails' : 'originDetails', {defaultValue: formData.shipmentType === 'import' ? "Destination Details" : "Origin Details"})}</Text><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('destinationCountry', {defaultValue: "Destination Country"})}</Text><TextInput style={styles.textInput} value={formData.destinationCountry} onChangeText={text => handleInputChange('destinationCountry', text)} placeholder={t('enterDestinationCountry', {defaultValue: "Enter destination country"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('destinationCity', {defaultValue: "Destination City"})}</Text><TextInput style={styles.textInput} value={formData.destinationCity} onChangeText={text => handleInputChange('destinationCity', text)} placeholder={t('enterDestinationCity', {defaultValue: "Enter destination city"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('destinationPort', {defaultValue: "Destination Port/Airport"})}</Text><TextInput style={styles.textInput} value={formData.destinationPort} onChangeText={text => handleInputChange('destinationPort', text)} placeholder={t('enterDestinationPort', {defaultValue: "Enter destination port/airport"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('deliveryAddress', {defaultValue: "Delivery Address"})} <Text style={{ color: colors.textSecondary }}>({t('optional', {defaultValue: "Optional"})})</Text></Text><TextInput style={styles.textArea} value={formData.deliveryAddress} onChangeText={text => handleInputChange('deliveryAddress', text)} placeholder={t('enterDeliveryAddress', {defaultValue: "Enter full delivery address if door service"})} placeholderTextColor={colors.textSecondary} multiline /></View></View> ) },
    { title: t('cargoDetails', {defaultValue: "Cargo Details"}), form: () => ( <View style={styles.formStep}><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('commodityDescription', {defaultValue: "Commodity Description"})}</Text><TextInput style={styles.textArea} value={formData.commodity} onChangeText={text => handleInputChange('commodity', text)} placeholder={t('enterCommodityDescription', {defaultValue: "e.g., Electronics, Textiles, Auto Parts"})} placeholderTextColor={colors.textSecondary} multiline /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('hsCode', {defaultValue: "HS Code"})} <Text style={{ color: colors.textSecondary }}>({t('optional', {defaultValue: "Optional"})})</Text></Text><TextInput style={styles.textInput} value={formData.hsCode} onChangeText={text => handleInputChange('hsCode', text)} placeholder={t('enterHsCode', {defaultValue: "Enter HS code if known"})} placeholderTextColor={colors.textSecondary} /></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('packingList', {defaultValue: "Packing List / Invoice"})} <Text style={{ color: colors.textSecondary }}>({t('optional', {defaultValue: "Optional"})})</Text></Text><TouchableOpacity style={styles.documentButton} onPress={pickDocument}><File size={20} color={colors.primary} /><Text style={styles.documentButtonText} numberOfLines={1} ellipsizeMode="middle">{formData.packingList ? formData.packingList.split('/').pop() : t('uploadPackingList', {defaultValue: "Upload Packing List/Invoice"})}</Text>{formData.packingList && (<TouchableOpacity onPress={() => handleInputChange('packingList', null)} style={{ padding: 4 }}><Trash2 size={18} color={colors.error} /></TouchableOpacity>)}</TouchableOpacity></View>{formData.containerType === 'fcl' && (<View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('totalCargoWeightFcl', {defaultValue: "Total Cargo Weight (kg) - FCL"})}</Text><TextInput style={styles.textInput} value={formData.weight || ''} onChangeText={text => handleInputChange('weight', text)} placeholder={t('enterTotalFclWeight', {defaultValue: "e.g., 20000"})} keyboardType="numeric" placeholderTextColor={colors.textSecondary} /></View>)}<View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('cargoReadyDate', {defaultValue: "Cargo Ready Date"})}</Text><TextInput style={styles.textInput} value={formData.cargoReady} onChangeText={text => handleInputChange('cargoReady', text)} placeholder={t('enterCargoReadyDate', {defaultValue: "DD/MM/YYYY"})} placeholderTextColor={colors.textSecondary} /></View></View> ) },
    { title: t('additionalServices', {defaultValue: "Additional Services"}), form: () => ( <View style={styles.formStep}><Text style={styles.sectionTitle}>{t('incoterms', {defaultValue: "Incoterms"})}</Text><DropDownPicker<string> open={incotermsOpen} value={formData.incoterms} items={incotermsOptions} setOpen={setIncotermsOpen} setValue={(val) => handleInputChange('incoterms', typeof val === 'function' ? val(formData.incoterms) : (val || ''))} style={styles.dropdown} dropDownContainerStyle={styles.dropdownContainer} textStyle={styles.dropdownText} zIndex={3000} listMode="SCROLLVIEW" /><View style={styles.optionsContainer}><TouchableOpacity style={styles.optionItem} onPress={() => handleInputChange('insurance', !formData.insurance)}><View style={[styles.checkbox, { backgroundColor: formData.insurance ? colors.primary : colors.backgroundSecondary, borderColor: formData.insurance ? colors.primary : colors.border }]}>{formData.insurance && <Check size={14} color={colors.white} />}</View><Text style={styles.optionText}>{t('requireInsurance', {defaultValue: "Cargo Insurance Required"})}</Text></TouchableOpacity><TouchableOpacity style={styles.optionItem} onPress={() => handleInputChange('clearance', !formData.clearance)}><View style={[styles.checkbox, { backgroundColor: formData.clearance ? colors.primary : colors.backgroundSecondary, borderColor: formData.clearance ? colors.primary : colors.border }]}>{formData.clearance && <Check size={14} color={colors.white} />}</View><Text style={styles.optionText}>{t('requireClearance', {defaultValue: "Customs Clearance Required"})}</Text></TouchableOpacity></View><View style={styles.inputGroup}><Text style={styles.inputLabel}>{t('additionalNotes', {defaultValue: "Additional Notes"})} <Text style={{ color: colors.textSecondary }}>({t('optional', {defaultValue: "Optional"})})</Text></Text><TextInput style={styles.textArea} value={formData.notes} onChangeText={text => handleInputChange('notes', text)} placeholder={t('enterAdditionalNotes', {defaultValue: "Any special instructions or details..."})} placeholderTextColor={colors.textSecondary} multiline /></View></View> ) }
    ];
    currentStepsLength.current = stepData.length;
    return stepData;
  }, [ t, styles, colors, formData, shipmentTypeOpen, containerTypeOpen, fclContainerSizeOpenStates, incotermsOpen, shipmentTypes, containerTypes, containerSizes, incotermsOptions, handleInputChange, addFclContainer, removeFclContainer, toggleFclContainerSizeOpen, handleFclContainerChange, addLclPackage, removeLclPackage, handleLclPackageChange, pickDocument ]);

  const anyDropdownOpen = useMemo(() => shipmentTypeOpen || containerTypeOpen || fclContainerSizeOpenStates.some(open => open) || incotermsOpen,
    [shipmentTypeOpen, containerTypeOpen, fclContainerSizeOpenStates, incotermsOpen]);

  return (
    <View style={styles.container}>
      <Header title={t('seaFreightQuote', {defaultValue: "Sea Freight Quote"})} showBackButton={true} />
      <FormStepper steps={steps.map(step => step.title)} currentStep={activeStep} colors={colors} />
      <ScrollView
        style={styles.scrollView} contentContainerStyle={styles.content}
        nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" scrollEnabled={!anyDropdownOpen}
      >
        {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />}
        {!loading && (
          <MultiForm
            forms={steps.map(step => step.form())} activeForm={activeStep}
            onNext={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            onPrevious={handleBack} isLastStep={activeStep === steps.length - 1}
            colors={colors} t={t}
            submitButtonText={t('proceedToShareOptions', {defaultValue: "Proceed to Share Options"})}
          />
        )}
        {!loading && (<TouchableOpacity style={styles.cancelButton} onPress={handleCancelExit}><Text style={styles.cancelButtonText}>{t('cancelAndExit', {defaultValue: "Cancel and Exit"})}</Text></TouchableOpacity>)}
      </ScrollView>
    </View>
  );
}
// --- END OF FILE app/quote/sea.tsx (Full Corrected Code with Explicit DocumentPicker Type Cast and Text Fix) ---
