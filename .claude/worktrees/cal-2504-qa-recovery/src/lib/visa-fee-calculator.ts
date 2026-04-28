/**
 * Thai Visa Fee Calculator
 * คำนวณค่าวีซ่าสำหรับคนไทยเดินทางต่างประเทศ
 *
 * Sources: Embassy/consulate websites, Thai MFA travel advisories
 * Updated: April 2026
 *
 * Covers popular destinations for Thai travelers with visa types,
 * processing times, and fee structures.
 */

export type VisaDestination =
  | 'japan'
  | 'south_korea'
  | 'china'
  | 'usa'
  | 'uk'
  | 'schengen'
  | 'australia'
  | 'canada'
  | 'new_zealand'
  | 'india';

export type VisaType = 'tourist' | 'transit' | 'business' | 'student' | 'work';

export type ProcessingSpeed = 'regular' | 'express';

export interface VisaFeeInput {
  destination: VisaDestination;
  visaType: VisaType;
  processingSpeed: ProcessingSpeed;
  numberOfApplicants: number;
}

export interface VisaFeeBreakdown {
  visaFee: number;           // base visa fee in THB
  serviceFee: number;        // VFS/TLS/embassy service fee
  expressSurcharge: number;  // express processing surcharge
  totalPerPerson: number;
  totalAll: number;
  numberOfApplicants: number;
  processingDays: string;
  currency: string;          // original fee currency
  originalFee: number;       // fee in original currency
  notes: string[];
  destination: VisaDestination;
  visaType: VisaType;
  processingSpeed: ProcessingSpeed;
  visaExempt: boolean;       // true if no visa needed
  visaOnArrival: boolean;    // true if VOA available
}

export interface DestinationInfo {
  id: VisaDestination;
  name: string;
  nameEn: string;
  icon: string;
  availableVisaTypes: VisaType[];
  visaExemptDays?: number;   // days allowed without visa
  visaOnArrivalDays?: number;
}

export const destinations: DestinationInfo[] = [
  {
    id: 'japan',
    name: 'ญี่ปุ่น',
    nameEn: 'Japan',
    icon: '🇯🇵',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
    visaExemptDays: 15,
  },
  {
    id: 'south_korea',
    name: 'เกาหลีใต้',
    nameEn: 'South Korea',
    icon: '🇰🇷',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
    visaExemptDays: 90,
  },
  {
    id: 'china',
    name: 'จีน',
    nameEn: 'China',
    icon: '🇨🇳',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
    visaExemptDays: 30,
  },
  {
    id: 'usa',
    name: 'สหรัฐอเมริกา',
    nameEn: 'USA',
    icon: '🇺🇸',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
  },
  {
    id: 'uk',
    name: 'สหราชอาณาจักร',
    nameEn: 'United Kingdom',
    icon: '🇬🇧',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
  },
  {
    id: 'schengen',
    name: 'เชงเกน (ยุโรป)',
    nameEn: 'Schengen (Europe)',
    icon: '🇪🇺',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student'],
  },
  {
    id: 'australia',
    name: 'ออสเตรเลีย',
    nameEn: 'Australia',
    icon: '🇦🇺',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
  },
  {
    id: 'canada',
    name: 'แคนาดา',
    nameEn: 'Canada',
    icon: '🇨🇦',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
  },
  {
    id: 'new_zealand',
    name: 'นิวซีแลนด์',
    nameEn: 'New Zealand',
    icon: '🇳🇿',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student', 'work'],
  },
  {
    id: 'india',
    name: 'อินเดีย',
    nameEn: 'India',
    icon: '🇮🇳',
    availableVisaTypes: ['tourist', 'transit', 'business', 'student'],
    visaOnArrivalDays: 15,
  },
];

export const visaTypeLabels: Record<VisaType, string> = {
  tourist: 'ท่องเที่ยว (Tourist)',
  transit: 'ทรานซิท (Transit)',
  business: 'ธุรกิจ (Business)',
  student: 'นักเรียน/นักศึกษา (Student)',
  work: 'ทำงาน (Work)',
};

interface FeeData {
  feeTHB: number;
  serviceFee: number;
  expressSurcharge: number;
  currency: string;
  originalFee: number;
  regularDays: string;
  expressDays: string;
  notes: string[];
}

// Fee data per destination + visa type (approximate THB, updated Apr 2026)
// Exchange rates used: 1 USD ≈ 34 THB, 1 EUR ≈ 37 THB, 1 GBP ≈ 43 THB, 1 AUD ≈ 22 THB, 1 CAD ≈ 25 THB, 1 NZD ≈ 20 THB
const feeTable: Record<VisaDestination, Partial<Record<VisaType, FeeData>>> = {
  japan: {
    tourist: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'JPY',
      originalFee: 0,
      regularDays: '5 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['วีซ่าท่องเที่ยวญี่ปุ่นไม่เสียค่าธรรมเนียม (ฟรี)', 'พำนักได้สูงสุด 15 วัน (กรณียกเว้นวีซ่า) หรือ 90 วัน (กรณีขอวีซ่า)'],
    },
    business: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'JPY',
      originalFee: 0,
      regularDays: '5 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['วีซ่าธุรกิจญี่ปุ่นไม่เสียค่าธรรมเนียม (ฟรี)'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'JPY',
      originalFee: 0,
      regularDays: '5 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['วีซ่าทรานซิทญี่ปุ่นไม่เสียค่าธรรมเนียม (ฟรี)'],
    },
    student: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'JPY',
      originalFee: 0,
      regularDays: '5 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['วีซ่านักเรียนญี่ปุ่นไม่เสียค่าธรรมเนียม (ฟรี)', 'ต้องมีหนังสือตอบรับจากสถานศึกษา (Certificate of Eligibility)'],
    },
    work: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'JPY',
      originalFee: 0,
      regularDays: '5 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['วีซ่าทำงานญี่ปุ่นไม่เสียค่าธรรมเนียม (ฟรี)', 'ต้องมี Certificate of Eligibility จากนายจ้างในญี่ปุ่น'],
    },
  },
  south_korea: {
    tourist: {
      feeTHB: 1360,
      serviceFee: 550,
      expressSurcharge: 680,
      currency: 'USD',
      originalFee: 40,
      regularDays: '5-7 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['คนไทยเข้าเกาหลีใต้โดยไม่ต้องขอวีซ่าได้สูงสุด 90 วัน', 'หากต้องการอยู่นานกว่า 90 วัน ต้องขอวีซ่า'],
    },
    business: {
      feeTHB: 2380,
      serviceFee: 550,
      expressSurcharge: 680,
      currency: 'USD',
      originalFee: 70,
      regularDays: '5-7 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['ต้องมีหนังสือเชิญจากบริษัทในเกาหลีใต้'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'USD',
      originalFee: 0,
      regularDays: '-',
      expressDays: '-',
      notes: ['ทรานซิทผ่านเกาหลีใต้ไม่ต้องขอวีซ่า'],
    },
    student: {
      feeTHB: 1700,
      serviceFee: 550,
      expressSurcharge: 680,
      currency: 'USD',
      originalFee: 50,
      regularDays: '7-10 วันทำการ',
      expressDays: '5 วันทำการ',
      notes: ['ต้องมีหนังสือตอบรับจากสถานศึกษาในเกาหลีใต้'],
    },
    work: {
      feeTHB: 3400,
      serviceFee: 550,
      expressSurcharge: 680,
      currency: 'USD',
      originalFee: 100,
      regularDays: '10-15 วันทำการ',
      expressDays: '7 วันทำการ',
      notes: ['ต้องมีสัญญาจ้างงานจากนายจ้างในเกาหลีใต้'],
    },
  },
  china: {
    tourist: {
      feeTHB: 1500,
      serviceFee: 800,
      expressSurcharge: 1200,
      currency: 'THB',
      originalFee: 1500,
      regularDays: '4-5 วันทำการ',
      expressDays: '2-3 วันทำการ',
      notes: ['คนไทยเข้าจีนโดยไม่ต้องขอวีซ่าได้สูงสุด 30 วัน (ถึง 31 ธ.ค. 2569)', 'หากต้องการอยู่นานกว่า 30 วัน ต้องขอวีซ่า'],
    },
    business: {
      feeTHB: 1500,
      serviceFee: 800,
      expressSurcharge: 1200,
      currency: 'THB',
      originalFee: 1500,
      regularDays: '4-5 วันทำการ',
      expressDays: '2-3 วันทำการ',
      notes: ['ต้องมีหนังสือเชิญจากบริษัท/หน่วยงานในจีน'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'THB',
      originalFee: 0,
      regularDays: '-',
      expressDays: '-',
      notes: ['ทรานซิท 24-144 ชม. ไม่ต้องขอวีซ่า (บางเมือง)'],
    },
    student: {
      feeTHB: 1500,
      serviceFee: 800,
      expressSurcharge: 1200,
      currency: 'THB',
      originalFee: 1500,
      regularDays: '5-7 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['ต้องมี JW201/JW202 จากสถานศึกษาในจีน'],
    },
    work: {
      feeTHB: 1500,
      serviceFee: 800,
      expressSurcharge: 1200,
      currency: 'THB',
      originalFee: 1500,
      regularDays: '5-7 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['ต้องมีใบอนุญาตทำงานจากจีน (Work Permit Notification Letter)'],
    },
  },
  usa: {
    tourist: {
      feeTHB: 5780,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'USD',
      originalFee: 185,
      regularDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      expressDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      notes: ['ค่าธรรมเนียมชำระก่อนนัดสัมภาษณ์ (ไม่คืนเงิน)', 'ต้องสัมภาษณ์ที่สถานทูตสหรัฐฯ กรุงเทพฯ', 'ไม่มีบริการด่วน — ระยะเวลาขึ้นอยู่กับคิวสัมภาษณ์'],
    },
    business: {
      feeTHB: 5780,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'USD',
      originalFee: 185,
      regularDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      expressDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      notes: ['B1/B2 visa — ค่าธรรมเนียมเท่าวีซ่าท่องเที่ยว', 'ต้องสัมภาษณ์ที่สถานทูตสหรัฐฯ'],
    },
    transit: {
      feeTHB: 5780,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'USD',
      originalFee: 185,
      regularDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      expressDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      notes: ['ต้องมีวีซ่าแม้ทรานซิทผ่านสหรัฐฯ (C visa)', 'ค่าธรรมเนียมเท่าวีซ่าท่องเที่ยว'],
    },
    student: {
      feeTHB: 6120,
      serviceFee: 12_240,
      expressSurcharge: 0,
      currency: 'USD',
      originalFee: 185,
      regularDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      expressDays: '3-5 วันทำการ (หลังสัมภาษณ์)',
      notes: ['ค่าธรรมเนียมวีซ่า F/M: $185 + ค่า SEVIS I-901: $350', 'serviceFee คือค่า SEVIS fee', 'ต้องมี I-20 จากสถานศึกษาในสหรัฐฯ'],
    },
    work: {
      feeTHB: 6800,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'USD',
      originalFee: 200,
      regularDays: '5-10 วันทำการ (หลังสัมภาษณ์)',
      expressDays: '5-10 วันทำการ (หลังสัมภาษณ์)',
      notes: ['H/L/O visa — ค่าธรรมเนียม $200 (อาจมี Fraud Prevention and Detection Fee เพิ่มเติม)', 'ต้องมี approved petition จากนายจ้างในสหรัฐฯ'],
    },
  },
  uk: {
    tourist: {
      feeTHB: 4300,
      serviceFee: 1000,
      expressSurcharge: 3500,
      currency: 'GBP',
      originalFee: 100,
      regularDays: '15 วันทำการ',
      expressDays: '5 วันทำการ',
      notes: ['Standard Visitor Visa อายุ 6 เดือน', 'ยื่นผ่าน VFS Global กรุงเทพฯ'],
    },
    business: {
      feeTHB: 4300,
      serviceFee: 1000,
      expressSurcharge: 3500,
      currency: 'GBP',
      originalFee: 100,
      regularDays: '15 วันทำการ',
      expressDays: '5 วันทำการ',
      notes: ['ใช้ Standard Visitor Visa เหมือนท่องเที่ยว'],
    },
    transit: {
      feeTHB: 2580,
      serviceFee: 1000,
      expressSurcharge: 2500,
      currency: 'GBP',
      originalFee: 60,
      regularDays: '15 วันทำการ',
      expressDays: '5 วันทำการ',
      notes: ['Direct Airside Transit Visa (DATV)', 'ต้องขอเฉพาะกรณีเปลี่ยนเครื่องในสหราชอาณาจักร'],
    },
    student: {
      feeTHB: 15480,
      serviceFee: 1500,
      expressSurcharge: 3500,
      currency: 'GBP',
      originalFee: 363,
      regularDays: '15 วันทำการ',
      expressDays: '5 วันทำการ',
      notes: ['Student Visa (Tier 4)', 'ต้องมี CAS จากสถานศึกษาในสหราชอาณาจักร', 'อาจมีค่า IHS (Immigration Health Surcharge) เพิ่มเติม'],
    },
    work: {
      feeTHB: 27520,
      serviceFee: 1500,
      expressSurcharge: 5000,
      currency: 'GBP',
      originalFee: 625,
      regularDays: '15 วันทำการ',
      expressDays: '5 วันทำการ',
      notes: ['Skilled Worker Visa', 'ต้องมี Certificate of Sponsorship จากนายจ้าง', 'อาจมีค่า IHS (Immigration Health Surcharge) เพิ่มเติม'],
    },
  },
  schengen: {
    tourist: {
      feeTHB: 2960,
      serviceFee: 1100,
      expressSurcharge: 1500,
      currency: 'EUR',
      originalFee: 80,
      regularDays: '10-15 วันทำการ',
      expressDays: '5-7 วันทำการ',
      notes: ['Schengen Short-Stay Visa (C)', 'ยื่นที่สถานทูต/ศูนย์รับวีซ่าของประเทศจุดหมายหลัก', 'พำนักได้สูงสุด 90 วันใน 180 วัน'],
    },
    business: {
      feeTHB: 2960,
      serviceFee: 1100,
      expressSurcharge: 1500,
      currency: 'EUR',
      originalFee: 80,
      regularDays: '10-15 วันทำการ',
      expressDays: '5-7 วันทำการ',
      notes: ['ค่าธรรมเนียมเท่าวีซ่าท่องเที่ยว', 'ต้องมีหนังสือเชิญจากบริษัทในยุโรป'],
    },
    transit: {
      feeTHB: 2960,
      serviceFee: 1100,
      expressSurcharge: 1500,
      currency: 'EUR',
      originalFee: 80,
      regularDays: '10-15 วันทำการ',
      expressDays: '5-7 วันทำการ',
      notes: ['Airport Transit Visa (ATV) — ต้องขอเฉพาะบางประเทศ'],
    },
    student: {
      feeTHB: 2960,
      serviceFee: 1100,
      expressSurcharge: 1500,
      currency: 'EUR',
      originalFee: 80,
      regularDays: '15-20 วันทำการ',
      expressDays: '10 วันทำการ',
      notes: ['วีซ่านักเรียนระยะสั้น (ไม่เกิน 90 วัน) ใช้ Schengen C visa', 'หากเกิน 90 วัน ต้องขอ National D visa ของประเทศนั้น'],
    },
  },
  australia: {
    tourist: {
      feeTHB: 5500,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'AUD',
      originalFee: 190,
      regularDays: '15-30 วันทำการ',
      expressDays: '15-30 วันทำการ',
      notes: ['Visitor Visa (subclass 600)', 'ยื่นออนไลน์ผ่าน ImmiAccount', 'ไม่มีบริการด่วน — ระยะเวลาขึ้นอยู่กับช่วงเวลา'],
    },
    business: {
      feeTHB: 5500,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'AUD',
      originalFee: 190,
      regularDays: '15-30 วันทำการ',
      expressDays: '15-30 วันทำการ',
      notes: ['ใช้ Visitor Visa (subclass 600) Business stream', 'ยื่นออนไลน์ผ่าน ImmiAccount'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'AUD',
      originalFee: 0,
      regularDays: '10-15 วันทำการ',
      expressDays: '10-15 วันทำการ',
      notes: ['Transit Visa (subclass 771) ไม่เสียค่าธรรมเนียม', 'พำนักได้สูงสุด 72 ชม.'],
    },
    student: {
      feeTHB: 14300,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'AUD',
      originalFee: 710,
      regularDays: '20-40 วันทำการ',
      expressDays: '20-40 วันทำการ',
      notes: ['Student Visa (subclass 500)', 'ต้องมี CoE จากสถานศึกษาในออสเตรเลีย', 'ต้องมีประกันสุขภาพ OSHC'],
    },
    work: {
      feeTHB: 7700,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'AUD',
      originalFee: 350,
      regularDays: '30-60 วันทำการ',
      expressDays: '30-60 วันทำการ',
      notes: ['Temporary Skill Shortage Visa (subclass 482)', 'ต้องมีนายจ้าง sponsor ในออสเตรเลีย', 'ค่าธรรมเนียมขึ้นอยู่กับ subclass'],
    },
  },
  canada: {
    tourist: {
      feeTHB: 2550,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'CAD',
      originalFee: 100,
      regularDays: '20-30 วันทำการ',
      expressDays: '20-30 วันทำการ',
      notes: ['Temporary Resident Visa (TRV)', 'ยื่นออนไลน์ + ส่ง biometrics ที่ VFS Global', 'ค่า biometrics CAD 85 รวมอยู่แล้ว', 'ไม่มีบริการด่วน'],
    },
    business: {
      feeTHB: 2550,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'CAD',
      originalFee: 100,
      regularDays: '20-30 วันทำการ',
      expressDays: '20-30 วันทำการ',
      notes: ['ใช้ TRV เหมือนวีซ่าท่องเที่ยว', 'ต้องมีหนังสือเชิญจากบริษัทในแคนาดา'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'CAD',
      originalFee: 0,
      regularDays: '-',
      expressDays: '-',
      notes: ['China/India Transit Program (CTP/ITP) อาจไม่ต้องขอวีซ่าทรานซิท', 'กรณีอื่นต้องขอ TRV ปกติ'],
    },
    student: {
      feeTHB: 3750,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'CAD',
      originalFee: 150,
      regularDays: '30-60 วันทำการ',
      expressDays: '30-60 วันทำการ',
      notes: ['Study Permit', 'ต้องมี Letter of Acceptance จากสถานศึกษาในแคนาดา', 'ค่า biometrics CAD 85 รวมอยู่แล้ว'],
    },
    work: {
      feeTHB: 3875,
      serviceFee: 900,
      expressSurcharge: 0,
      currency: 'CAD',
      originalFee: 155,
      regularDays: '30-60 วันทำการ',
      expressDays: '30-60 วันทำการ',
      notes: ['Work Permit', 'ต้องมี LMIA หรือ LMIA-exempt offer จากนายจ้างในแคนาดา'],
    },
  },
  new_zealand: {
    tourist: {
      feeTHB: 4400,
      serviceFee: 800,
      expressSurcharge: 0,
      currency: 'NZD',
      originalFee: 211,
      regularDays: '20-25 วันทำการ',
      expressDays: '20-25 วันทำการ',
      notes: ['Visitor Visa', 'ยื่นออนไลน์ผ่าน Immigration New Zealand', 'ไม่มีบริการด่วน'],
    },
    business: {
      feeTHB: 4400,
      serviceFee: 800,
      expressSurcharge: 0,
      currency: 'NZD',
      originalFee: 211,
      regularDays: '20-25 วันทำการ',
      expressDays: '20-25 วันทำการ',
      notes: ['ใช้ Visitor Visa เหมือนวีซ่าท่องเที่ยว'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'NZD',
      originalFee: 0,
      regularDays: '10 วันทำการ',
      expressDays: '10 วันทำการ',
      notes: ['Transit Visa ไม่เสียค่าธรรมเนียม', 'ต้องขอหากเปลี่ยนเครื่องในนิวซีแลนด์'],
    },
    student: {
      feeTHB: 5200,
      serviceFee: 800,
      expressSurcharge: 0,
      currency: 'NZD',
      originalFee: 295,
      regularDays: '25-35 วันทำการ',
      expressDays: '25-35 วันทำการ',
      notes: ['Student Visa', 'ต้องมี Offer of Place จากสถานศึกษาในนิวซีแลนด์'],
    },
    work: {
      feeTHB: 5200,
      serviceFee: 800,
      expressSurcharge: 0,
      currency: 'NZD',
      originalFee: 295,
      regularDays: '25-40 วันทำการ',
      expressDays: '25-40 วันทำการ',
      notes: ['Work Visa', 'ต้องมี job offer จากนายจ้างในนิวซีแลนด์'],
    },
  },
  india: {
    tourist: {
      feeTHB: 1500,
      serviceFee: 500,
      expressSurcharge: 800,
      currency: 'THB',
      originalFee: 1500,
      regularDays: '3-5 วันทำการ',
      expressDays: '1-2 วันทำการ',
      notes: ['e-Visa ยื่นออนไลน์ได้', 'พำนักได้สูงสุด 30 วัน (e-Tourist)', 'Visa on Arrival สำหรับคนไทย พำนัก 15 วัน'],
    },
    business: {
      feeTHB: 1500,
      serviceFee: 500,
      expressSurcharge: 800,
      currency: 'THB',
      originalFee: 1500,
      regularDays: '3-5 วันทำการ',
      expressDays: '1-2 วันทำการ',
      notes: ['e-Business Visa ยื่นออนไลน์ได้', 'ต้องมีหนังสือเชิญจากบริษัทในอินเดีย'],
    },
    transit: {
      feeTHB: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      currency: 'THB',
      originalFee: 0,
      regularDays: '-',
      expressDays: '-',
      notes: ['e-Transit Visa ยื่นออนไลน์', 'พำนักได้ไม่เกิน 72 ชม.'],
    },
    student: {
      feeTHB: 3000,
      serviceFee: 500,
      expressSurcharge: 800,
      currency: 'THB',
      originalFee: 3000,
      regularDays: '5-7 วันทำการ',
      expressDays: '3 วันทำการ',
      notes: ['Student Visa', 'ต้องมีหนังสือตอบรับจากสถานศึกษาในอินเดีย'],
    },
  },
};

export function calculateVisaFee(input: VisaFeeInput): VisaFeeBreakdown {
  const dest = destinations.find((d) => d.id === input.destination);
  const destFees = feeTable[input.destination];
  const fee = destFees?.[input.visaType];

  if (!fee || !dest) {
    return {
      visaFee: 0,
      serviceFee: 0,
      expressSurcharge: 0,
      totalPerPerson: 0,
      totalAll: 0,
      numberOfApplicants: input.numberOfApplicants,
      processingDays: '-',
      currency: 'THB',
      originalFee: 0,
      notes: ['ไม่พบข้อมูลค่าธรรมเนียมสำหรับวีซ่าประเภทนี้ กรุณาติดต่อสถานทูตโดยตรง'],
      destination: input.destination,
      visaType: input.visaType,
      processingSpeed: input.processingSpeed,
      visaExempt: false,
      visaOnArrival: false,
    };
  }

  const expressSurcharge = input.processingSpeed === 'express' ? fee.expressSurcharge : 0;
  const totalPerPerson = fee.feeTHB + fee.serviceFee + expressSurcharge;
  const totalAll = totalPerPerson * input.numberOfApplicants;
  const processingDays = input.processingSpeed === 'express' ? fee.expressDays : fee.regularDays;

  return {
    visaFee: fee.feeTHB,
    serviceFee: fee.serviceFee,
    expressSurcharge,
    totalPerPerson,
    totalAll,
    numberOfApplicants: input.numberOfApplicants,
    processingDays,
    currency: fee.currency,
    originalFee: fee.originalFee,
    notes: [...fee.notes],
    destination: input.destination,
    visaType: input.visaType,
    processingSpeed: input.processingSpeed,
    visaExempt: (dest.visaExemptDays ?? 0) > 0 && input.visaType === 'tourist',
    visaOnArrival: (dest.visaOnArrivalDays ?? 0) > 0 && input.visaType === 'tourist',
  };
}

export function getDestinationById(id: VisaDestination): DestinationInfo | undefined {
  return destinations.find((d) => d.id === id);
}
