export interface KeywordConquestCluster {
  id: string;
  name: string;
  role: 'primary' | 'affiliate-extension';
  calculatorHref: string;
  quickSearchLabel: string;
  primaryThaiQueries: string[];
  englishQueries: string[];
  longTailPatterns: string[];
  gscSignal: string;
  nextAction: string;
}

export const PRIMARY_TRAFFIC_CLUSTERS: KeywordConquestCluster[] = [
  {
    id: 'electricity',
    name: 'ค่าไฟฟ้า',
    role: 'primary',
    calculatorHref: '/คำนวณค่าไฟฟ้า/',
    quickSearchLabel: 'ค่าไฟ',
    primaryThaiQueries: [
      '1 kWh เท่ากับกี่บาท 2569',
      'ค่าไฟห้องเช่า หน่วยละกี่บาท 2569',
      'คำนวณค่าไฟ PEA',
      'บ้านใช้ไฟ 300 หน่วย ค่าไฟเท่าไร',
      'บ้านใช้ไฟ 500 หน่วย ค่าไฟเท่าไร',
    ],
    englishQueries: ['electricity bill calculator thailand', 'thai electricity bill calculator'],
    longTailPatterns: ['สูตรคำนวณ', 'กี่บาท', 'หน่วยละ', 'PEA', 'MEA', 'ค่า Ft'],
    gscSignal: 'strongest current visible cluster; near page-one query positions in GSC',
    nextAction: 'Keep the flagship calculator and exact-answer articles tightly linked.',
  },
  {
    id: 'vat',
    name: 'VAT 7%',
    role: 'primary',
    calculatorHref: '/คำนวณภาษีมูลค่าเพิ่ม/',
    quickSearchLabel: 'VAT 7%',
    primaryThaiQueries: ['ภาษี7%', 'วิธีคิด vat 7%', 'คิด vat', '10000/1.07'],
    englishQueries: ['thailand vat calculator', 'vat calculator thailand'],
    longTailPatterns: ['วิธีคิด', 'ถอด VAT', 'รวม VAT', 'หาร 1.07', '1000 บวก VAT', '1070 หาร 1.07'],
    gscSignal: '24-hour GSC test impressions but zero clicks',
    nextAction: 'Upgrade the VAT calculator and exact-number VAT articles next.',
  },
  {
    id: 'overtime',
    name: 'โอที',
    role: 'primary',
    calculatorHref: '/คำนวณค่าโอที/',
    quickSearchLabel: 'โอที',
    primaryThaiQueries: ['วิธีคิดโอที', 'โอที 1.5 คือ', 'โอที 1.5 เท่า คิดยังไง'],
    englishQueries: ['overtime calculator thailand'],
    longTailPatterns: ['วิธีคิด', '1.5 เท่า', '2 เท่า', '3 เท่า', 'เงินเดือน'],
    gscSignal: 'low-volume but relevant 24-hour test impressions',
    nextAction: 'Add a stronger direct formula block and salary examples.',
  },
  {
    id: 'bmi',
    name: 'BMI',
    role: 'primary',
    calculatorHref: '/คำนวณ-bmi/',
    quickSearchLabel: 'BMI',
    primaryThaiQueries: ['คำนวณ bmi สูตร', 'การหาดัชนีมวลกาย', 'สูตร BMI'],
    englishQueries: ['bmi calculator thailand'],
    longTailPatterns: ['สูตร', 'ค่าดัชนีมวลกาย', 'น้ำหนัก', 'ส่วนสูง'],
    gscSignal: 'visible impressions with no clicks',
    nextAction: 'Rewrite SERP copy and add the formula above the fold.',
  },
  {
    id: 'age',
    name: 'อายุ',
    role: 'primary',
    calculatorHref: '/คำนวณอายุ/',
    quickSearchLabel: 'อายุ',
    primaryThaiQueries: ['คำนวณอายุ', 'คำนวณอายุวันนี้', 'อายุเท่าไร'],
    englishQueries: ['age calculator thailand'],
    longTailPatterns: ['วันนี้', 'จากวันเกิด', 'พ.ศ.', 'ค.ศ.', 'ปี เดือน วัน'],
    gscSignal: 'high impressions but weak CTR',
    nextAction: 'Repair title/meta and first answer block after electricity/VAT.',
  },
];

export const AFFILIATE_EXTENSION_CLUSTERS: KeywordConquestCluster[] = [
  {
    id: 'car-loan',
    name: 'สินเชื่อรถ',
    role: 'affiliate-extension',
    calculatorHref: '/คำนวณผ่อนรถ/',
    quickSearchLabel: 'ผ่อนรถ',
    primaryThaiQueries: ['คำนวณผ่อนรถ', 'ดาวน์รถ 20% ผ่อนเท่าไร', 'รถ 700000 ผ่อน 5 ปี'],
    englishQueries: ['car loan calculator thailand'],
    longTailPatterns: ['ดาวน์', 'ดอกเบี้ย', '48 งวด', '60 งวด', 'ประกันรถ'],
    gscSignal: 'affiliate page with impressions but weak ranking',
    nextAction: 'Use car loan articles to push calculator and Roojai-related insurance paths.',
  },
  {
    id: 'home-loan',
    name: 'สินเชื่อบ้าน',
    role: 'affiliate-extension',
    calculatorHref: '/คำนวณผ่อนบ้าน/',
    quickSearchLabel: 'ผ่อนบ้าน',
    primaryThaiQueries: ['คำนวณผ่อนบ้าน', 'กู้บ้าน 2500000 ผ่อนเท่าไร', 'รีไฟแนนซ์บ้าน 2569'],
    englishQueries: ['home loan calculator thailand', 'mortgage calculator thailand'],
    longTailPatterns: ['ผ่อนเดือนละ', 'รีไฟแนนซ์', 'MLR', 'วงเงินกู้'],
    gscSignal: 'money page with affiliate upside but low current position',
    nextAction: 'Improve loan support articles and internal links after primary clusters.',
  },
];

export const EXACT_NUMBER_QUERY_ROUTES = [
  { query: '1000 บวก VAT 7% เป็นเท่าไร', href: '/บทความ/1000-บวก-vat-7-เป็นเท่าไร/' },
  { query: '1070 หาร 1.07 ถอด VAT', href: '/บทความ/1070-หาร-1-07-ถอด-vat/' },
  { query: '10000/1.07', href: '/บทความ/10000-หาร-1-07-ถอด-vat/' },
  { query: 'ถอด VAT จากราคารวม สูตร 1.07', href: '/บทความ/ถอด-vat-จากราคารวม-สูตร-1-07/' },
  { query: 'บ้านใช้ไฟ 300 หน่วย ค่าไฟเท่าไร', href: '/บทความ/บ้านใช้ไฟ-300-หน่วย-ค่าไฟเท่าไร/' },
  { query: 'บ้านใช้ไฟ 500 หน่วย ค่าไฟเท่าไร', href: '/บทความ/บ้านใช้ไฟ-500-หน่วย-ค่าไฟเท่าไร-2569/' },
  { query: '1 kWh เท่ากับกี่บาท 2569', href: '/บทความ/1-kwh-เท่ากับกี่บาท-2569/' },
];

export const DAILY_SEO_REVIEW_CHECKS = [
  '24-hour impressions by query',
  '28-day page visibility by URL',
  'CTR gap for pages with impressions',
  'new sitemap URLs with no GSC visibility',
  'top exact-match queries requiring support content',
];
