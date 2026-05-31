type SourceLink = {
  label: string;
  href: string;
};

type RelatedLink = {
  label: string;
  href: string;
};

export type ExactArticleKind =
  | 'salary'
  | 'overtime'
  | 'bmi'
  | 'bmi-formula'
  | 'electricity-rate'
  | 'age'
  | 'percentage';

export type ExactAnswerArticle = {
  kind: ExactArticleKind;
  slug: string;
  title: string;
  cardTitle: string;
  description: string;
  category: string;
  publishDate: string;
  modifiedDate: string;
  calculatorHref: string;
  calculatorName: string;
  buttonLabel: string;
  answerLabel: string;
  quickAnswer: string;
  context: string;
  steps: string[];
  table: {
    headers: string[];
    rows: string[][];
  };
  faqData: Array<{ question: string; answer: string }>;
  sourceLinks: SourceLink[];
  relatedLinks: RelatedLink[];
  sourceVerifiedDate: string;
};

const publishDate = '2026-05-30';
const sourceVerifiedDate = '30 พฤษภาคม 2569';

const salarySources = [
  { label: 'กรมสรรพากร: ภาษีเงินได้บุคคลธรรมดา', href: 'https://www.rd.go.th/62292.html' },
  { label: 'สำนักงานประกันสังคม: เงินสมทบมาตรา 33', href: 'https://www.sso.go.th/' },
];

const laborSources = [
  { label: 'กระทรวงแรงงาน: กฎหมายคุ้มครองแรงงาน', href: 'https://www.mol.go.th/' },
];

const bmiSources = [
  { label: 'กรมควบคุมโรค กระทรวงสาธารณสุข: BMI', href: 'https://ddc.moph.go.th/' },
  { label: 'WHO Western Pacific: BMI guidance', href: 'https://www.who.int/westernpacific' },
];

const electricitySources = [
  { label: 'กกพ.: อัตราค่าไฟฟ้าโดยอัตโนมัติ (Ft)', href: 'https://www.erc.or.th/th/automatic' },
  { label: 'การไฟฟ้าส่วนภูมิภาค PEA: อัตราค่าไฟฟ้า', href: 'https://www.pea.co.th/' },
  { label: 'การไฟฟ้านครหลวง MEA: อัตราค่าไฟฟ้า', href: 'https://www.mea.or.th/' },
];

const TAX_BRACKETS = [
  { min: 0, max: 150_000, rate: 0 },
  { min: 150_000, max: 300_000, rate: 0.05 },
  { min: 300_000, max: 500_000, rate: 0.1 },
  { min: 500_000, max: 750_000, rate: 0.15 },
  { min: 750_000, max: 1_000_000, rate: 0.2 },
  { min: 1_000_000, max: 2_000_000, rate: 0.25 },
  { min: 2_000_000, max: 5_000_000, rate: 0.3 },
  { min: 5_000_000, max: Infinity, rate: 0.35 },
];

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatBaht(value: number, digits = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function calculateAnnualTax(taxableIncome: number): number {
  let remaining = Math.max(0, taxableIncome);
  let tax = 0;

  for (const bracket of TAX_BRACKETS) {
    const width = bracket.max === Infinity ? Infinity : bracket.max - bracket.min;
    const taxable = Math.min(remaining, width);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  return round(tax);
}

function calculateSalary(grossMonthly: number) {
  const socialSecurityMonthly = Math.min(grossMonthly * 0.05, 750);
  const socialSecurityAnnual = socialSecurityMonthly * 12;
  const annualGross = grossMonthly * 12;
  const expenseDeduction = Math.min(annualGross * 0.5, 100_000);
  const allowances = 60_000 + Math.min(socialSecurityAnnual, 9_000);
  const taxableIncome = Math.max(0, annualGross - expenseDeduction - allowances);
  const annualTax = calculateAnnualTax(taxableIncome);
  const monthlyTax = round(annualTax / 12);
  const netMonthly = round(grossMonthly - socialSecurityMonthly - monthlyTax);

  return {
    grossMonthly,
    annualGross,
    socialSecurityMonthly,
    socialSecurityAnnual,
    expenseDeduction,
    allowances,
    taxableIncome,
    annualTax,
    monthlyTax,
    netMonthly,
  };
}

function salaryArticle(input: {
  slug: string;
  grossMonthly: number;
  mode: 'net' | 'tax';
  cardTitle: string;
  description: string;
}): ExactAnswerArticle {
  const r = calculateSalary(input.grossMonthly);
  const gross = formatBaht(input.grossMonthly, 0);
  const tax = formatBaht(r.monthlyTax);
  const net = formatBaht(r.netMonthly);
  const sso = formatBaht(r.socialSecurityMonthly);
  const annualTax = formatBaht(r.annualTax);
  const taxable = formatBaht(r.taxableIncome, 0);
  const isTax = input.mode === 'tax';
  const answer = isTax
    ? `เงินเดือน ${gross} บาท กรณีพนักงานประจำโสด ใช้ค่าลดหย่อนพื้นฐานและประกันสังคม จะเสียภาษีประมาณ ${tax} บาท/เดือน หรือ ${annualTax} บาท/ปี`
    : `เงินเดือน ${gross} บาท กรณีพนักงานประจำโสด ใช้ค่าลดหย่อนพื้นฐานและประกันสังคม จะรับสุทธิประมาณ ${net} บาท/เดือน หลังหักประกันสังคม ${sso} บาท และภาษี ${tax} บาท`;

  return {
    kind: 'salary',
    slug: input.slug,
    title: `${input.cardTitle} 2569 | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'เงินเดือน',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณเงินเดือนสุทธิ/',
    calculatorName: 'คำนวณเงินเดือนสุทธิ',
    buttonLabel: 'คำนวณเงินเดือนของคุณ',
    answerLabel: isTax ? 'คำตอบภาษีเงินเดือน' : 'คำตอบเงินเดือนสุทธิ',
    quickAnswer: answer,
    context:
      'ตัวเลขนี้เป็นตัวอย่างมาตรฐานสำหรับพนักงานประจำที่มีเงินเดือนอย่างเดียว สถานะโสด ไม่มีบุตร ไม่มีกองทุนสำรองเลี้ยงชีพ และไม่มีค่าลดหย่อนพิเศษ ยอดจริงควรคำนวณใหม่ตามสลิปและสิทธิลดหย่อนของคุณ',
    steps: [
      `รายได้ต่อปี = ${gross} x 12 = ${formatBaht(r.annualGross, 0)} บาท`,
      `หักค่าใช้จ่ายเงินเดือน 50% แต่ไม่เกิน 100,000 บาท = ${formatBaht(r.expenseDeduction, 0)} บาท`,
      `หักค่าลดหย่อนส่วนตัว 60,000 บาท และประกันสังคม ${formatBaht(r.socialSecurityAnnual, 0)} บาท`,
      `เงินได้สุทธิใช้คำนวณภาษี = ${taxable} บาท`,
      `ภาษีทั้งปี = ${annualTax} บาท เฉลี่ยเดือนละ ${tax} บาท`,
      `เงินรับสุทธิ = ${gross} - ${sso} - ${tax} = ${net} บาท`,
    ],
    table: {
      headers: ['รายการ', 'จำนวน'],
      rows: [
        ['เงินเดือนรวมต่อเดือน', `${gross} บาท`],
        ['ประกันสังคมต่อเดือน', `${sso} บาท`],
        ['ภาษีต่อเดือนโดยประมาณ', `${tax} บาท`],
        ['เงินเดือนสุทธิโดยประมาณ', `${net} บาท`],
        ['เงินได้สุทธิใช้คำนวณภาษีต่อปี', `${taxable} บาท`],
      ],
    },
    faqData: [
      {
        question: `เงินเดือน ${gross} บาท ต้องเสียภาษีไหม?`,
        answer:
          r.annualTax > 0
            ? `เสียภาษีประมาณ ${annualTax} บาทต่อปี หรือ ${tax} บาทต่อเดือน ในกรณีตัวอย่างที่มีค่าลดหย่อนพื้นฐานเท่านั้น`
            : `โดยตัวอย่างมาตรฐานนี้ยังไม่เสียภาษีเงินได้ เพราะเงินได้สุทธิหลังหักค่าใช้จ่ายและค่าลดหย่อนยังไม่เกินช่วงยกเว้นภาษี`,
      },
      {
        question: `เงินเดือน ${gross} บาท หักประกันสังคมเท่าไร?`,
        answer: `หักประกันสังคมประมาณ ${sso} บาทต่อเดือน เพราะมาตรา 33 คิด 5% ของค่าจ้างและมีเพดานสูงสุด 750 บาทต่อเดือน`,
      },
      {
        question: 'ทำไมเงินสุทธิของแต่ละคนไม่เท่ากันแม้เงินเดือนเท่ากัน?',
        answer: 'เพราะค่าลดหย่อน คู่สมรส บุตร กองทุนสำรองเลี้ยงชีพ ประกันชีวิต ดอกเบี้ยบ้าน และรายการหักอื่นต่างกัน ควรใช้เครื่องคำนวณเพื่อกรอกข้อมูลจริง',
      },
    ],
    sourceLinks: salarySources,
    relatedLinks: [
      { label: 'คำนวณภาษีเงินได้บุคคลธรรมดา', href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/' },
      { label: 'คำนวณประกันสังคม', href: '/คำนวณประกันสังคม/' },
      { label: 'เงินเดือนสุทธิ 2569', href: '/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/' },
    ],
    sourceVerifiedDate,
  };
}

function overtimeArticle(input: {
  slug: string;
  salary: number;
  hours: number;
  multiplier: 1.5 | 2 | 3;
  cardTitle: string;
  description: string;
}): ExactAnswerArticle {
  const hourlyRaw = input.salary / 26 / 8;
  const hourly = round(hourlyRaw);
  const total = round(hourlyRaw * input.multiplier * input.hours);
  const salary = formatBaht(input.salary, 0);
  const totalText = formatBaht(total);
  const hourlyText = formatBaht(hourly);
  const multiplierLabel = `${input.multiplier} เท่า`;

  return {
    kind: 'overtime',
    slug: input.slug,
    title: `${input.cardTitle} 2569 | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'แรงงาน',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณค่าโอที/',
    calculatorName: 'คำนวณค่าโอที',
    buttonLabel: 'คำนวณค่าโอทีของคุณ',
    answerLabel: 'คำตอบค่าโอที',
    quickAnswer: `เงินเดือน ${salary} บาท ถ้าคิดฐาน 26 วัน วันละ 8 ชั่วโมง ค่าแรงต่อชั่วโมงประมาณ ${hourlyText} บาท ทำ OT ${multiplierLabel} ${input.hours} ชั่วโมง จะได้ค่าโอทีประมาณ ${totalText} บาท`,
    context:
      'ตัวอย่างนี้ใช้ฐานคำนวณทั่วไป 26 วันทำงานต่อเดือนและ 8 ชั่วโมงต่อวัน หากบริษัทใช้ฐานวันทำงานต่างกัน ค่าแรงต่อชั่วโมงและค่า OT จะเปลี่ยนตาม',
    steps: [
      `ค่าแรงต่อชั่วโมง = ${salary} / (26 x 8) = ${hourlyText} บาท`,
      `ค่า OT = ${hourlyText} x ${input.multiplier} x ${input.hours} ชั่วโมง`,
      `ค่า OT โดยประมาณ = ${totalText} บาท`,
      'ถ้าต้องคิดหลายประเภท OT ในเดือนเดียว ให้แยก 1.5 เท่า, 2 เท่า และ 3 เท่า แล้วรวมผลลัพธ์',
    ],
    table: {
      headers: ['รายการ', 'จำนวน'],
      rows: [
        ['เงินเดือนตั้งต้น', `${salary} บาท`],
        ['ค่าแรงต่อชั่วโมง', `${hourlyText} บาท`],
        ['ตัวคูณ OT', multiplierLabel],
        ['จำนวนชั่วโมง OT', `${input.hours} ชั่วโมง`],
        ['ค่า OT โดยประมาณ', `${totalText} บาท`],
      ],
    },
    faqData: [
      {
        question: `${input.cardTitle} ได้กี่บาท?`,
        answer: `ได้ประมาณ ${totalText} บาท หากใช้ฐาน 26 วันทำงาน วันละ 8 ชั่วโมง และตัวคูณ ${multiplierLabel}`,
      },
      {
        question: 'OT 1.5 เท่า 2 เท่า 3 เท่า ต่างกันอย่างไร?',
        answer: 'โดยทั่วไป OT วันทำงานปกติใช้ 1.5 เท่า ทำงานวันหยุดมีกรณี 2 เท่า และ OT ที่เกินเวลาวันหยุดใช้ 3 เท่า ต้องดูตารางทำงานจริงประกอบ',
      },
      {
        question: 'ค่า OT ต้องรวมคำนวณภาษีเงินเดือนไหม?',
        answer: 'ต้องรวมเป็นรายได้จากการจ้างงาน จึงอาจทำให้ภาษีหัก ณ ที่จ่ายสูงขึ้นในเดือนที่มี OT มาก',
      },
    ],
    sourceLinks: laborSources,
    relatedLinks: [
      { label: 'โอที 1.5 เท่า คิดยังไง', href: '/บทความ/โอที-1-5-เท่า-คิดยังไง-2569/' },
      { label: 'เงินเดือน 20,000 OT 10 ชั่วโมง', href: '/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/' },
      { label: 'คำนวณเงินเดือนสุทธิ', href: '/คำนวณเงินเดือนสุทธิ/' },
    ],
    sourceVerifiedDate,
  };
}

function bmiArticle(input: {
  slug: string;
  cardTitle: string;
  description: string;
  heightCm: number;
  bmi: number;
  interpretation: string;
}): ExactAnswerArticle {
  const heightM = input.heightCm / 100;
  const weight = round(input.bmi * heightM * heightM);
  const heightText = formatBaht(input.heightCm, 0);
  const weightText = formatBaht(weight);

  return {
    kind: 'bmi',
    slug: input.slug,
    title: `${input.cardTitle} | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'สุขภาพ',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณ-bmi/',
    calculatorName: 'คำนวณ BMI',
    buttonLabel: 'คำนวณ BMI ของคุณ',
    answerLabel: 'คำตอบ BMI',
    quickAnswer: `ถ้าสูง ${heightText} ซม. และ BMI ${input.bmi} น้ำหนักจะอยู่ประมาณ ${weightText} กก. ความหมายโดยทั่วไปคือ ${input.interpretation}`,
    context:
      'BMI เป็นเครื่องมือคัดกรองเบื้องต้น ไม่ได้แยกกล้ามเนื้อกับไขมัน ควรดูรอบเอว อายุ เพศ โรคประจำตัว และปรึกษาแพทย์เมื่อต้องตัดสินใจด้านสุขภาพ',
    steps: [
      `แปลงส่วนสูง ${heightText} ซม. เป็น ${heightM.toFixed(2)} เมตร`,
      `น้ำหนัก = BMI x ส่วนสูงเมตร x ส่วนสูงเมตร`,
      `น้ำหนัก = ${input.bmi} x ${heightM.toFixed(2)} x ${heightM.toFixed(2)} = ${weightText} กก.`,
      'เปรียบเทียบกับเกณฑ์ BMI คนเอเชีย: 18.5-22.9 ปกติ, 23.0-24.9 น้ำหนักเกิน, 25.0 ขึ้นไปอ้วน',
    ],
    table: {
      headers: ['รายการ', 'ผลลัพธ์'],
      rows: [
        ['ส่วนสูง', `${heightText} ซม.`],
        ['ค่า BMI', `${input.bmi}`],
        ['น้ำหนักโดยประมาณ', `${weightText} กก.`],
        ['คำแปลผล', input.interpretation],
      ],
    },
    faqData: [
      {
        question: `${input.cardTitle} ตอบสั้น ๆ คืออะไร?`,
        answer: `สำหรับส่วนสูง ${heightText} ซม. ค่า BMI ${input.bmi} เท่ากับน้ำหนักประมาณ ${weightText} กก. และอยู่ในกลุ่ม ${input.interpretation}`,
      },
      {
        question: 'BMI ใช้ตัดสินสุขภาพได้ทั้งหมดไหม?',
        answer: 'ไม่ได้ BMI เป็นตัวชี้วัดเบื้องต้น ควรใช้ร่วมกับรอบเอว มวลกล้ามเนื้อ ประวัติสุขภาพ และคำแนะนำจากผู้เชี่ยวชาญ',
      },
      {
        question: 'ต้องลดน้ำหนักทันทีไหมถ้า BMI สูง?',
        answer: 'ควรประเมินพฤติกรรมอาหาร การออกกำลังกาย รอบเอว และโรคประจำตัวก่อน หากมีความเสี่ยงควรปรึกษาแพทย์หรือผู้เชี่ยวชาญ',
      },
    ],
    sourceLinks: bmiSources,
    relatedLinks: [
      { label: 'BMI 25 หมายความว่าอะไร', href: '/บทความ/bmi-25-หมายความว่าอะไร/' },
      { label: 'BMI 27 หมายความว่าอะไร', href: '/บทความ/bmi-27-หมายความว่าอะไร/' },
      { label: 'วิธีวัด BMI อย่างถูกต้อง', href: '/บทความ/วิธีวัด-bmi-อย่างถูกต้อง/' },
    ],
    sourceVerifiedDate,
  };
}

function bmiFormulaArticle(input: {
  slug: string;
  cardTitle: string;
  description: string;
  quickAnswer: string;
  context: string;
  focusRow: [string, string];
  faqData: Array<{ question: string; answer: string }>;
}): ExactAnswerArticle {
  return {
    kind: 'bmi-formula',
    slug: input.slug,
    title: `${input.cardTitle} | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'สุขภาพ',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณ-bmi/',
    calculatorName: 'คำนวณ BMI',
    buttonLabel: 'คำนวณ BMI จากน้ำหนักและส่วนสูง',
    answerLabel: 'คำตอบสูตร BMI',
    quickAnswer: input.quickAnswer,
    context: input.context,
    steps: [
      'แปลงส่วนสูงจากเซนติเมตรเป็นเมตร เช่น 170 ซม. = 1.70 เมตร',
      'ยกกำลังสองส่วนสูงเป็นเมตร เช่น 1.70 x 1.70 = 2.89',
      'นำค่าน้ำหนักกิโลกรัมหารด้วยผลลัพธ์ข้อก่อน เช่น 65 / 2.89 = 22.49',
      'เทียบกับเกณฑ์คนเอเชีย: 18.5-22.9 ปกติ, 23.0-24.9 น้ำหนักเกิน, 25.0 ขึ้นไปอ้วน',
    ],
    table: {
      headers: ['เรื่องที่ต้องรู้', 'คำตอบ'],
      rows: [
        input.focusRow,
        ['สูตร BMI', 'BMI = น้ำหนัก (กก.) ÷ (ส่วนสูงเป็นเมตร x ส่วนสูงเป็นเมตร)'],
        ['ตัวอย่าง', 'หนัก 65 กก. สูง 170 ซม. ได้ BMI 22.49'],
        ['เกณฑ์ปกติคนเอเชีย', '18.5-22.9'],
        ['เริ่มน้ำหนักเกิน', 'BMI 23.0 ขึ้นไป'],
        ['เริ่มอ้วนตามเกณฑ์เอเชีย', 'BMI 25.0 ขึ้นไป'],
      ],
    },
    faqData: input.faqData,
    sourceLinks: bmiSources,
    relatedLinks: [
      { label: 'คำนวณ BMI', href: '/คำนวณ-bmi/' },
      { label: 'BMI 23 หมายความว่าอะไร', href: '/บทความ/bmi-23-หมายความว่าอะไร/' },
      { label: 'BMI 30 หมายความว่าอะไร', href: '/บทความ/bmi-30-หมายความว่าอะไร/' },
      { label: 'วิธีวัด BMI อย่างถูกต้อง', href: '/บทความ/วิธีวัด-bmi-อย่างถูกต้อง/' },
    ],
    sourceVerifiedDate,
  };
}

function electricityRateArticle(input: {
  slug: string;
  cardTitle: string;
  description: string;
  focusRow: [string, string];
  quickAnswer: string;
  context: string;
  providerNote: string;
}): ExactAnswerArticle {
  return {
    kind: 'electricity-rate',
    slug: input.slug,
    title: `${input.cardTitle} | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'ค่าใช้จ่ายบ้าน',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณค่าไฟฟ้า/',
    calculatorName: 'คำนวณค่าไฟฟ้า PEA/MEA',
    buttonLabel: 'คำนวณค่าไฟจากหน่วยจริง',
    answerLabel: 'คำตอบอัตราค่าไฟฟ้า',
    quickAnswer: input.quickAnswer,
    context: input.context,
    steps: [
      'ดูจำนวนหน่วยไฟฟ้า kWh จากบิลหรือมิเตอร์ของรอบเดือนนั้น',
      'เลือก PEA หรือ MEA ให้ตรงกับพื้นที่ที่ออกบิล',
      'คำนวณค่าไฟฐานตามขั้นบันไดของบ้านอยู่อาศัยหรือประเภทผู้ใช้ไฟที่เกี่ยวข้อง',
      'บวกค่า Ft โดยใช้จำนวนหน่วย x ค่า Ft ต่อหน่วย',
      'บวกค่าบริการ แล้วคิด VAT 7% เพื่อได้ยอดรวมใกล้บิลจริง',
    ],
    table: {
      headers: ['รายการ', 'คำตอบเร็ว'],
      rows: [
        input.focusRow,
        ['1 kWh', 'เท่ากับ 1 หน่วยไฟ'],
        ['ค่าไฟประเมินเร็ว', 'ประมาณ 3.95 บาท/หน่วยก่อน VAT สำหรับภาพรวมรอบปัจจุบัน'],
        ['ค่า Ft ที่ใช้ตั้งต้น', '0.1623 บาท/หน่วย สำหรับรอบพฤษภาคม-สิงหาคม 2569'],
        ['สูตรบิลจริง', 'ค่าไฟฐานขั้นบันได + ค่า Ft + ค่าบริการ + VAT 7%'],
        ['ข้อควรระวัง', input.providerNote],
      ],
    },
    faqData: [
      {
        question: `${input.cardTitle} คิดราคาเดียวทุกหน่วยไหม?`,
        answer:
          'ไม่ใช่ บิลบ้านอยู่อาศัยใช้โครงสร้างขั้นบันได หน่วยแรกและหน่วยถัดไปอาจใช้อัตราไม่เท่ากัน และยังต้องรวมค่า Ft ค่าบริการ และ VAT',
      },
      {
        question: 'PEA กับ MEA ต่างกันอย่างไร?',
        answer:
          'MEA ใช้กับกรุงเทพฯ นนทบุรี และสมุทรปราการ ส่วน PEA ใช้กับจังหวัดอื่น การคำนวณควรเลือกผู้ให้บริการให้ตรงกับใบแจ้งค่าไฟ',
      },
      {
        question: 'ควรใช้ค่าเฉลี่ย 3.95 บาทต่อหน่วยแทนเครื่องคำนวณได้ไหม?',
        answer:
          'ใช้ประเมินเร็วได้ แต่ถ้าต้องการยอดใกล้บิลจริงควรกรอกจำนวนหน่วยในเครื่องคำนวณ เพราะค่าไฟบ้านมีหลายองค์ประกอบและคิดตามขั้นบันได',
      },
    ],
    sourceLinks: electricitySources,
    relatedLinks: [
      { label: '1 kWh เท่ากับกี่บาท 2569', href: '/บทความ/1-kwh-เท่ากับกี่บาท-2569/' },
      { label: 'คำนวณค่าไฟฟ้า 2569 สูตร PEA/MEA', href: '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/' },
      { label: 'บ้านใช้ไฟ 300 หน่วย ค่าไฟเท่าไร', href: '/บทความ/บ้านใช้ไฟ-300-หน่วย-ค่าไฟเท่าไร/' },
      { label: 'ค่าไฟห้องเช่า หน่วยละกี่บาท', href: '/บทความ/ค่าไฟห้องเช่าหน่วยละกี่บาท-2569/' },
    ],
    sourceVerifiedDate,
  };
}

function ageArticle(input: {
  slug: string;
  birthYearBE: number;
  cardTitle: string;
  description: string;
}): ExactAnswerArticle {
  const currentYearBE = 2569;
  const ageIfBirthdayPassed = currentYearBE - input.birthYearBE;
  const ageIfBirthdayNotPassed = ageIfBirthdayPassed - 1;
  const birthYearCE = input.birthYearBE - 543;

  return {
    kind: 'age',
    slug: input.slug,
    title: `${input.cardTitle} | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'ชีวิตประจำวัน',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณอายุ/',
    calculatorName: 'คำนวณอายุ',
    buttonLabel: 'คำนวณอายุจากวันเกิด',
    answerLabel: 'คำตอบอายุ',
    quickAnswer: `เกิดปี ${input.birthYearBE} จะอายุ ${ageIfBirthdayPassed} ปีในปี ${currentYearBE} ถ้าวันเกิดผ่านแล้ว และอายุ ${ageIfBirthdayNotPassed} ปีถ้ายังไม่ถึงวันเกิด`,
    context:
      'การเอาปีปัจจุบันลบปีเกิดเป็นเพียงคำตอบแบบเร็ว หากใช้กับเอกสาร สมัครงาน ประกัน หรือราชการ ควรกรอกวัน เดือน ปีเกิดจริงเพื่อให้ได้อายุเต็มเป็นปี เดือน วัน',
    steps: [
      `แปลง พ.ศ. ${input.birthYearBE} เป็น ค.ศ. ${birthYearCE} โดยลบ 543`,
      `${currentYearBE} - ${input.birthYearBE} = ${ageIfBirthdayPassed}`,
      `ถ้าวันเกิดปี ${currentYearBE} ผ่านแล้ว อายุเต็มคือ ${ageIfBirthdayPassed} ปี`,
      `ถ้ายังไม่ถึงวันเกิด อายุเต็มคือ ${ageIfBirthdayNotPassed} ปี`,
    ],
    table: {
      headers: ['กรณี', 'อายุ'],
      rows: [
        ['วันเกิดปีนี้ผ่านแล้ว', `${ageIfBirthdayPassed} ปี`],
        ['ยังไม่ถึงวันเกิดปีนี้', `${ageIfBirthdayNotPassed} ปี`],
        ['ปีเกิด ค.ศ.', `${birthYearCE}`],
        ['ปีอ้างอิง', `${currentYearBE}`],
      ],
    },
    faqData: [
      {
        question: `เกิดปี ${input.birthYearBE} อายุเท่าไรในปี ${currentYearBE}?`,
        answer: `อายุ ${ageIfBirthdayPassed} ปีถ้าวันเกิดผ่านแล้ว และ ${ageIfBirthdayNotPassed} ปีถ้ายังไม่ถึงวันเกิด`,
      },
      {
        question: 'ทำไมต้องดูวันเกิดด้วย?',
        answer: 'เพราะอายุเต็มจะเพิ่มในวันเกิดเท่านั้น ถ้ายังไม่ถึงวันเกิด อายุจริงจะน้อยกว่าผลลบปีเกิด 1 ปี',
      },
      {
        question: `พ.ศ. ${input.birthYearBE} คือ ค.ศ. อะไร?`,
        answer: `พ.ศ. ${input.birthYearBE} เท่ากับ ค.ศ. ${birthYearCE}`,
      },
    ],
    sourceLinks: [],
    relatedLinks: [
      { label: 'คำนวณอายุวันนี้จากวันเกิด', href: '/บทความ/คำนวณอายุวันนี้-จากวันเกิด/' },
      { label: 'คำนวณอายุจากวันเกิด 2569', href: '/บทความ/คำนวณอายุ-จากวันเกิด-2569-ปี-เดือน-วัน/' },
      { label: 'เกิดปี 2535 อายุเท่าไร', href: '/บทความ/เกิดปี-2535-อายุเท่าไร-2569/' },
    ],
    sourceVerifiedDate,
  };
}

function percentageArticle(input: {
  slug: string;
  cardTitle: string;
  description: string;
  percent: number;
  amount: number;
  mode: 'percent-of' | 'discount';
}): ExactAnswerArticle {
  const value = round((input.percent / 100) * input.amount);
  const finalPrice = round(input.amount - value);
  const amountText = formatBaht(input.amount, 0);
  const valueText = formatBaht(value);
  const finalText = formatBaht(finalPrice);
  const quickAnswer =
    input.mode === 'discount'
      ? `ส่วนลด ${input.percent}% ของ ${amountText} บาท เท่ากับ ${valueText} บาท เหลือราคาหลังลด ${finalText} บาท`
      : `${input.percent}% ของ ${amountText} บาท เท่ากับ ${valueText} บาท`;

  return {
    kind: 'percentage',
    slug: input.slug,
    title: `${input.cardTitle} | Kamnuanlek`,
    cardTitle: input.cardTitle,
    description: input.description,
    category: 'ชีวิตประจำวัน',
    publishDate,
    modifiedDate: publishDate,
    calculatorHref: '/คำนวณเปอร์เซ็นต์/',
    calculatorName: 'คำนวณเปอร์เซ็นต์',
    buttonLabel: 'คำนวณเปอร์เซ็นต์',
    answerLabel: 'คำตอบเปอร์เซ็นต์',
    quickAnswer,
    context:
      'สูตรเปอร์เซ็นต์พื้นฐานคือ จำนวนเงิน x เปอร์เซ็นต์ / 100 ถ้าเป็นส่วนลด ให้นำจำนวนส่วนลดไปลบออกจากราคาเต็ม',
    steps: [
      `${input.percent}% = ${input.percent} / 100 = ${input.percent / 100}`,
      `จำนวนเงิน = ${amountText} บาท`,
      `ผลลัพธ์ = ${amountText} x ${input.percent / 100} = ${valueText} บาท`,
      input.mode === 'discount' ? `ราคาหลังลด = ${amountText} - ${valueText} = ${finalText} บาท` : 'ถ้าเป็นการคิดส่วนลด ให้นำผลลัพธ์นี้ไปลบจากราคาเต็ม',
    ],
    table: {
      headers: ['รายการ', 'จำนวน'],
      rows: [
        ['ราคาเต็ม', `${amountText} บาท`],
        ['เปอร์เซ็นต์', `${input.percent}%`],
        ['มูลค่าเปอร์เซ็นต์', `${valueText} บาท`],
        ...(input.mode === 'discount' ? [['ราคาหลังลด', `${finalText} บาท`]] : []),
      ],
    },
    faqData: [
      {
        question: `${input.cardTitle} ได้เท่าไร?`,
        answer: quickAnswer,
      },
      {
        question: 'สูตรคิดเปอร์เซ็นต์คืออะไร?',
        answer: 'จำนวนเงิน x เปอร์เซ็นต์ / 100 เช่น 1,000 x 20 / 100 = 200',
      },
      {
        question: 'คิดส่วนลดเปอร์เซ็นต์อย่างไร?',
        answer: 'หาจำนวนส่วนลดก่อน แล้วนำไปลบจากราคาเต็ม เช่น ลด 30% จาก 1,000 คือส่วนลด 300 เหลือ 700 บาท',
      },
    ],
    sourceLinks: [],
    relatedLinks: [
      { label: 'คำนวณส่วนลด 20 เปอร์เซ็นต์', href: '/บทความ/คำนวณส่วนลด-20-เปอร์เซ็นต์/' },
      { label: 'คำนวณเปอร์เซ็นต์ 2569', href: '/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/' },
      { label: 'วิธีคำนวณเปอร์เซ็นต์', href: '/บทความ/วิธีคำนวณเปอร์เซ็นต์/' },
    ],
    sourceVerifiedDate,
  };
}

export const exactAnswerArticles: ExactAnswerArticle[] = [
  salaryArticle({
    slug: 'เงินเดือน-20000-เสียภาษีไหม',
    grossMonthly: 20_000,
    mode: 'tax',
    cardTitle: 'เงินเดือน 20,000 เสียภาษีไหม',
    description: 'เงินเดือน 20,000 บาทเสียภาษีไหม คำนวณประกันสังคม เงินได้สุทธิ และเงินรับจริงปี 2569 แบบคำตอบเร็ว',
  }),
  salaryArticle({
    slug: 'เงินเดือน-25000-รับสุทธิเท่าไร',
    grossMonthly: 25_000,
    mode: 'net',
    cardTitle: 'เงินเดือน 25,000 รับสุทธิเท่าไร',
    description: 'เงินเดือน 25,000 บาทรับจริงเท่าไรหลังหักประกันสังคมและภาษี พร้อมสูตรคำนวณเงินเดือนสุทธิปี 2569',
  }),
  salaryArticle({
    slug: 'เงินเดือน-30000-รับสุทธิเท่าไร',
    grossMonthly: 30_000,
    mode: 'net',
    cardTitle: 'เงินเดือน 30,000 รับสุทธิเท่าไร',
    description: 'เงินเดือน 30,000 บาทรับสุทธิเท่าไรหลังหักประกันสังคมและภาษี พร้อมตัวอย่างเงินเดือนสุทธิปี 2569',
  }),
  salaryArticle({
    slug: 'เงินเดือน-30000-เสียภาษีเท่าไหร่',
    grossMonthly: 30_000,
    mode: 'tax',
    cardTitle: 'เงินเดือน 30,000 เสียภาษีเท่าไหร่',
    description: 'คำนวณภาษีเงินเดือน 30,000 บาท ปี 2569 เสียภาษีเดือนละเท่าไรและรับสุทธิประมาณเท่าไร',
  }),
  salaryArticle({
    slug: 'เงินเดือน-40000-รับสุทธิเท่าไร',
    grossMonthly: 40_000,
    mode: 'net',
    cardTitle: 'เงินเดือน 40,000 รับสุทธิเท่าไร',
    description: 'เงินเดือน 40,000 บาทรับสุทธิเท่าไรหลังหักประกันสังคมและภาษี พร้อมวิธีคำนวณแบบเงินเดือนประจำ',
  }),
  salaryArticle({
    slug: 'เงินเดือน-50000-รับสุทธิเท่าไร',
    grossMonthly: 50_000,
    mode: 'net',
    cardTitle: 'เงินเดือน 50,000 รับสุทธิเท่าไร',
    description: 'เงินเดือน 50,000 บาทรับสุทธิเท่าไรหลังหักประกันสังคมและภาษี ปี 2569 พร้อมตารางรายการหัก',
  }),
  salaryArticle({
    slug: 'เงินเดือน-50000-เสียภาษีเท่าไหร่',
    grossMonthly: 50_000,
    mode: 'tax',
    cardTitle: 'เงินเดือน 50,000 เสียภาษีเท่าไหร่',
    description: 'คำนวณภาษีเงินเดือน 50,000 บาท ปี 2569 เสียภาษีรายเดือน รายปี และเหลือเงินสุทธิเท่าไร',
  }),
  salaryArticle({
    slug: 'เงินเดือน-60000-รับสุทธิเท่าไร',
    grossMonthly: 60_000,
    mode: 'net',
    cardTitle: 'เงินเดือน 60,000 รับสุทธิเท่าไร',
    description: 'เงินเดือน 60,000 บาทรับสุทธิเท่าไรหลังหักภาษีและประกันสังคม พร้อมคำตอบเร็วและสูตรปี 2569',
  }),
  overtimeArticle({
    slug: 'เงินเดือน-15000-โอที-10-ชั่วโมง',
    salary: 15_000,
    hours: 10,
    multiplier: 1.5,
    cardTitle: 'เงินเดือน 15,000 โอที 10 ชั่วโมงได้เท่าไร',
    description: 'เงินเดือน 15,000 บาททำ OT 10 ชั่วโมงแบบ 1.5 เท่า ได้ประมาณเท่าไร พร้อมสูตรค่าแรงต่อชั่วโมง',
  }),
  overtimeArticle({
    slug: 'เงินเดือน-18000-โอที-10-ชั่วโมง',
    salary: 18_000,
    hours: 10,
    multiplier: 1.5,
    cardTitle: 'เงินเดือน 18,000 โอที 10 ชั่วโมงได้เท่าไร',
    description: 'เงินเดือน 18,000 บาททำ OT 10 ชั่วโมงแบบ 1.5 เท่า ได้ประมาณเท่าไร คำนวณจากฐาน 26 วัน',
  }),
  overtimeArticle({
    slug: 'เงินเดือน-30000-โอที-20-ชั่วโมง',
    salary: 30_000,
    hours: 20,
    multiplier: 1.5,
    cardTitle: 'เงินเดือน 30,000 โอที 20 ชั่วโมงได้เท่าไร',
    description: 'เงินเดือน 30,000 บาททำ OT 20 ชั่วโมง ได้ค่าโอทีประมาณเท่าไร พร้อมสูตรคำนวณ 1.5 เท่า',
  }),
  overtimeArticle({
    slug: 'โอที-3-เท่า-คิดยังไง-2569',
    salary: 20_000,
    hours: 5,
    multiplier: 3,
    cardTitle: 'โอที 3 เท่า คิดยังไง',
    description: 'โอที 3 เท่าใช้เมื่อไร สูตรคำนวณจากค่าแรงต่อชั่วโมง พร้อมตัวอย่างเงินเดือน 20,000 ทำ OT วันหยุด 5 ชั่วโมง',
  }),
  bmiArticle({
    slug: 'bmi-23-หมายความว่าอะไร',
    cardTitle: 'BMI 23 หมายความว่าอะไร',
    description: 'BMI 23 หมายความว่าอะไร สูง 170 ซม. จะหนักประมาณเท่าไร และอยู่ในเกณฑ์ไหนสำหรับคนเอเชีย',
    heightCm: 170,
    bmi: 23,
    interpretation: 'น้ำหนักเกินเริ่มต้นตามเกณฑ์เอเชีย',
  }),
  bmiArticle({
    slug: 'bmi-30-หมายความว่าอะไร',
    cardTitle: 'BMI 30 หมายความว่าอะไร',
    description: 'BMI 30 หมายความว่าอะไร สูง 170 ซม. จะหนักประมาณเท่าไร และควรประเมินสุขภาพอย่างไร',
    heightCm: 170,
    bmi: 30,
    interpretation: 'อ้วนระดับสูงและควรประเมินความเสี่ยงสุขภาพร่วมด้วย',
  }),
  bmiArticle({
    slug: 'สูง-160-bmi-25-หนักเท่าไร',
    cardTitle: 'สูง 160 BMI 25 หนักเท่าไร',
    description: 'สูง 160 ซม. ถ้า BMI 25 จะหนักเท่าไร พร้อมสูตรกลับค่าน้ำหนักจาก BMI และลิงก์คำนวณ BMI',
    heightCm: 160,
    bmi: 25,
    interpretation: 'เริ่มเข้าเกณฑ์อ้วนตามเกณฑ์เอเชีย',
  }),
  bmiFormulaArticle({
    slug: 'สูตรคำนวณ-bmi',
    cardTitle: 'สูตรคำนวณ BMI',
    description: 'สูตรคำนวณ BMI คือ น้ำหนักกิโลกรัมหารด้วยส่วนสูงเมตรยกกำลังสอง พร้อมตัวอย่าง 65 กก. สูง 170 ซม. และเกณฑ์คนเอเชีย',
    quickAnswer:
      'สูตรคำนวณ BMI คือ BMI = น้ำหนัก (กก.) ÷ ส่วนสูง (เมตร)^2 เช่น หนัก 65 กก. สูง 170 ซม. จะได้ BMI = 65 ÷ 1.70^2 = 22.49',
    context:
      'สูตรนี้ใช้ได้กับผู้ใหญ่ทั่วไปทั้งผู้หญิงและผู้ชาย แต่เป็นเพียงเครื่องมือคัดกรองเบื้องต้น ควรดูรอบเอว มวลกล้ามเนื้อ และสุขภาพร่วมด้วย',
    focusRow: ['คำตอบหลัก', 'BMI = น้ำหนัก (กก.) ÷ ส่วนสูง (เมตร)^2'],
    faqData: [
      {
        question: 'สูตรคำนวณ BMI คืออะไร?',
        answer: 'สูตรคือ น้ำหนักกิโลกรัมหารด้วยส่วนสูงเป็นเมตรยกกำลังสอง เช่น 65 ÷ 1.70^2 = 22.49',
      },
      {
        question: 'ต้องใช้ส่วนสูงเป็นเซนติเมตรหรือเมตร?',
        answer: 'ต้องแปลงเป็นเมตรก่อนเสมอ เช่น 170 ซม. ต้องใช้ 1.70 ในสูตร ไม่ใช่ 170',
      },
      {
        question: 'BMI 22.49 อยู่ในเกณฑ์ไหน?',
        answer: 'ตามเกณฑ์เอเชีย BMI 22.49 อยู่ในเกณฑ์ปกติ เพราะอยู่ระหว่าง 18.5-22.9',
      },
    ],
  }),
  bmiFormulaArticle({
    slug: 'คำนวณ-bmi-ผู้หญิง',
    cardTitle: 'คำนวณ BMI ผู้หญิง',
    description: 'คำนวณ BMI ผู้หญิง ใช้สูตรเดียวกับผู้ชาย พร้อมเกณฑ์คนเอเชีย ข้อควรระวังเรื่องรอบเอว มวลกล้ามเนื้อ และช่วงตั้งครรภ์',
    quickAnswer:
      'คำนวณ BMI ผู้หญิงใช้สูตรเดียวกับผู้ชาย: น้ำหนัก (กก.) ÷ ส่วนสูง (เมตร)^2 แต่ควรดูรอบเอว ไขมันสะสม มวลกล้ามเนื้อ และไม่ใช้ตัดสินสุขภาพช่วงตั้งครรภ์',
    context:
      'สำหรับผู้หญิง BMI ช่วยคัดกรองน้ำหนักเทียบส่วนสูงได้เร็ว แต่ไม่บอกตำแหน่งไขมันหรือองค์ประกอบร่างกาย จึงควรใช้ร่วมกับรอบเอวและคำแนะนำจากผู้เชี่ยวชาญ',
    focusRow: ['สำหรับผู้หญิง', 'ใช้สูตรเดียวกับผู้ชาย แต่ควรดูรอบเอวและองค์ประกอบร่างกายร่วมด้วย'],
    faqData: [
      {
        question: 'ผู้หญิงใช้สูตร BMI ต่างจากผู้ชายไหม?',
        answer: 'ไม่ต่าง สูตร BMI เหมือนกันคือ น้ำหนักกิโลกรัมหารด้วยส่วนสูงเมตรยกกำลังสอง',
      },
      {
        question: 'BMI ผู้หญิงเท่าไรถึงถือว่าปกติ?',
        answer: 'สำหรับผู้ใหญ่เอเชีย เกณฑ์ปกติโดยทั่วไปคือ BMI 18.5-22.9 แต่ควรดูสุขภาพและรอบเอวร่วมด้วย',
      },
      {
        question: 'หญิงตั้งครรภ์ควรใช้ BMI ปกติไหม?',
        answer: 'ไม่ควรใช้ BMI แบบผู้ใหญ่ทั่วไปเพียงอย่างเดียวช่วงตั้งครรภ์ เพราะน้ำหนักเปลี่ยนตามอายุครรภ์ ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญ',
      },
    ],
  }),
  bmiFormulaArticle({
    slug: 'คำนวณดัชนีมวลกาย',
    cardTitle: 'คำนวณดัชนีมวลกาย',
    description: 'คำนวณดัชนีมวลกาย BMI จากน้ำหนักและส่วนสูง พร้อมสูตร เกณฑ์คนเอเชีย และลิงก์เครื่องคำนวณ BMI ฟรี',
    quickAnswer:
      'ดัชนีมวลกายหรือ BMI คำนวณจากน้ำหนัก (กก.) ÷ ส่วนสูง (เมตร)^2 ใช้ดูว่าน้ำหนักสัมพันธ์กับส่วนสูงอยู่ในเกณฑ์น้ำหนักน้อย ปกติ น้ำหนักเกิน หรืออ้วน',
    context:
      'ดัชนีมวลกายเป็นตัวเลขสรุปเร็วสำหรับผู้ใหญ่ แต่ไม่ได้แยกไขมันกับกล้ามเนื้อ จึงเหมาะสำหรับเริ่มประเมิน ไม่ใช่ใช้วินิจฉัยโรค',
    focusRow: ['ดัชนีมวลกายคืออะไร', 'ตัวเลข BMI ที่ใช้ประเมินน้ำหนักเทียบส่วนสูงของผู้ใหญ่'],
    faqData: [
      {
        question: 'ดัชนีมวลกายคืออะไร?',
        answer: 'ดัชนีมวลกายหรือ BMI คือค่าที่คำนวณจากน้ำหนักและส่วนสูงเพื่อประเมินภาวะน้ำหนักเบื้องต้น',
      },
      {
        question: 'คำนวณดัชนีมวลกายต้องใช้อะไรบ้าง?',
        answer: 'ใช้เพียงน้ำหนักเป็นกิโลกรัมและส่วนสูงเป็นเมตร แล้วนำไปเข้าสูตร BMI',
      },
      {
        question: 'ดัชนีมวลกายสูงแปลว่าอ้วนเสมอไหม?',
        answer: 'ไม่เสมอ คนที่มีกล้ามเนื้อมากอาจมี BMI สูงได้ ควรประเมินรอบเอว ไขมัน และสุขภาพร่วมด้วย',
      },
    ],
  }),
  bmiFormulaArticle({
    slug: 'วิธีคำนวณ-bmi',
    cardTitle: 'วิธีคำนวณ BMI',
    description: 'วิธีคำนวณ BMI ทีละขั้น แปลงส่วนสูงเป็นเมตร ยกกำลังสอง หารด้วยน้ำหนัก พร้อมตัวอย่างและเกณฑ์ BMI คนไทย',
    quickAnswer:
      'วิธีคำนวณ BMI มี 3 ขั้น: แปลงส่วนสูงเป็นเมตร, ยกกำลังสองส่วนสูง, แล้วนำค่าน้ำหนักกิโลกรัมหารด้วยผลลัพธ์ เช่น 65 ÷ 1.70^2 = 22.49',
    context:
      'ข้อผิดพลาดที่พบบ่อยคือใช้ส่วนสูงเป็นเซนติเมตรในสูตรโดยไม่แปลงเป็นเมตร ทำให้ผลลัพธ์ผิดทันที',
    focusRow: ['วิธีคิดเร็ว', 'แปลงส่วนสูงเป็นเมตรก่อน แล้วค่อยยกกำลังสอง'],
    faqData: [
      {
        question: 'วิธีคำนวณ BMI ที่ถูกต้องคืออะไร?',
        answer: 'แปลงส่วนสูงเป็นเมตร ยกกำลังสอง แล้วนำน้ำหนักกิโลกรัมหารด้วยค่าส่วนสูงยกกำลังสอง',
      },
      {
        question: 'สูง 170 หนัก 65 BMI เท่าไร?',
        answer: 'แปลง 170 ซม. เป็น 1.70 ม. แล้วคำนวณ 65 ÷ 1.70^2 = 22.49',
      },
      {
        question: 'ควรปัดค่า BMI กี่ตำแหน่ง?',
        answer: 'โดยทั่วไปปัดทศนิยม 1-2 ตำแหน่งก็เพียงพอสำหรับการประเมินเบื้องต้น',
      },
    ],
  }),
  bmiFormulaArticle({
    slug: 'เกณฑ์-bmi-คนไทย-2569',
    cardTitle: 'เกณฑ์ BMI คนไทย 2569',
    description: 'เกณฑ์ BMI คนไทยและคนเอเชียปี 2569 น้ำหนักน้อย ปกติ น้ำหนักเกิน และอ้วน พร้อมสูตรคำนวณ BMI',
    quickAnswer:
      'เกณฑ์ BMI คนไทยโดยอิงเกณฑ์เอเชีย: ต่ำกว่า 18.5 น้ำหนักน้อย, 18.5-22.9 ปกติ, 23.0-24.9 น้ำหนักเกิน, 25.0 ขึ้นไปอ้วน',
    context:
      'เกณฑ์เอเชียใช้จุดเริ่มน้ำหนักเกินที่ BMI 23 เพราะความเสี่ยงสุขภาพของคนเอเชียอาจเพิ่มขึ้นที่ BMI ต่ำกว่าเกณฑ์สากล',
    focusRow: ['เกณฑ์คนไทย', '18.5-22.9 ปกติ, 23.0-24.9 น้ำหนักเกิน, 25.0 ขึ้นไปอ้วน'],
    faqData: [
      {
        question: 'BMI คนไทยเท่าไรถึงปกติ?',
        answer: 'ตามเกณฑ์เอเชีย ผู้ใหญ่ที่มี BMI 18.5-22.9 ถือว่าอยู่ในช่วงปกติโดยทั่วไป',
      },
      {
        question: 'BMI 23 สำหรับคนไทยถือว่าอะไร?',
        answer: 'BMI 23.0 เริ่มเข้าสู่กลุ่มน้ำหนักเกินตามเกณฑ์เอเชีย',
      },
      {
        question: 'BMI 25 สำหรับคนไทยถือว่าอะไร?',
        answer: 'BMI 25.0 ขึ้นไปเริ่มเข้าเกณฑ์อ้วนตามเกณฑ์เอเชีย ควรดูรอบเอวและปัจจัยสุขภาพร่วมด้วย',
      },
    ],
  }),
  electricityRateArticle({
    slug: 'อัตราค่าไฟฟ้า-pea-2569',
    cardTitle: 'อัตราค่าไฟฟ้า PEA 2569',
    description: 'อัตราค่าไฟฟ้า PEA 2569 สำหรับบ้านอยู่อาศัย สรุป 1 kWh เท่ากับกี่บาท ค่า Ft 0.1623 บาท/หน่วย และสูตรคำนวณบิลจริง',
    focusRow: ['คำค้น PEA', 'อัตราค่าไฟฟ้า PEA 2569 ต้องคิดค่าไฟฐานขั้นบันได + Ft + ค่าบริการ + VAT'],
    quickAnswer:
      'อัตราค่าไฟฟ้า PEA 2569 สำหรับบ้านอยู่อาศัยประเมินเร็วได้ราว 3.95 บาทต่อหน่วยก่อน VAT แต่บิลจริงต้องคิดตามขั้นบันได รวมค่า Ft 0.1623 บาท/หน่วย ค่าบริการ และ VAT 7%',
    context:
      'PEA คือการไฟฟ้าส่วนภูมิภาค ใช้กับจังหวัดนอกพื้นที่ MEA การคำนวณควรเลือก PEA ในเครื่องมือและกรอกจำนวนหน่วยจริงจากบิล',
    providerNote: 'PEA ครอบคลุมพื้นที่ส่วนภูมิภาค ยอดจริงควรเทียบกับประเภทผู้ใช้ไฟและใบแจ้งหนี้ของ PEA',
  }),
  electricityRateArticle({
    slug: 'อัตราค่าไฟฟ้า-mea-2569',
    cardTitle: 'อัตราค่าไฟฟ้า MEA 2569',
    description: 'อัตราค่าไฟฟ้า MEA 2569 สำหรับกรุงเทพฯ นนทบุรี สมุทรปราการ พร้อมค่า Ft 0.1623 บาท/หน่วย สูตรบิลบ้าน และ VAT 7%',
    focusRow: ['คำค้น MEA', 'อัตราค่าไฟฟ้า MEA 2569 สำหรับพื้นที่กรุงเทพฯ นนทบุรี และสมุทรปราการ'],
    quickAnswer:
      'อัตราค่าไฟฟ้า MEA 2569 ประเมินเร็วได้ราว 3.95 บาทต่อหน่วยก่อน VAT แต่บิลจริงต้องรวมค่าไฟฐานขั้นบันได ค่า Ft 0.1623 บาท/หน่วย ค่าบริการ และ VAT 7%',
    context:
      'MEA คือการไฟฟ้านครหลวง ใช้กับกรุงเทพฯ นนทบุรี และสมุทรปราการ หากบิลของคุณออกโดย MEA ให้เลือก MEA ในเครื่องคำนวณเพื่อให้บริบทตรงพื้นที่',
    providerNote: 'MEA ใช้กับกรุงเทพฯ นนทบุรี และสมุทรปราการ ยอดจริงขึ้นกับประเภทผู้ใช้ไฟและหน่วยใช้จริง',
  }),
  electricityRateArticle({
    slug: 'อัตราค่าไฟฟ้า-mea-pea-2569',
    cardTitle: 'อัตราค่าไฟฟ้า MEA PEA 2569',
    description: 'เปรียบเทียบอัตราค่าไฟฟ้า MEA PEA 2569 ดู 1 kWh เท่ากับกี่บาท ค่า Ft ล่าสุด พื้นที่บริการ และวิธีคำนวณค่าไฟบ้าน',
    focusRow: ['MEA/PEA', 'เลือก MEA ถ้าอยู่กรุงเทพฯ นนทบุรี สมุทรปราการ เลือก PEA สำหรับจังหวัดอื่น'],
    quickAnswer:
      'MEA และ PEA ใช้คนละพื้นที่บริการ แต่การประเมินค่าไฟบ้านต้องเริ่มจากหน่วย kWh เช่นกัน แล้วรวมค่าไฟฐานขั้นบันได ค่า Ft 0.1623 บาท/หน่วย ค่าบริการ และ VAT 7%',
    context:
      'คำถาม MEA/PEA ส่วนใหญ่ต้องการรู้ว่าควรเลือกผู้ให้บริการไหนในเครื่องคำนวณ เลือกให้ตรงกับชื่อการไฟฟ้าบนใบแจ้งค่าไฟจะลดความคลาดเคลื่อน',
    providerNote: 'อย่าเลือกจากจังหวัดโดยเดาอย่างเดียว ให้ดูชื่อผู้ให้บริการบนบิลจริงก่อนคำนวณ',
  }),
  electricityRateArticle({
    slug: 'อัตราค่าไฟฟ้า-pea-บ้านอยู่อาศัย-2569',
    cardTitle: 'อัตราค่าไฟฟ้า PEA บ้านอยู่อาศัย 2569',
    description: 'อัตราค่าไฟฟ้า PEA บ้านอยู่อาศัย 2569 สรุปวิธีคิดค่าไฟบ้านแบบขั้นบันได ค่า Ft ค่าบริการ และ VAT',
    focusRow: ['PEA บ้านอยู่อาศัย', 'ค่าไฟบ้านใช้ขั้นบันได ไม่ใช่คูณราคาเดียวทุกหน่วย'],
    quickAnswer:
      'อัตราค่าไฟฟ้า PEA บ้านอยู่อาศัย 2569 ต้องคิดแบบขั้นบันได บวกค่า Ft 0.1623 บาท/หน่วย ค่าบริการ และ VAT 7% จึงควรกรอกหน่วยจริงในเครื่องคำนวณ',
    context:
      'หน้าแบบบ้านอยู่อาศัยเหมาะกับคนที่ต้องการเช็กบิลบ้านทั่วไป ไม่ใช่กิจการหรือมิเตอร์ประเภทอื่น',
    providerNote: 'ถ้าเป็นกิจการหรือมิเตอร์ประเภทอื่น ค่าไฟและค่าบริการอาจต่างจากบ้านอยู่อาศัย',
  }),
  electricityRateArticle({
    slug: 'อัตราค่าไฟฟ้า-mea-บ้านอยู่อาศัย-2569',
    cardTitle: 'อัตราค่าไฟฟ้า MEA บ้านอยู่อาศัย 2569',
    description: 'อัตราค่าไฟฟ้า MEA บ้านอยู่อาศัย 2569 สำหรับกรุงเทพฯ นนทบุรี สมุทรปราการ พร้อมสูตรค่าไฟฐาน ค่า Ft และ VAT',
    focusRow: ['MEA บ้านอยู่อาศัย', 'ใช้กับบ้านในพื้นที่ MEA และต้องคิดบิลตามขั้นบันได'],
    quickAnswer:
      'อัตราค่าไฟฟ้า MEA บ้านอยู่อาศัย 2569 ต้องคิดค่าไฟฐานตามขั้นบันได บวกค่า Ft 0.1623 บาท/หน่วย ค่าบริการ และ VAT 7% เพื่อได้ยอดใกล้บิลจริง',
    context:
      'เหมาะสำหรับบ้านหรือคอนโดในกรุงเทพฯ นนทบุรี และสมุทรปราการที่ออกบิลโดย MEA',
    providerNote: 'หากเป็นพื้นที่นอก MEA ให้เลือก PEA แทน และตรวจประเภทผู้ใช้ไฟบนบิลก่อนคำนวณ',
  }),
  ageArticle({
    slug: 'เกิดปี-2540-อายุเท่าไร-2569',
    birthYearBE: 2540,
    cardTitle: 'เกิดปี 2540 อายุเท่าไรในปี 2569',
    description: 'เกิดปี 2540 อายุเท่าไรในปี 2569 คำตอบเร็วพร้อมวิธีตรวจว่าวันเกิดผ่านแล้วหรือยัง',
  }),
  ageArticle({
    slug: 'เกิดปี-2545-อายุเท่าไร-2569',
    birthYearBE: 2545,
    cardTitle: 'เกิดปี 2545 อายุเท่าไรในปี 2569',
    description: 'เกิดปี 2545 อายุเท่าไรในปี 2569 แปลง พ.ศ. เป็น ค.ศ. และนับอายุเต็มตามวันเกิด',
  }),
  ageArticle({
    slug: 'เกิดปี-2530-อายุเท่าไร-2569',
    birthYearBE: 2530,
    cardTitle: 'เกิดปี 2530 อายุเท่าไรในปี 2569',
    description: 'เกิดปี 2530 อายุเท่าไรในปี 2569 วิธีคิดอายุจากปีเกิดและวันเกิดจริง',
  }),
  percentageArticle({
    slug: '20-เปอร์เซ็นต์-ของ-1000-เท่ากับเท่าไร',
    cardTitle: '20 เปอร์เซ็นต์ของ 1,000 เท่ากับเท่าไร',
    description: '20 เปอร์เซ็นต์ของ 1,000 บาทเท่ากับเท่าไร พร้อมสูตรคิดเปอร์เซ็นต์และตัวอย่างตรวจคำตอบ',
    percent: 20,
    amount: 1_000,
    mode: 'percent-of',
  }),
  percentageArticle({
    slug: 'ส่วนลด-30-เปอร์เซ็นต์-คิดยังไง',
    cardTitle: 'ส่วนลด 30 เปอร์เซ็นต์ คิดยังไง',
    description: 'ส่วนลด 30 เปอร์เซ็นต์จากราคา 1,000 บาทคิดยังไง ได้ส่วนลดเท่าไรและเหลือจ่ายเท่าไร',
    percent: 30,
    amount: 1_000,
    mode: 'discount',
  }),
];

export const exactAnswerArticleMap = new Map(exactAnswerArticles.map((article) => [article.slug, article]));
