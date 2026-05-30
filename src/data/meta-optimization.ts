/**
 * Meta Tag Optimization System
 * Generates keyword-targeted titles and descriptions for SEO
 */

export interface MetaOptimization {
  title: string;
  description: string;
  titleVariants?: string[];
}

// Core calculators with optimized meta tags
export const metaTagOptimizations: Record<string, MetaOptimization> = {
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/': {
    title: 'คำนวณภาษีเงินได้ 2569 | เครื่องคิดภาษี พร้อมลดหย่อน',
    description: 'คำนวณภาษีเงินได้บุคคลธรรมดา ปี 2569 ตามขั้นบันได พร้อมค่าลดหย่อนครบถ้วน เครื่องคิดภาษีฟรี ผลลัพธ์ทันที',
    titleVariants: [
      'เครื่องคำนวณภาษีเงินได้บุคคลธรรมดา 2569 [ลดหย่อนครบ]',
      'คำนวณภาษีเงินได้ 2569 ตามขั้นบันได + ลดหย่อน',
    ],
  },
  '/คำนวณภาษีมูลค่าเพิ่ม/': {
    title: 'คำนวณ VAT 7% | 10000/1.07 ถอด VAT บวก VAT',
    description: 'คำนวณ VAT 7% บวกภาษี ถอดภาษีจากราคารวม เช่น 10000/1.07, 1070/1.07 และ 1000 บวก VAT พร้อมแยกยอดทันที',
    titleVariants: [
      'เครื่องคำนวณภาษีมูลค่าเพิ่ม VAT 7% [10000/1.07]',
      'วิธีบวก VAT ถอด VAT ตั้งราคาขาย 2569',
    ],
  },
  '/คำนวณภาษีที่ดิน/': {
    title: 'คำนวณภาษีที่ดิน 2569 | แยกที่อยู่อาศัย เกษตร พาณิชย์',
    description: 'คำนวณภาษีที่ดินและสิ่งปลูกสร้าง 2569 ตามขั้นมูลค่า แยกตามประเภท ผลลัพธ์ทันที ใช้ฟรี',
    titleVariants: [
      'เครื่องคำนวณภาษีที่ดิน 2569 [ที่อยู่อาศัย-เกษตร-พาณิชย์]',
      'ภาษีที่ดิน 2569 คำนวณเท่าไร ตามอัตราขั้นมูลค่า',
    ],
  },
  '/คำนวณค่าภาษีรถยนต์/': {
    title: 'คำนวณภาษีรถยนต์ 2569 | ภาษีประจำปี + พ.ร.บ. ทุกประเภท',
    description: 'คำนวณภาษีรถยนต์ 2569 ภาษีประจำปี พ.ร.บ. รองรับเก๋ง กระบะ มอเตอร์ไซค์ พร้อมส่วนลดอายุรถ',
    titleVariants: [
      'เครื่องคำนวณค่าภาษีรถยนต์ 2569 [ประจำปี-พ.ร.บ.-ส่วนลด]',
      'ภาษีรถยนต์ 2569 คำนวณเท่าไร ทุกประเภทรถ',
    ],
  },
  '/คำนวณค่าประกันรถยนต์/': {
    title: 'คำนวณประกันรถยนต์ 2569 | ชั้น 1 2+ 3+ ราคาเท่าไร',
    description: 'คำนวณประกันรถยนต์ชั้น 1, 2+, 3+ ตามมูลค่ารถ อายุรถ และผู้ขับ พร้อมลิงก์ดูข้อเสนอหลังคำนวณ',
    titleVariants: [
      'เครื่องคำนวณเบี้ยประกันรถยนต์ ชั้น 1 2+ 3+',
      'ประกันรถยนต์ชั้นไหนดี คำนวณเบี้ยก่อนซื้อ',
    ],
  },
  '/คำนวณเบี้ยประกันรถยนต์/': {
    title: 'คำนวณเบี้ยประกันรถยนต์ 2569 | เทียบชั้น 1 2+ 3+',
    description: 'ประมาณเบี้ยประกันรถยนต์จากมูลค่ารถ อายุรถ ผู้ขับ และประวัติเคลม เทียบชั้น 1, 2+, 3+ ฟรี',
    titleVariants: [
      'เบี้ยประกันรถยนต์เท่าไร คำนวณจากมูลค่ารถ',
      'คำนวณเบี้ยประกันรถ ชั้น 1 2+ 3+ ฟรี',
    ],
  },
  '/คำนวณ-bmi/': {
    title: 'คำนวณ BMI 2569 | BMI 23 25 30 หมายความว่าอะไร',
    description: 'คำนวณ BMI ดัชนีมวลกายตามเกณฑ์เอเชีย พร้อมคำตอบ BMI 23, BMI 25, BMI 30 และน้ำหนักที่เหมาะสม',
    titleVariants: [
      'เครื่องคำนวณ BMI ดัชนีมวลกาย [ปกติ-น้อยเกิน-เกินปกติ]',
      'BMI คำนวณตัวเอง ดูว่าปกติหรือเกิน',
    ],
  },
  '/คำนวณเงินเดือนสุทธิ/': {
    title: 'คำนวณเงินเดือนสุทธิ 2569 | 30000 50000 รับจริงเท่าไร',
    description: 'คำนวณเงินเดือนสุทธิหลังหักภาษีและประกันสังคม พร้อมคำตอบเงินเดือน 20000, 30000, 50000 เสียภาษีและรับจริงเท่าไร',
    titleVariants: [
      'เครื่องคำนวณเงินเดือนสุทธิ [ภาษี-ประกัน-ลดหย่อน]',
      'เงินเดือนสุทธิเท่าไร หลังหักภาษี ประกันสังคม',
    ],
  },
  '/คำนวณค่าโอที/': {
    title: 'คำนวณค่าโอที 2569 | OT 1.5 2 3 เท่า จากเงินเดือน',
    description: 'คำนวณค่าโอทีจากเงินเดือนจริง สูตร OT 1.5 เท่า 2 เท่า 3 เท่า พร้อมตัวอย่างเงินเดือน 15000 และ 30000',
    titleVariants: [
      'เครื่องคำนวณ OT 1.5 2 3 เท่า ตามกฎหมายแรงงาน',
      'โอที 3 เท่า คิดยังไง คำนวณจากเงินเดือน',
    ],
  },
  '/คำนวณอายุ/': {
    title: 'คำนวณอายุวันนี้ 2569 | เกิดปีไหนอายุเท่าไร',
    description: 'คำนวณอายุจากวันเกิดเป็นปี เดือน วัน รองรับ พ.ศ./ค.ศ. พร้อมคำตอบเกิดปี 2530, 2540, 2545 อายุเท่าไร',
    titleVariants: [
      'คำนวณอายุจากวันเกิด วันนี้ ปี เดือน วัน',
      'เกิดปี 2540 2545 อายุเท่าไร 2569',
    ],
  },
  '/คำนวณเปอร์เซ็นต์/': {
    title: 'คำนวณเปอร์เซ็นต์ | ส่วนลด 20% 30% คิดยังไง',
    description: 'คำนวณเปอร์เซ็นต์ ส่วนลด กำไร และเปอร์เซ็นต์เพิ่มลด พร้อมคำตอบ 20% ของ 1000 และส่วนลด 30% คิดยังไง',
    titleVariants: [
      'เครื่องคำนวณส่วนลด เปอร์เซ็นต์ เพิ่มลด ฟรี',
      '20 เปอร์เซ็นต์ของ 1000 เท่าไร ส่วนลด 30% คิดยังไง',
    ],
  },
};

/**
 * Generate keyword-optimized title for a calculator
 * Falls back to humanized version of URL if not in map
 */
export function generateOptimizedTitle(
  calculatorHref: string,
  useVariant?: number
): string {
  const optimization = metaTagOptimizations[calculatorHref];

  if (!optimization) {
    return extractCalculatorTitle(calculatorHref);
  }

  if (useVariant !== undefined && optimization.titleVariants) {
    return optimization.titleVariants[useVariant % optimization.titleVariants.length];
  }

  return optimization.title;
}

/**
 * Generate keyword-optimized description for a calculator
 */
export function generateOptimizedDescription(
  calculatorHref: string
): string {
  const optimization = metaTagOptimizations[calculatorHref];

  if (!optimization) {
    return `เครื่องคำนวณออนไลน์ฟรี ${extractCalculatorTitle(calculatorHref).toLowerCase()}`;
  }

  return optimization.description;
}

/**
 * Helper: extract calculator title from href
 */
function extractCalculatorTitle(href: string): string {
  const slug = href
    .replace(/\//g, '')
    .replace(/\-/g, ' ')
    .replace(/[^a-zก-๙\s]/gi, '');
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Get title A/B test variants for a calculator
 */
export function getTitleVariants(
  calculatorHref: string
): string[] {
  const optimization = metaTagOptimizations[calculatorHref];
  const base = generateOptimizedTitle(calculatorHref);

  if (!optimization?.titleVariants) {
    return [base];
  }

  return [base, ...optimization.titleVariants];
}

/**
 * Auto-generate description based on calculator type
 */
function generateAutoDescription(calculatorHref: string): string {
  const href = calculatorHref.toLowerCase();

  // Tax calculators
  if (href.includes('ภาษี') || href.includes('tax') || href.includes('vat')) {
    return `คำนวณภาษีออนไลน์ฟรี - ผลลัพธ์ทันที ไม่ต้องสมัครสมาชิก อัปเดตเกณฑ์ปี 2569`;
  }
  // Loan/finance calculators
  if (href.includes('ผ่อน') || href.includes('สินเชื่อ') || href.includes('กู้')) {
    return `คำนวณค่างวดและสินเชื่อ พร้อมตารางผ่อนชำระ ใช้งานฟรี ผลลัพธ์ทันที`;
  }
  // Investment/savings
  if (href.includes('ลงทุน') || href.includes('ออม') || href.includes('ดอกเบี้ย')) {
    return `คำนวณผลตอบแทนการลงทุน เงินออมและดอกเบี้ยทบต้น ใช้ฟรี`;
  }
  // Health calculators
  if (href.includes('bmi') || href.includes('สุขภาพ')) {
    return `เครื่องคำนวณสุขภาพออนไลน์ฟรี พร้อมค่าปกติและคำแนะนำ ผลลัพธ์ทันที`;
  }
  // Real estate
  if (href.includes('บ้าน') || href.includes('อสังหา')) {
    return `คำนวณค่าโอนบ้านและสินทรัพย์ อัตราภาษีตัวเรียลถูก ใช้ฟรี`;
  }
  // Salary/HR
  if (href.includes('เงินเดือน') || href.includes('ค่าแรง') || href.includes('โบนัส')) {
    return `คำนวณเงินเดือนสุทธิ หลังหักภาษีและประกันสังคม ใช้งานฟรี`;
  }
  // Vehicle
  if (href.includes('รถ') || href.includes('vehicle') || href.includes('car')) {
    return `คำนวณค่าภาษีรถยนต์ ค่าประกัน และค่าใช้จ่ายรถ ใช้งานฟรี`;
  }
  // Math/utility
  if (href.includes('คณิต') || href.includes('math') || href.includes('เปอร์เซ็นต์')) {
    return `เครื่องคำนวณคณิตศาสตร์ออนไลน์ฟรี รองรับเปอร์เซ็นต์ ดอกเบี้ย และการแปลง`;
  }
  // Business
  if (href.includes('ธุรกิจ') || href.includes('กำไร') || href.includes('ต้นทุน')) {
    return `เครื่องคำนวณธุรกิจ กำไร ขาดทุน และราคาขาย ใช้งานฟรี`;
  }

  // Default fallback
  return `เครื่องคำนวณออนไลน์ฟรี ${extractCalculatorTitle(calculatorHref).toLowerCase()} - ผลลัพธ์ทันที ไม่ต้องสมัครสมาชิก`;
}

/**
 * Batch generate meta tags for multiple calculators
 * Uses optimized map if available, falls back to auto-generation
 */
export function generateBatchMetaTags(
  calculatorHrefs: string[]
): Record<string, { title: string; description: string }> {
  const result: Record<string, { title: string; description: string }> = {};

  for (const href of calculatorHrefs) {
    const optimization = metaTagOptimizations[href];

    result[href] = {
      title: optimization?.title || generateOptimizedTitle(href),
      description: optimization?.description || generateAutoDescription(href),
    };
  }

  return result;
}
