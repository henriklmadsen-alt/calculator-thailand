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
    title: 'คำนวณ VAT 7% | บวกภาษี ถอดภาษี คำนวณเลข',
    description: 'คำนวณ VAT 7% สูตรบวกภาษี ถอดภาษี ตั้งราคาขายให้ไม่ขาดทุน รองรับหลายรายการ ใช้งานฟรี',
    titleVariants: [
      'เครื่องคำนวณภาษีมูลค่าเพิ่ม VAT 7% [บวก-ถอด-ตั้งราคา]',
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
  '/คำนวณ-bmi/': {
    title: 'คำนวณ BMI | เครื่องคิด BMI ดัชนีมวลกาย ฟรี',
    description: 'คำนวณ BMI (ดัชนีมวลกาย) ปกติ น้อยเกิน เกินปกติ โรค พร้อมค่าน้ำหนักอุดมคติ ผลลัพธ์ทันที',
    titleVariants: [
      'เครื่องคำนวณ BMI ดัชนีมวลกาย [ปกติ-น้อยเกิน-เกินปกติ]',
      'BMI คำนวณตัวเอง ดูว่าปกติหรือเกิน',
    ],
  },
  '/คำนวณเงินเดือนสุทธิ/': {
    title: 'คำนวณเงินเดือนสุทธิ | เงินหลังหักภาษี ประกันสังคม',
    description: 'คำนวณเงินเดือนสุทธิ หลังหักภาษีเงินได้ ประกันสังคม ลดหย่อน ผลลัพธ์รายเดือน ใช้ฟรี',
    titleVariants: [
      'เครื่องคำนวณเงินเดือนสุทธิ [ภาษี-ประกัน-ลดหย่อน]',
      'เงินเดือนสุทธิเท่าไร หลังหักภาษี ประกันสังคม',
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
 * Batch generate meta tags for multiple calculators
 */
export function generateBatchMetaTags(
  calculatorHrefs: string[]
): Record<string, { title: string; description: string }> {
  const result: Record<string, { title: string; description: string }> = {};

  for (const href of calculatorHrefs) {
    result[href] = {
      title: generateOptimizedTitle(href),
      description: generateOptimizedDescription(href),
    };
  }

  return result;
}
