// Shared calculator data model — single source of truth for homepage, category pages, search, and sitemap.

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  slug: string;
  color: string;       // Tailwind bg class for the icon circle
  colorText: string;   // Tailwind text class
  description: string; // Thai meta description for category page
  sortOrder: number;   // Display order in category grid (1-based)
}

export interface Calculator {
  title: string;
  desc: string;
  href: string;
  icon: string;
  categoryId: string;          // Primary category for navigation
  secondaryCategories?: string[]; // Additional category IDs for search/filtering
  tag?: string;
  tagColor?: string;
  popular?: boolean;
}

export const categories: Category[] = [
  {
    id: 'tax',
    name: 'ภาษี',
    nameEn: 'Tax',
    icon: '💰',
    slug: 'ภาษี',
    color: 'bg-amber-100',
    colorText: 'text-amber-700',
    description: 'รวมเครื่องคำนวณภาษีออนไลน์: ภาษีเงินได้บุคคลธรรมดา VAT ภาษีที่ดิน ภาษีรถยนต์ อัปเดตปี 2569',
    sortOrder: 1,
  },
  {
    id: 'loan',
    name: 'สินเชื่อ/ผ่อน',
    nameEn: 'Loans',
    icon: '🏦',
    slug: 'สินเชื่อ',
    color: 'bg-blue-100',
    colorText: 'text-blue-700',
    description: 'คำนวณค่างวดสินเชื่อบ้าน รถ ส่วนบุคคล ดอกเบี้ยเงินฝาก พร้อมตารางผ่อนชำระ',
    sortOrder: 2,
  },
  {
    id: 'bills',
    name: 'ค่าใช้จ่าย',
    nameEn: 'Bills',
    icon: '⚡',
    slug: 'ค่าใช้จ่าย',
    color: 'bg-yellow-100',
    colorText: 'text-yellow-700',
    description: 'คำนวณค่าไฟฟ้า ค่าน้ำประปา ค่าส่งพัสดุ ค่าทำพาสปอร์ต ตามอัตราจริงปี 2569',
    sortOrder: 3,
  },
  {
    id: 'salary',
    name: 'เงินเดือน/แรงงาน',
    nameEn: 'Salary',
    icon: '👷',
    slug: 'เงินเดือน',
    color: 'bg-green-100',
    colorText: 'text-green-700',
    description: 'คำนวณเงินเดือนสุทธิ ค่าแรงขั้นต่ำ ค่าโอที ประกันสังคม ตามกฎหมายแรงงานปี 2569',
    sortOrder: 4,
  },
  {
    id: 'realestate',
    name: 'อสังหาฯ',
    nameEn: 'Real Estate',
    icon: '🏠',
    slug: 'อสังหา',
    color: 'bg-rose-100',
    colorText: 'text-rose-700',
    description: 'คำนวณค่าธรรมเนียมโอนบ้าน ภาษีที่ดิน ผ่อนบ้าน สำหรับการซื้อขายอสังหาริมทรัพย์',
    sortOrder: 5,
  },
  {
    id: 'health',
    name: 'สุขภาพ/ชีวิต',
    nameEn: 'Health',
    icon: '❤️',
    slug: 'สุขภาพ',
    color: 'bg-pink-100',
    colorText: 'text-pink-700',
    description: 'คำนวณ BMI อายุ วันกำหนดคลอด เงินเกษียณ เครื่องมือดูแลสุขภาพและชีวิต',
    sortOrder: 6,
  },
  {
    id: 'creditcard',
    name: 'บัตรเครดิต',
    nameEn: 'Credit Cards',
    icon: '💳',
    slug: 'บัตรเครดิต',
    color: 'bg-purple-100',
    colorText: 'text-purple-700',
    description: 'คำนวณดอกเบี้ยบัตรเครดิต ค่างวดบัตรเครดิต ยอดชำระขั้นต่ำ พร้อมตารางผ่อน',
    sortOrder: 7,
  },
  {
    id: 'convert',
    name: 'แปลง/ทั่วไป',
    nameEn: 'Convert',
    icon: '📐',
    slug: 'แปลง',
    color: 'bg-teal-100',
    colorText: 'text-teal-700',
    description: 'แปลงหน่วยวัด คำนวณเปอร์เซ็นต์ แปลงอัตราแลกเปลี่ยน เครื่องมือคำนวณทั่วไป',
    sortOrder: 8,
  },
];

export const calculators: Calculator[] = [
  // ── Tax ──
  {
    title: 'คำนวณภาษีเงินได้',
    desc: 'คำนวณภาษีเงินได้บุคคลธรรมดาตามขั้นบันได พร้อมค่าลดหย่อน',
    href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
    icon: '💰',
    categoryId: 'tax',
    tag: 'ยอดนิยม',
    tagColor: 'bg-red-50 text-red-600',
    popular: true,
  },
  {
    title: 'คำนวณ VAT 7%',
    desc: 'บวก VAT หรือแยก VAT จากราคารวม รองรับหลายรายการ',
    href: '/คำนวณภาษีมูลค่าเพิ่ม/',
    icon: '🧾',
    categoryId: 'tax',
    tag: 'สำหรับธุรกิจ',
    tagColor: 'bg-blue-50 text-blue-600',
    popular: true,
  },
  {
    title: 'คำนวณภาษีที่ดิน',
    desc: 'คำนวณภาษีที่ดินแบบขั้นมูลค่า แยกที่อยู่อาศัย เกษตร พาณิชย์',
    href: '/คำนวณภาษีที่ดิน/',
    icon: '🏛️',
    categoryId: 'tax',
    secondaryCategories: ['realestate'],
  },
  {
    title: 'คำนวณค่าภาษีรถยนต์',
    desc: 'ภาษีรถประจำปี + พ.ร.บ. รถเก๋ง กระบะ มอเตอร์ไซค์ พร้อมส่วนลดอายุรถ',
    href: '/คำนวณค่าภาษีรถยนต์/',
    icon: '🚘',
    categoryId: 'tax',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณภาษีธุรกิจเฉพาะ',
    desc: 'ภาษี SBT 3.3% สำหรับขายอสังหาริมทรัพย์ภายใน 5 ปี คำนวณจากราคาขายหรือราคาประเมิน',
    href: '/คำนวณภาษีธุรกิจเฉพาะ/',
    icon: '🏠',
    categoryId: 'tax',
    secondaryCategories: ['realestate'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณอากรแสตมป์',
    desc: 'อากรแสตมป์สัญญาเช่า สัญญากู้ ใบหุ้น ตามประมวลรัษฎากร',
    href: '/คำนวณอากรแสตมป์/',
    icon: '📋',
    categoryId: 'tax',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณภาษีสรรพสามิต',
    desc: 'ประมาณการภาษีสรรพสามิตสุรา บุหรี่ น้ำมัน รถยนต์ เครื่องดื่มน้ำตาล',
    href: '/คำนวณภาษีสรรพสามิต/',
    icon: '🍺',
    categoryId: 'tax',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณภาษีนำเข้า + VAT',
    desc: 'อากรศุลกากร + VAT 7% จากมูลค่า CIF สินค้านำเข้า แสดงต้นทุนรวม',
    href: '/คำนวณภาษีนำเข้า/',
    icon: '📦',
    categoryId: 'tax',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณ CIF อากรศุลกากร',
    desc: 'คำนวณมูลค่า CIF (Cost + Insurance + Freight) ฐานภาษีนำเข้า',
    href: '/คำนวณ-cif-อากรศุลกากร/',
    icon: '🚢',
    categoryId: 'tax',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าจดทะเบียนธุรกิจ',
    desc: 'ค่าธรรมเนียมจดทะเบียนบริษัทจำกัด ห้างหุ้นส่วนจำกัด ตามทุนจดทะเบียน (DBD)',
    href: '/คำนวณค่าจดทะเบียนธุรกิจ/',
    icon: '🏢',
    categoryId: 'tax',
    secondaryCategories: ['convert'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่ารับรองเอกสาร',
    desc: 'ค่าธรรมเนียมนิติกรณ์ Apostille รับรองสำเนา กรมการกงสุล',
    href: '/คำนวณค่ารับรองเอกสาร/',
    icon: '📜',
    categoryId: 'tax',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณกำไรขาดทุน',
    desc: 'คำนวณกำไรขั้นต้น กำไรดำเนินงาน กำไรสุทธิ และอัตรากำไร สำหรับธุรกิจ SME',
    href: '/คำนวณกำไรขาดทุน/',
    icon: '📊',
    categoryId: 'tax',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Loans ──
  {
    title: 'คำนวณผ่อนกู้',
    desc: 'คำนวณค่างวดสินเชื่อบ้าน รถ ส่วนบุคคล พร้อมตารางผ่อน',
    href: '/คำนวณผ่อนกู้/',
    icon: '🏠',
    categoryId: 'loan',
    popular: true,
  },
  {
    title: 'คำนวณผ่อนบ้าน',
    desc: 'คำนวณค่างวดบ้านแบบลดต้นลดดอก เทียบแผนเดิมกับแผนรีไฟแนนซ์',
    href: '/คำนวณผ่อนบ้าน/',
    icon: '🏘️',
    categoryId: 'loan',
    secondaryCategories: ['realestate'],
  },
  {
    title: 'คำนวณผ่อนรถ',
    desc: 'คำนวณค่างวดรถยนต์ เงินดาวน์ ดอกเบี้ย flat rate พร้อมตารางผ่อน',
    href: '/คำนวณผ่อนรถ/',
    icon: '🚗',
    categoryId: 'loan',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณผ่อนมอเตอร์ไซค์',
    desc: 'คำนวณค่างวดมอเตอร์ไซค์ เงินดาวน์ ดอกเบี้ย flat rate พร้อมตารางผ่อน',
    href: '/คำนวณผ่อนมอเตอร์ไซค์/',
    icon: '🏍️',
    categoryId: 'loan',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณดอกเบี้ยเงินฝาก',
    desc: 'ดอกเบี้ยฝากประจำและออมทรัพย์ หักภาษี 15% แสดงผลตอบแทนสุทธิ',
    href: '/คำนวณดอกเบี้ยเงินฝาก/',
    icon: '🏦',
    categoryId: 'loan',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณผ่อนมือถือ',
    desc: 'คำนวณค่าผ่อนมือถือ เทียบ 0% ผ่อนค่ายมือถือ และบัตรเครดิต',
    href: '/คำนวณผ่อนมือถือ/',
    icon: '📱',
    categoryId: 'loan',
    secondaryCategories: ['creditcard'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Bills ──
  {
    title: 'คำนวณค่าไฟฟ้า',
    desc: 'คำนวณค่าไฟฐาน ค่า Ft ค่าบริการ และ VAT 7% สำหรับ MEA/PEA อัปเดตปี 2569',
    href: '/คำนวณค่าไฟฟ้า/',
    icon: '⚡',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
    popular: true,
  },
  {
    title: 'คำนวณค่าไฟโซลาร์เซลล์',
    desc: 'คำนวณเงินออมจากโซลาร์เซลล์ ระยะคืนทุน ROI และ CO₂ ที่ลดได้ สำหรับบ้านในไทย',
    href: '/คำนวณค่าไฟโซลาร์เซลล์/',
    icon: '☀️',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าน้ำ',
    desc: 'คำนวณค่าน้ำประปาตามขั้นบันได กปน./กปภ. พร้อม VAT',
    href: '/คำนวณค่าน้ำ/',
    icon: '💧',
    categoryId: 'bills',
  },
  {
    title: 'คำนวณค่าส่งพัสดุ',
    desc: 'เปรียบเทียบค่าส่ง ไปรษณีย์ไทย Kerry Flash J&T กรอกน้ำหนักและขนาด หาตัวเลือกถูกสุด',
    href: '/คำนวณค่าส่งพัสดุ/',
    icon: '📦',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าทำพาสปอร์ต',
    desc: 'ค่าธรรมเนียมทำพาสปอร์ตไทย ทั้งเล่มปกติและเล่มด่วน',
    href: '/คำนวณค่าทำพาสปอร์ต/',
    icon: '✈️',
    categoryId: 'bills',
  },
  {
    title: 'คำนวณค่าวีซ่า',
    desc: 'ค่าธรรมเนียมวีซ่าทุกประเทศ ท่องเที่ยว ธุรกิจ นักเรียน ทำงาน พร้อมค่าบริการศูนย์ยื่น',
    href: '/คำนวณค่าวีซ่า/',
    icon: '🛂',
    categoryId: 'bills',
    secondaryCategories: ['convert'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าทิป',
    desc: 'คำนวณค่าทิป เลือกเปอร์เซ็นต์ หารจำนวนคน ดูยอดรวมและยอดต่อคน',
    href: '/คำนวณค่าทิป/',
    icon: '🍽️',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าห้องพัก',
    desc: 'เปรียบเทียบค่าเช่ารายเดือน-รายวัน มัดจำ ค่าสาธารณูปโภค รวมค่าใช้จ่ายย้ายเข้า',
    href: '/คำนวณค่าห้องพัก/',
    icon: '🏢',
    categoryId: 'bills',
    secondaryCategories: ['realestate'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าธรรมเนียมศาล',
    desc: 'ค่าขึ้นศาลตามทุนทรัพย์ คดีแพ่ง อาญา แรงงาน ทั้งศาลชั้นต้น อุทธรณ์ ฎีกา',
    href: '/คำนวณค่าธรรมเนียมศาล/',
    icon: '⚖️',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าเลี้ยงดูบุตร',
    desc: 'ประเมินค่าอุปการะเลี้ยงดูบุตรตามแนวทางศาลไทย จากรายได้พ่อแม่และจำนวนบุตร',
    href: '/คำนวณค่าเลี้ยงดูบุตร/',
    icon: '👨‍👩‍👧',
    categoryId: 'bills',
    secondaryCategories: ['health'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าเช่าร้าน',
    desc: 'คำนวณค่าเช่าร้านค้า สำนักงาน ค่าส่วนกลาง ค่าที่จอดรถ ค่าเซ้ง รวมค่าใช้จ่ายทั้งหมด',
    href: '/คำนวณค่าเช่าร้าน/',
    icon: '🏪',
    categoryId: 'bills',
    secondaryCategories: ['realestate'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าปรับจราจร',
    desc: 'คำนวณค่าปรับจราจรตามประเภทความผิด พร้อมระบบตัดคะแนนใบขับขี่และกฎพักใช้ใบอนุญาต',
    href: '/คำนวณค่าปรับจราจร/',
    icon: '🚦',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าทางด่วน',
    desc: 'คำนวณค่าผ่านทางพิเศษ มอเตอร์เวย์ เปรียบเทียบเส้นทาง อัปเดตอัตราปี 2569',
    href: '/คำนวณค่าทางด่วน/',
    icon: '🛣️',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าขนส่งสินค้า',
    desc: 'เปรียบเทียบค่าขนส่ง รถบรรทุก รถไฟ เรือชายฝั่ง ตามน้ำหนัก ปริมาตร ระยะทาง สำหรับธุรกิจ',
    href: '/คำนวณค่าขนส่งสินค้า/',
    icon: '🚛',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าโทรศัพท์',
    desc: 'คำนวณค่าโทรศัพท์มือถือรายเดือน AIS TRUE DTAC ค่าโทรเกิน ค่าเน็ตเกิน SMS พร้อม VAT 7%',
    href: '/คำนวณค่าโทรศัพท์/',
    icon: '📱',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าอาหารต่อเดือน',
    desc: 'คำนวณค่าอาหารรายเดือน ทำเอง vs ซื้อนอกบ้าน ตามจำนวนคนและระดับราคา วางแผนงบครัวเรือน',
    href: '/คำนวณค่าอาหารต่อเดือน/',
    icon: '🍱',
    categoryId: 'bills',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าจ้างแม่บ้าน',
    desc: 'คำนวณค่าจ้างแม่บ้านทำความสะอาด รายวัน รายเดือน ตามขนาดบ้านและประเภทบริการ เปรียบเทียบจ้างประจำ vs รายครั้ง',
    href: '/คำนวณค่าจ้างแม่บ้าน/',
    icon: '🧹',
    categoryId: 'bills',
    secondaryCategories: ['salary'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าเลี้ยงสัตว์',
    desc: 'ประเมินค่าเลี้ยงสุนัขและแมวต่อเดือน ค่าอาหาร สัตวแพทย์ กรูมมิ่ง ราคาตลาดไทย 2569',
    href: '/คำนวณค่าเลี้ยงสัตว์/',
    icon: '🐾',
    categoryId: 'bills',
    secondaryCategories: ['health'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าแต่งหน้า',
    desc: 'คำนวณค่าแต่งหน้า ช่างเจ้าสาว งานอีเวนต์ แต่งหน้าทั่วไป เปรียบเทียบจ้างช่างกับแต่งเอง ราคาตลาดไทย 2569',
    href: '/คำนวณค่าแต่งหน้า/',
    icon: '💄',
    categoryId: 'bills',
    secondaryCategories: ['health'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Salary/Work ──
  {
    title: 'คำนวณเงินเดือนสุทธิ',
    desc: 'เงินเดือนหลังหักภาษีและประกันสังคม พร้อมรายละเอียดทุกรายการ',
    href: '/คำนวณเงินเดือนสุทธิ/',
    icon: '📊',
    categoryId: 'salary',
    tag: 'มนุษย์เงินเดือน',
    tagColor: 'bg-green-50 text-green-600',
    popular: true,
  },
  {
    title: 'คำนวณค่าแรงขั้นต่ำ',
    desc: 'ค่าแรงขั้นต่ำ 77 จังหวัด รายวัน รายเดือน พร้อมค่าโอที อัปเดตปี 2569',
    href: '/คำนวณค่าแรงขั้นต่ำ/',
    icon: '👷',
    categoryId: 'salary',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าโอที',
    desc: 'คำนวณ OT วันธรรมดา 1.5 เท่า ทำงานวันหยุด 2 เท่า และ OT วันหยุด 3 เท่า ตามกฎหมายแรงงานปี 2569',
    href: '/คำนวณค่าโอที/',
    icon: '⏱️',
    categoryId: 'salary',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าจ้างรายวัน',
    desc: 'แปลงเงินเดือนเป็นรายวัน หรือรายวันเป็นรายเดือน พร้อมค่าโอทีและหักประกันสังคม',
    href: '/คำนวณค่าจ้างรายวัน/',
    icon: '💼',
    categoryId: 'salary',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณประกันสังคม',
    desc: 'เงินสมทบประกันสังคม มาตรา 33 39 40 แสดงส่วนลูกจ้าง นายจ้าง รัฐบาล',
    href: '/คำนวณประกันสังคม/',
    icon: '🛡️',
    categoryId: 'salary',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าจ้างพนักงาน',
    desc: 'คำนวณต้นทุนรวมค่าจ้างพนักงาน เงินเดือน ประกันสังคม กองทุนสำรอง ประกันกลุ่ม สวัสดิการ สำหรับนายจ้าง',
    href: '/คำนวณค่าจ้างพนักงาน/',
    icon: '🏢',
    categoryId: 'salary',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Real Estate ──
  {
    title: 'คำนวณค่าคอนโด',
    desc: 'คำนวณค่าใช้จ่ายคอนโดรายเดือน ค่าผ่อน ส่วนกลาง เงินกองทุน ประกัน สาธารณูปโภค รวมทุกรายการ',
    href: '/คำนวณค่าคอนโด/',
    icon: '🏢',
    categoryId: 'realestate',
    secondaryCategories: ['bills', 'loan'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าเช่าคอนโด',
    desc: 'คำนวณผลตอบแทนค่าเช่าคอนโด Gross/Net Yield, Cash-on-Cash ROI กระแสเงินสด ระยะคืนทุน วิเคราะห์การลงทุน',
    href: '/คำนวณค่าเช่าคอนโด/',
    icon: '🏙️',
    categoryId: 'realestate',
    secondaryCategories: ['loan'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าตกแต่งบ้าน',
    desc: 'ประมาณค่าตกแต่งบ้านแต่ละห้อง เลือกสไตล์ วัสดุ พร้อมค่าเฟอร์นิเจอร์และค่าแรงช่างตามราคาตลาดไทย',
    href: '/คำนวณค่าตกแต่งบ้าน/',
    icon: '🏡',
    categoryId: 'realestate',
    tag: 'ใหม่',
    tagColor: 'bg-green-50 text-green-600',
  },
  {
    title: 'คำนวณค่าธรรมเนียมโอนบ้าน',
    desc: 'คำนวณค่าโอน ค่าจดจำนอง ภาษีธุรกิจเฉพาะ อากรแสตมป์ ในหน้าเดียว',
    href: '/คำนวณค่าธรรมเนียมโอนบ้าน/',
    icon: '🏠',
    categoryId: 'realestate',
    secondaryCategories: ['bills'],
    popular: true,
  },

  // ── Health/Life ──
  {
    title: 'คำนวณ BMI',
    desc: 'คำนวณดัชนีมวลกาย ใช้เกณฑ์ WHO Asia-Pacific สำหรับคนเอเชีย',
    href: '/คำนวณ-bmi/',
    icon: '⚖️',
    categoryId: 'health',
  },
  {
    title: 'คำนวณอายุ',
    desc: 'คำนวณอายุจากวันเกิด รองรับ พ.ศ. พร้อมราศีและ Generation',
    href: '/คำนวณอายุ/',
    icon: '🎂',
    categoryId: 'health',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณวันคลอด',
    desc: 'คำนวณวันกำหนดคลอดและอายุครรภ์ปัจจุบัน พร้อมไตรมาส',
    href: '/คำนวณวันคลอด/',
    icon: '👶',
    categoryId: 'health',
  },
  {
    title: 'คำนวณวันตกไข่',
    desc: 'คำนวณวันตกไข่และช่วงเวลาเจริญพันธุ์ วางแผนครอบครัว',
    href: '/คำนวณวันตกไข่/',
    icon: '🥚',
    categoryId: 'health',
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณเงินเกษียณ',
    desc: 'ประเมินเงินที่ต้องมี เงินสะสม ณ วันเกษียณ และช่องว่างเงินเกษียณ',
    href: '/คำนวณเงินเกษียณ/',
    icon: '🎯',
    categoryId: 'health',
  },

  // ── Credit Cards ──
  {
    title: 'คำนวณดอกเบี้ยบัตรเครดิต',
    desc: 'ดอกเบี้ยก่อนครบกำหนด ยอดคงค้างรอบถัดไป พร้อมยอดชำระขั้นต่ำ',
    href: '/คำนวณดอกเบี้ยบัตรเครดิต/',
    icon: '💳',
    categoryId: 'creditcard',
  },
  {
    title: 'คำนวณค่างวดบัตรเครดิต',
    desc: 'คำนวณค่างวดขั้นต่ำ ดอกเบี้ยรวม และยอดคงเหลือรอบถัดไป',
    href: '/คำนวณค่างวดบัตรเครดิต/',
    icon: '🧮',
    categoryId: 'creditcard',
  },

  // ── Insurance ──
  {
    title: 'คำนวณค่าประกันรถยนต์',
    desc: 'เปรียบเทียบเบี้ยประกันรถชั้น 1, 2+, 2, 3+, 3 ตามมูลค่ารถ กลุ่มรถ อายุรถ',
    href: '/คำนวณค่าประกันรถยนต์/',
    icon: '🚗',
    categoryId: 'bills',
    secondaryCategories: ['tax'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าคลอดบุตร',
    desc: 'ประเมินค่าคลอดบุตร คลอดธรรมชาติ vs ผ่าคลอด โรงพยาบาลรัฐ-เอกชน รวมสิทธิประกันสังคม',
    href: '/คำนวณค่าคลอดบุตร/',
    icon: '🤰',
    categoryId: 'health',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณเบี้ยประกันชีวิต',
    desc: 'เปรียบเทียบเบี้ยประกันชีวิต สะสมทรัพย์ ตลอดชีพ ชั่วระยะเวลา ตามอายุ เพศ ทุนประกัน',
    href: '/คำนวณประกันชีวิต/',
    icon: '🛡️',
    categoryId: 'health',
    secondaryCategories: ['loan'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Automotive ──
  {
    title: 'คำนวณค่าต่อทะเบียนรถ',
    desc: 'รวมค่าใช้จ่ายต่อทะเบียนรถประจำปี ภาษี พ.ร.บ. ตรวจสภาพ ค่าปรับล่าช้า ทุกประเภทรถ',
    href: '/คำนวณค่าต่อทะเบียนรถ/',
    icon: '📋',
    categoryId: 'bills',
    secondaryCategories: ['tax'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าซ่อมรถ',
    desc: 'ประเมินค่าซ่อมรถยนต์ ค่าอะไหล่+ค่าแรง เครื่องยนต์ เบรก แอร์ ตัวถังสี เทียบอู่กับศูนย์',
    href: '/คำนวณค่าซ่อมรถ/',
    icon: '🔧',
    categoryId: 'bills',
    secondaryCategories: ['convert'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Education ──
  {
    title: 'คำนวณค่าเรียนพิเศษ',
    desc: 'คำนวณค่าเรียนพิเศษรายเดือน ตัวต่อตัว เรียนกลุ่ม สถาบันกวดวิชา ตามวิชาและระดับชั้น ราคาตลาดไทย 2569',
    href: '/คำนวณค่าเรียนพิเศษ/',
    icon: '📚',
    categoryId: 'bills',
    secondaryCategories: ['health'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Business/Advertising ──
  {
    title: 'คำนวณค่าโฆษณา',
    desc: 'คำนวณค่าโฆษณา Facebook Google LINE CPC CPM คอนเวอร์ชัน ROAS ต้นทุนต่อลูกค้า วางแผนงบโฆษณา',
    href: '/คำนวณค่าโฆษณา/',
    icon: '📢',
    categoryId: 'bills',
    secondaryCategories: ['tax'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Banking ──
  {
    title: 'คำนวณค่าธรรมเนียมโอนเงิน',
    desc: 'เปรียบเทียบค่าโอนเงินทุกช่องทาง พร้อมเพย์ ATM เคาน์เตอร์ BAHTNET ดูช่องทางที่ถูกที่สุด',
    href: '/คำนวณค่าธรรมเนียมโอนเงิน/',
    icon: '🏧',
    categoryId: 'bills',
    secondaryCategories: ['loan'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },

  // ── Convert/General ──
  {
    title: 'คำนวณค่าปุ๋ย',
    desc: 'คำนวณปริมาณและค่าปุ๋ยตามชนิดพืช พื้นที่ ประเภทดิน พร้อมสูตร NPK',
    href: '/คำนวณค่าปุ๋ย/',
    icon: '🌾',
    categoryId: 'convert',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'แปลงหน่วย',
    desc: 'แปลงหน่วยวัด: ความยาว มวล อุณหภูมิ และพื้นที่ รวมหน่วยไทย',
    href: '/แปลงหน่วย/',
    icon: '📏',
    categoryId: 'convert',
  },
  {
    title: 'คำนวณเปอร์เซ็นต์',
    desc: 'คำนวณ X% ของจำนวน เปอร์เซ็นต์ของส่วนหนึ่ง และเปอร์เซ็นต์เพิ่ม/ลด',
    href: '/คำนวณเปอร์เซ็นต์/',
    icon: '📐',
    categoryId: 'convert',
  },
  {
    title: 'คำนวณอัตราแลกเปลี่ยน',
    desc: 'แปลงเงินสกุลต่างๆ อัตราย้อนกลับ และยอดสุทธิหลังหักสเปรด',
    href: '/คำนวณอัตราแลกเปลี่ยน/',
    icon: '💱',
    categoryId: 'convert',
  },
  {
    title: 'คำนวณค่าเดินทาง',
    desc: 'ประมาณงบเที่ยวต่างประเทศ ตั๋วเครื่องบิน ที่พัก อาหาร ขนส่ง ประกัน',
    href: '/คำนวณค่าเดินทาง/',
    icon: '✈️',
    categoryId: 'convert',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'คำนวณค่าจัดงานศพ',
    desc: 'ประมาณค่าใช้จ่ายจัดงานศพ สวดอภิธรรม ฌาปนกิจ อาหาร ของชำร่วย ตามระดับงานและภูมิภาค',
    href: '/คำนวณค่าจัดงานศพ/',
    icon: '🙏',
    categoryId: 'convert',
    secondaryCategories: ['bills'],
    tag: 'ใหม่',
    tagColor: 'bg-orange-50 text-orange-600',
  },
];

/** Look up a category by its slug (used in dynamic routes). */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Get all calculators belonging to a category. */
export function getCalculatorsByCategory(categoryId: string): Calculator[] {
  return calculators.filter((c) => c.categoryId === categoryId);
}

/** Count calculators per category. */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat.id] = 0;
  }
  for (const calc of calculators) {
    counts[calc.categoryId] = (counts[calc.categoryId] || 0) + 1;
  }
  return counts;
}

/** Get the popular calculators (for the ยอดนิยม row). */
export function getPopularCalculators(): Calculator[] {
  return calculators.filter((c) => c.popular);
}

/** Get calculators belonging to a category (primary or secondary — for search/filtering). */
export function getCalculatorsInCategory(categoryId: string): Calculator[] {
  return calculators.filter(
    (c) => c.categoryId === categoryId || c.secondaryCategories?.includes(categoryId),
  );
}

/** Get categories sorted by sortOrder. */
export function getCategoriesSorted(): Category[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}
