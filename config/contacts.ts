// --- START OF FILE config/contacts.ts (Corrected DEFAULT primaryOffice) ---

export interface OfficeDetails {
  name?: string;
  address: string;
  tel?: string;
  fax?: string;
  email?: string;
  mapLink: string;
}

export interface CountryContactInfo {
  nameKey: string; 
  name: string; 
  flag: string;
  whatsapp: string;
  emails: string[];
  primaryOffice: OfficeDetails;
  otherOffices?: OfficeDetails[];
}

export const countryContacts: Record<string, CountryContactInfo> = {
  QA: {
    nameKey: 'countryQatar',
    name: 'Qatar',
    flag: '🇶🇦',
    whatsapp: '+97433706307',
    emails: ['essam.alkhayyat@compasslog.com', 'mohammed.shafeeq@compasslog.com'],
    primaryOffice: {
      address: '1st Floor, Office 103A, Al Nasr Twin Towers, Tower A, West Bay, Doha, Qatar, P.O.Box – 201585, Zone.West Bay 60 | Street .950 | Bld.24',
      tel: '+97444370336',
      email: 'essam.alkhayyat@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/rnH2WSx7F8Sr2koo6'
    }
  },
  AE: {
    nameKey: 'countryUAE',
    name: 'UAE',
    flag: '🇦🇪',
    whatsapp: '+971506089154',
    emails: ['info@compasslog.com'], 
    primaryOffice: {
      name: 'Corporate Office',
      address: 'CLI Middle East FZCO, P.O. Box 263647, Jebel Ali Free Zone South Dubai, UAE',
      tel: '+97148037400',
      email: 'info@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/UYy7zEtJpFQZ9Ak5A'
    },
    otherOffices: [
      {
        name: 'Dubai Office',
        address: 'Compass Sea & Air Cargo LLC, P.O. Box 385022, Warehouse No. 04, a Dubai Properties Establishment Property (Al Gargawi Warehouses), Umm Rammool Dubai, UAE',
        tel: '+97142993844',
        fax: '+97142993845',
        email: 'dxb@compasslog.com',
        mapLink: 'https://maps.app.goo.gl/b5eGhFZFmHhSJEzs6'
      },
      {
        name: 'Abu Dhabi Office',
        address: 'Compass Air & Sea Cargo LLC, P.O.Box 25200, Prestige Tower 17, Mohammad Bin Zayed City East 2, Abu Dhabi, UAE',
        tel: '+97124957000',
        fax: '+97125552400',
        email: 'auh@compasslog.com',
        mapLink: 'https://maps.app.goo.gl/38qFg8f4UYxSGLde9'
      },
      {
        name: 'Abu Dhabi Office 2 (Zayed Airport)',
        address: 'Compass Logistics International LLC, Executive Office No. 009, Business Center 01, Zayed International Airport, Abu Dhabi, UAE',
        tel: '+97124957000', 
        fax: '+97125552400', 
        email: 'auh@compasslog.com', 
        mapLink: 'https://maps.app.goo.gl/9C57RqCjBbvmncPR9'
      }
    ]
  },
  SA: {
    nameKey: 'countrySaudiArabia',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    whatsapp: '+966502939600',
    emails: ['jed@compasslog.com', 'dmm@compasslog.com', 'ruh@compasslog.com'],
    primaryOffice: {
      name: 'Jeddah Office',
      address: 'Compass Ocean Logistics LLC, Office 17-19, 5th Floor, Al Bashawri Building 8461, Al Madinah Al Munawarah Road, Al Faisaliya District 2, Jeddah 23442, KSA',
      tel: '+966126919702',
      email: 'jed@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/byk4RtNpCrMDqFAHA'
    },
    otherOffices: [
      {
        name: 'Dammam Office',
        address: 'Compass Ocean Logistics LLC, Office No. 106, Benali Building, Al Mazrouia Area, King Faisal Road, Dammam 32414, KSA',
        tel: '+966138321777',
        email: 'dmm@compasslog.com',
        mapLink: 'https://maps.app.goo.gl/QokRkXpuYKK5LjFr9'
      },
      {
        name: 'Riyadh Office',
        address: 'Compass Ocean Logistics LLC, Office No. 4B-5B, 6802 Al Muarrakh Bin Bishr Road, Al Rabwah District, 12815 Riyadh, KSA',
        tel: '+966114721771',
        email: 'ruh@compasslog.com',
        mapLink: 'https://maps.app.goo.gl/7okbEknzsHKQebwA8'
      }
    ]
  },
  BH: {
    nameKey: 'countryBahrain',
    name: 'Bahrain',
    flag: '🇧🇭',
    whatsapp: '+97337193385',
    emails: ['bah@compasslog.com'],
    primaryOffice: {
      address: 'Office No.1201, 9th Floor, Exhibition Tower, Building 614, Road 1011, Block 410, Sanabis, Kingdom of Bahrain',
      tel: '+97317369488',
      email: 'bah@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/jAfE65vi1RSu3KL89'
    }
  },
  KW: {
    nameKey: 'countryKuwait',
    name: 'Kuwait',
    flag: '🇰🇼',
    whatsapp: '+96594467873',
    emails: ['kwi@compasslog.com'],
    primaryOffice: {
      address: 'Office 14, 7th Floor, Dogha 2, Block 25, Building No.3, Farwaniya, Kuwait',
      tel: '+96524347538',
      fax: '+96524347549',
      email: 'kwi@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/ybDnJnecqHMTHzSy6'
    }
  },
  OM: {
    nameKey: 'countryOman',
    name: 'Oman',
    flag: '🇴🇲',
    whatsapp: '+96894212075',
    emails: ['mct@compasslog.com'],
    primaryOffice: {
      address: 'P.O. Box No.1996, Office No A 213, 2nd Floor, Al Assalah Towers, Street 3701, South Ghubrah, Muscat, Sultanate Of Oman',
      tel: '+96824626873',
      fax: '+96824509477',
      email: 'mct@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/jkUD1FCjMAAg8ZvH6'
    }
  },
  DEFAULT: {
    nameKey: 'countryQatar', 
    name: 'Qatar (Default)',
    flag: '🇶🇦',
    whatsapp: '+97433706307',
    emails: ['essam.alkhayyat@compasslog.com', 'mohammed.shafeeq@compasslog.com'],
    primaryOffice: { // <<<< CORRECTED THIS BLOCK
      address: '1st Floor, Office 103A, Al Nasr Twin Towers, Tower A, West Bay, Doha, Qatar, P.O.Box – 201585, Zone.West Bay 60 | Street .950 | Bld.24',
      tel: '+97444370336',
      email: 'essam.alkhayyat@compasslog.com',
      mapLink: 'https://maps.app.goo.gl/rnH2WSx7F8Sr2koo6'
    }
  }
};

export const getContactInfoForCountry = (countryCode?: string): CountryContactInfo => {
  const code = typeof countryCode === 'string' ? countryCode.toUpperCase() : 'DEFAULT';
  return countryContacts[code] || countryContacts.DEFAULT;
};

export const gccCountryOptionsForRegistration = [
  { value: 'QA', flag: countryContacts.QA.flag, nameKey: countryContacts.QA.nameKey, defaultName: countryContacts.QA.name },
  { value: 'SA', flag: countryContacts.SA.flag, nameKey: countryContacts.SA.nameKey, defaultName: countryContacts.SA.name },
  { value: 'AE', flag: countryContacts.AE.flag, nameKey: countryContacts.AE.nameKey, defaultName: countryContacts.AE.name },
  { value: 'OM', flag: countryContacts.OM.flag, nameKey: countryContacts.OM.nameKey, defaultName: countryContacts.OM.name },
  { value: 'BH', flag: countryContacts.BH.flag, nameKey: countryContacts.BH.nameKey, defaultName: countryContacts.BH.name },
  { value: 'KW', flag: countryContacts.KW.flag, nameKey: countryContacts.KW.nameKey, defaultName: countryContacts.KW.name },
];

// --- END OF FILE config/contacts.ts ---