/**
 * Input Field Tooltip Content
 * Maps calculator ID + field name → Thai explanation
 *
 * Usage:
 *   const text = getFieldTooltip('apr', 'principal');
 *   // Returns: "เงินที่ยืมจากธนาคาร ตั้งแต่ 10,000 บาทขึ้นไป เช่น 500,000"
 */

export type TooltipContent = {
  [calcId: string]: {
    [fieldName: string]: string;
  };
};

export const fieldTooltips: TooltipContent = {
  apr: {
    principal: 'เงินที่คุณยืมจากธนาคาร ตัวอย่าง: 500,000 บาท ซึ่งจะต้องคืนตัดจ่ายหรือตามสัญญา',
    'monthly-payment': 'จำนวนเงินที่คุณจ่ายต่อเดือน รวมดอกเบี้ย + ค่าธรรมเนียม ตัวอย่าง: 11,000 บาท',
    'term-months': 'ระยะเวลาการยืม นับเป็นจำนวนเดือน ตัวอย่าง: 60 เดือน = 5 ปี',
    'other-fees': 'ค่าธรรมเนียมอื่นทั้งหมด เช่น ค่าจัดการสินเชื่อ ค่าประเมินหลักประกัน ตัวอย่าง: 5,000 บาท (ถ้าไม่มี ให้ใส่ 0)',
    'insurance': 'ค่าประกันชีวิต หรือประกันสินเชื่อที่บังคับซื้อพร้อมสินเชื่อ ตัวอย่าง: 10,000 บาท (ถ้าไม่มี ให้ใส่ 0)',
  },
  mortgage: {
    'home-price': 'ราคาบ้าน หรือ ราคาทั้งหลังที่คุณจะซื้อ ตัวอย่าง: 2,500,000 บาท',
    'down-payment': 'เงินดาวน์ที่คุณจะจ่ายตอนนี้ มักจะ 20-30% ของราคา ตัวอย่าง: 500,000 บาท',
    'loan-amount': 'เงินที่ต้องการยืม = ราคาบ้าน - เงินดาวน์ ตัวอย่าง: 2,000,000 บาท',
    'interest-rate': 'อัตราดอกเบี้ยต่อปี ตั้งแต่แบงก์ สูงสุด ~4-5% ตัวอย่าง: 3.5',
    'loan-term': 'ระยะเวลาการยืม นับเป็นปี ทั่วไป 15-25 ปี ตัวอย่าง: 20',
  },
  'vehicle-loan': {
    'vehicle-price': 'ราคารถที่คุณจะซื้อจากดีลเลอร์ ตัวอย่าง: 750,000 บาท',
    'down-payment': 'เงินดาวน์ที่จ่ายตอนนี้ มักจะ 10-30% ของราคา ตัวอย่าง: 150,000 บาท',
    'interest-rate': 'อัตราดอกเบี้ยต่อปี (~2-5% ขึ้นอยู่กับธนาคาร) ตัวอย่าง: 3.5',
    'loan-term': 'ระยะเวลาการยืม (ปี) ทั่วไป 3-7 ปี ตัวอย่าง: 5',
    'insurance-cost': 'ค่าประกันรถภาคบังคับ ปีละ ตัวอย่าง: 8,000 บาท (ถ้าไม่รู้ ให้ปล่อยว่าง)',
  },
  salary: {
    'gross-income': 'เงินเดือนหรือรายได้รวมต่อปี ก่อนหักภาษีและหักบัญชี ตัวอย่าง: 400,000 บาท',
    'dependents': 'จำนวนคนที่คุณเลี้ยงดู (ลูก หรือสมาชิกครอบครัว) ตัวอย่าง: 2 คน ช่วยลดภาษี',
    'deductions': 'การลดหย่อนหรือการหักชำระ เช่น ประกันสังคม อื่นๆ ตัวอย่าง: 20,000 บาท',
    'donations': 'เงินบริจาคที่คุณให้แก่องค์กรสาธารณะ สูงสุด 10% ของรายได้ ตัวอย่าง: 10,000 บาท',
  },
  bmi: {
    weight: 'น้ำหนักของคุณ วัดเป็นกิโลกรัม (kg) ตัวอย่าง: 70 kg',
    height: 'ส่วนสูงของคุณ วัดเป็นเซนติเมตร (cm) ตัวอย่าง: 170 cm',
  },
  'electricity-usage': {
    'monthly-bill': 'ค่าไฟฟ้าที่จ่ายต่อเดือน ดูจากใบเสร็จ ตัวอย่าง: 1,500 บาท',
    'usage-kwh': 'การใช้พลังงาน หน่วย กิโลวัตต์ชั่วโมง (kWh) ดูจากใบเสร็จ ตัวอย่าง: 250 kWh',
    'price-per-unit': 'ราคาต่อหน่วย = ค่าไฟรวม ÷ หน่วยที่ใช้ ตัวอย่าง: 6 บาท/kWh',
  },
  savings: {
    'initial-amount': 'เงินต้นที่ฝากเป็นครั้งแรก ตัวอย่าง: 100,000 บาท',
    'monthly-deposit': 'เงินที่ฝากเพิ่มเติมต่อเดือน ตัวอย่าง: 5,000 บาท',
    'interest-rate': 'อัตราดอกเบี้ยต่อปี (~2-3% สำหรับบัญชีเงินฝาก) ตัวอย่าง: 2.5',
    'years': 'จำนวนปีที่คุณต้องการเก็บออม ตัวอย่าง: 10 ปี',
  },
};

/**
 * Get tooltip text for a specific field in a calculator
 * @param calcId - Calculator identifier (e.g., 'apr', 'mortgage')
 * @param fieldName - Input field name (e.g., 'principal', 'interest-rate')
 * @returns Thai explanation text, or empty string if not found
 */
export function getFieldTooltip(calcId: string, fieldName: string): string {
  return fieldTooltips[calcId]?.[fieldName] ?? '';
}

/**
 * Check if a field has a tooltip
 * @param calcId - Calculator identifier
 * @param fieldName - Input field name
 * @returns true if tooltip exists, false otherwise
 */
export function hasFieldTooltip(calcId: string, fieldName: string): boolean {
  return Boolean(fieldTooltips[calcId]?.[fieldName]);
}

/**
 * Get all tooltips for a calculator
 * @param calcId - Calculator identifier
 * @returns Object mapping field names to explanations
 */
export function getCalculatorTooltips(calcId: string): { [fieldName: string]: string } {
  return fieldTooltips[calcId] ?? {};
}
