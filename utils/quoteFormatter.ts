// --- START OF FILE app/utils/quoteFormatter.ts (Full Code with Sea Freight FCL/LCL updates) ---

export interface QuoteData { // <--- ADDED 'export' HERE
  quoteType: string;
  shipmentType: string;
  containerType?: string; // Specific to Sea Freight

  // Sea FCL specific
  fclContainers?: Array<{ id: string; size: string; quantity: string; }>;

  // Sea LCL specific
  lclPackages?: Array<{ id: string; length: string; width: string; height: string; weight: string; pieces: string; volumeCBM: string; }>;
  totalLclVolumeCBM?: string;
  totalLclGrossWeight?: string;

  // Air Freight specific (remains from previous)
  packages?: Array<{ length: string; width: string; height: string; weight: string; pieces: string; volumetricWeight: string; }>;
  totalActualWeight?: string;   // Air
  totalVolumetricWeight?: string; // Air
  chargeableWeight?: string;    // Air

  packingList?: string | null;
  documents?: any | null; // Consider defining a more specific type for 'documents' if possible, similar to QuoteDocuments in share-options.tsx
  weight?: string; // Used for FCL total cargo weight, and generic for other quote types if not LCL/Air
  [key: string]: any; // Allows for other dynamic fields
}

// Helper function for Title Casing
export const toTitleCaseUtil = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Helper function for Formatting Display Values with Correct Casing
export const formatDisplayValue = (
  key: string,
  value: any,
  t: (key: string, options?: any) => string,
): string => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return t('notProvided') || "Not provided";
  }

  if (typeof value === 'boolean') {
    return value ? (t('yes') || 'Yes') : (t('no') || 'No');
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return t('none') || "None";
    if (key === 'equipmentNeeded') {
        return value.map(item => String(item)).map(itemStr => toTitleCaseUtil(itemStr)).join(', ');
    }
    // For other arrays that are not 'fclContainers', 'lclPackages', 'packages' (handled by main formatter)
    return value.map(item => String(item)).join(', ');
  }

  let displayStr = String(value);

  switch (key) {
    case 'incoterms':
      return displayStr.toUpperCase();
    case 'containerSize': // Used for FCL container items
    case 'containerType': // For the top-level FCL/LCL selection
      // For container sizes like '20ft_standard_dry', format them nicely
      if (displayStr.includes('_')) {
        return toTitleCaseUtil(displayStr.replace(/ft_/g, 'ft ')); // "20ft Standard Dry"
      }
      return displayStr.toUpperCase(); // FCL, LCL
    case 'shipmentType':
    case 'serviceType':
    case 'truckType':
    case 'packageType': // General package type, not LCL packages
    case 'priority':
    case 'cargoType':
    case 'shipmentMode':
    case 'importExportType':
    case 'declarationType':
    case 'requesterBusinessType':
    case 'requesterCountry':
    case 'status':
      return toTitleCaseUtil(displayStr);
    default:
      return displayStr; // For free text, numbers, etc.
  }
};

// Main function to format the entire quote data for messages
export const formatQuoteDataForMessage = (
  data: QuoteData,
  t: (key: string, options?: any) => string,
): string => {
  let formattedString = "";
  const originalToTitleCase = (str: string) => { // For generating default labels from keys
    const result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const keyLabels: { [key: string]: string | null } = {
    quoteType: t('quoteType') || "Quote Type",
    shipmentType: t('shipmentType') || "Shipment Type",
    containerType: t('containerType') || "Container Type", // Sea: FCL/LCL

    // Sea FCL specific - The key itself is used to trigger the loop
    fclContainers: t('fclContainers') || "FCL Containers",

    // Sea LCL specific - The key itself is used to trigger the loop
    lclPackages: t('lclPackages') || "LCL Packages/Pallets",
    totalLclVolumeCBM: t('totalLclVolumeCBM') || "Total LCL Volume (CBM)",
    totalLclGrossWeight: t('totalLclGrossWeight') || "Total LCL Gross Weight (kg)",

    // Air Freight specific - The key itself is used to trigger the loop
    packages: t('airFreightPackages') || "Air Freight Packages",
    totalActualWeight: t('totalActualWeight') || "Total Actual Weight (kg)",     // Air
    totalVolumetricWeight: t('totalVolumetricWeight') || "Total Volumetric Weight (kg)", // Air
    chargeableWeight: t('chargeableWeight') || "Chargeable Weight (kg)",        // Air

    // General fields that might apply to various quote types
    originCountry: t('originCountry') || "Origin Country",
    originCity: t('originCity') || "Origin City",
    originPort: t('originPort') || "Origin Port/Airport", // Generic for Sea/Air/Land
    originAirport: t('originAirport') || "Origin Airport",
    pickupAddress: t('pickupAddress') || "Pickup Address",
    destinationCountry: t('destinationCountry') || "Destination Country",
    destinationCity: t('destinationCity') || "Destination City",
    destinationPort: t('destinationPort') || "Destination Port/Airport", // Generic
    destinationAirport: t('destinationAirport') || "Destination Airport",
    deliveryAddress: t('deliveryAddress') || "Delivery Address",
    commodity: t('commodityDescription') || "Commodity",
    hsCode: t('hsCode') || "HS Code",
    // 'weight' label logic: show specific label for FCL, hide for LCL/Air (as they have totals), generic for others
    weight: data.quoteType === 'Sea Freight' && data.containerType === 'fcl'
            ? (t('totalFCLCargoWeight') || "Total FCL Cargo Weight (kg)")
            : (data.quoteType !== 'Sea Freight' && data.quoteType !== 'Air Freight' // Not LCL (totals used), Not Air (totals used)
                ? (t('grossWeight') || "Gross Weight (kg)")
                : null), // Hide for LCL and Air as they use specific totals
    cargoReady: t('cargoReadyDate') || "Cargo Ready Date",
    incoterms: t('incoterms') || "Incoterms",
    insurance: t('requireInsurance') || "Insurance Required",
    clearance: t('requireClearance') || "Customs Clearance Required",
    dutyExemption: t('dutyExemption') || "Duty Exemption",
    notes: t('additionalNotes') || "Additional Notes",
    value: t('value') || "Shipment Value (USD)",
    equipmentNeeded: t('equipmentNeeded') || "Equipment Needed", // Breakbulk/Project
    shipmentMode: t('shipmentMode') || "Shipment Mode",         // Land/Courier
    importExportType: t('importExportType') || "Import/Export Type", // Customs
    declarationType: t('declarationType') || "Declaration Type",   // Customs
    status: t('status') || "Status",
    createdAt: t('createdDate') || "Created Date",
    serviceType: t('serviceType') || "Service Type", // Air, Courier
    truckType: t('truckType') || "Truck Type",       // Land
    packageType: t('packageType') || "Package Type",   // Courier
    priority: t('priority') || "Priority",           // Courier


    // Fields to explicitly exclude from this generic loop if they are handled elsewhere or not needed
    packingList: null, documents: null, userId: null, sendMethod: null, userAppCountry: null, targetEmails: null, targetWhatsApp: null,
    // User details are typically handled in a separate user info block
    requesterName: null, requesterEmail: null, requesterPhone: null, requesterCompany: null, requesterBusinessType: null, requesterCountry: null,
  };

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const labelFromKeyLabels = keyLabels[key];

      // Skip keys explicitly set to null in keyLabels, UNLESS it's one of our special array keys
      if (labelFromKeyLabels === null && key !== 'fclContainers' && key !== 'lclPackages' && key !== 'packages') {
        continue;
      }

      // Use the label from keyLabels if available, otherwise generate one (for fields not in keyLabels but still in data)
      const displayLabel = labelFromKeyLabels || originalToTitleCase(key);
      let rawValue = data[key];

      // --- Handling for Sea FCL Containers ---
      if (key === 'fclContainers' && Array.isArray(rawValue) && rawValue.length > 0) {
        formattedString += `\n${displayLabel}:\n`;
        rawValue.forEach((container: any, index: number) => {
          formattedString += `  ${t('container') || 'Container'} ${index + 1}:\n`;
          formattedString += `    ${t('size') || 'Size'}: ${container.size ? formatDisplayValue('containerSize', container.size, t) : (t('notProvided') || 'N/A')}\n`;
          formattedString += `    ${t('quantity') || 'Quantity'}: ${container.quantity || (t('notProvided') || 'N/A')}\n`;
        });
        continue; // Handled, move to next key
      }

      // --- Handling for Sea LCL Packages ---
      if (key === 'lclPackages' && Array.isArray(rawValue) && rawValue.length > 0) {
        formattedString += `\n${displayLabel}:\n`;
        rawValue.forEach((pkg: any, index: number) => {
          formattedString += `  ${t('package') || 'Package'}/${t('pallet')||'Pallet'} ${index + 1}:\n`;
          formattedString += `    L: ${pkg.length || (t('notProvided') || 'N/A')} cm, W: ${pkg.width || (t('notProvided') || 'N/A')} cm, H: ${pkg.height || (t('notProvided') || 'N/A')} cm\n`;
          formattedString += `    ${t('weight') || 'Weight'}: ${pkg.weight || (t('notProvided') || 'N/A')} kg\n`;
          formattedString += `    ${t('pieces') || 'Pieces'}: ${pkg.pieces || (t('notProvided') || 'N/A')}\n`;
          formattedString += `    CBM: ${pkg.volumeCBM || (t('notProvided') || 'N/A')}\n`;
        });
        // Total LCL Volume and Weight are separate keys and will be picked up by the general loop if in keyLabels
        continue; // Handled, move to next key
      }

      // --- Handling for Air Freight Packages ---
      if (key === 'packages' && Array.isArray(rawValue) && rawValue.length > 0) {
        formattedString += `\n${displayLabel}:\n`;
        rawValue.forEach((pkg: any, index: number) => {
          formattedString += `  ${t('package') || 'Package'} ${index + 1}:\n`;
          formattedString += `    ${t('pieces') || 'Pieces'}: ${pkg.pieces || (t('notProvided') || 'N/A')}\n`;
          formattedString += `    L: ${pkg.length || (t('notProvided') || 'N/A')} cm, W: ${pkg.width || (t('notProvided') || 'N/A')} cm, H: ${pkg.height || (t('notProvided') || 'N/A')} cm\n`;
          formattedString += `    ${t('weight') || 'Weight'}: ${pkg.weight || (t('notProvided') || 'N/A')} kg\n`;
          formattedString += `    ${t('volumetricWeight') || 'Vol. Weight'}: ${pkg.volumetricWeight || (t('notProvided') || 'N/A')} kg\n`;
        });
        continue; // Handled, move to next key
      }

      // General value formatting for other keys
      let formattedValue;
      if (key === 'createdAt' && rawValue) {
        try {
          formattedValue = new Date(rawValue).toLocaleDateString() + " " + new Date(rawValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          formattedValue = String(rawValue); // fallback
        }
      } else {
        formattedValue = formatDisplayValue(key, rawValue, t);
      }

      // Only add the line if the formatted value isn't "Not provided" or "None"
      // AND if the key itself isn't one of our special array keys (which have already been processed)
      if (formattedValue !== (t('notProvided') || "Not provided") &&
          formattedValue !== (t('none') || "None") &&
          key !== 'fclContainers' && key !== 'lclPackages' && key !== 'packages') {
         formattedString += `${displayLabel}: ${formattedValue}\n`;
      }
    }
  }
  return formattedString.trim();
};
// --- END OF FILE app/utils/quoteFormatter.ts ---