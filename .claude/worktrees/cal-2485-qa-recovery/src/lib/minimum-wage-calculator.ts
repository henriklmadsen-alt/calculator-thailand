/**
 * Thai Minimum Wage Calculator
 * Based on: ประกาศคณะกรรมการค่าจ้าง เรื่อง อัตราค่าจ้างขั้นต่ำ (ฉบับที่ 14)
 * Effective: 1 July 2568 (2025)
 * Source: https://www.mol.go.th/อัตราค่าจ้างขั้นต่ำ
 */

export interface ProvinceRate {
  name: string;
  dailyRate: number;
  zone?: string;
}

export interface MinimumWageInput {
  provinceIndex: number;
  workingDaysPerMonth: number;
  includeOt: boolean;
  weekdayOtHours: number;
  holidayWorkHours: number;
  holidayOtHours: number;
}

export interface MinimumWageResult {
  dailyWage: number;
  monthlyWage: number;
  hourlyRate: number;
  weekdayOtPay: number;
  holidayWorkPay: number;
  holidayOtPay: number;
  totalOtPay: number;
  totalMonthlyIncome: number;
}

export const PROVINCE_RATES: ProvinceRate[] = [
  // 400 บาท/วัน
  { name: 'กรุงเทพมหานคร', dailyRate: 400 },
  { name: 'ฉะเชิงเทรา', dailyRate: 400 },
  { name: 'ชลบุรี', dailyRate: 400 },
  { name: 'ภูเก็ต', dailyRate: 400 },
  { name: 'ระยอง', dailyRate: 400 },
  { name: 'สุราษฎร์ธานี (อ.เกาะสมุย)', dailyRate: 400, zone: 'เกาะสมุย' },
  // 380 บาท/วัน
  { name: 'เชียงใหม่ (อ.เมือง)', dailyRate: 380, zone: 'อ.เมือง' },
  { name: 'สงขลา (อ.หาดใหญ่)', dailyRate: 380, zone: 'หาดใหญ่' },
  // 372 บาท/วัน
  { name: 'นครปฐม', dailyRate: 372 },
  { name: 'นนทบุรี', dailyRate: 372 },
  { name: 'ปทุมธานี', dailyRate: 372 },
  { name: 'สมุทรปราการ', dailyRate: 372 },
  { name: 'สมุทรสาคร', dailyRate: 372 },
  // 359 บาท/วัน
  { name: 'นครราชสีมา', dailyRate: 359 },
  // 358 บาท/วัน
  { name: 'สมุทรสงคราม', dailyRate: 358 },
  // 357 บาท/วัน
  { name: 'ขอนแก่น', dailyRate: 357 },
  { name: 'เชียงใหม่ (นอก อ.เมือง)', dailyRate: 357, zone: 'นอก อ.เมือง' },
  { name: 'ประจวบคีรีขันธ์', dailyRate: 357 },
  { name: 'พระนครศรีอยุธยา', dailyRate: 357 },
  { name: 'สระบุรี', dailyRate: 357 },
  // 356 บาท/วัน
  { name: 'ลพบุรี', dailyRate: 356 },
  // 355 บาท/วัน
  { name: 'นครนายก', dailyRate: 355 },
  { name: 'สุพรรณบุรี', dailyRate: 355 },
  { name: 'หนองคาย', dailyRate: 355 },
  // 354 บาท/วัน
  { name: 'กระบี่', dailyRate: 354 },
  { name: 'ตราด', dailyRate: 354 },
  // 352 บาท/วัน
  { name: 'กาญจนบุรี', dailyRate: 352 },
  { name: 'จันทบุรี', dailyRate: 352 },
  { name: 'เชียงราย', dailyRate: 352 },
  { name: 'ตาก', dailyRate: 352 },
  { name: 'นครพนม', dailyRate: 352 },
  { name: 'บุรีรัมย์', dailyRate: 352 },
  { name: 'ปราจีนบุรี', dailyRate: 352 },
  { name: 'พังงา', dailyRate: 352 },
  { name: 'พิษณุโลก', dailyRate: 352 },
  { name: 'มุกดาหาร', dailyRate: 352 },
  { name: 'สกลนคร', dailyRate: 352 },
  { name: 'สงขลา (นอก อ.หาดใหญ่)', dailyRate: 352, zone: 'นอก อ.หาดใหญ่' },
  { name: 'สระแก้ว', dailyRate: 352 },
  { name: 'สุราษฎร์ธานี (นอก อ.เกาะสมุย)', dailyRate: 352, zone: 'นอก อ.เกาะสมุย' },
  { name: 'อุบลราชธานี', dailyRate: 352 },
  // 351 บาท/วัน
  { name: 'ชุมพร', dailyRate: 351 },
  { name: 'เพชรบุรี', dailyRate: 351 },
  { name: 'สุรินทร์', dailyRate: 351 },
  // 350 บาท/วัน
  { name: 'นครสวรรค์', dailyRate: 350 },
  { name: 'ยโสธร', dailyRate: 350 },
  { name: 'ลำพูน', dailyRate: 350 },
  // 349 บาท/วัน
  { name: 'กาฬสินธุ์', dailyRate: 349 },
  { name: 'นครศรีธรรมราช', dailyRate: 349 },
  { name: 'บึงกาฬ', dailyRate: 349 },
  { name: 'เพชรบูรณ์', dailyRate: 349 },
  { name: 'ร้อยเอ็ด', dailyRate: 349 },
  // 348 บาท/วัน
  { name: 'ชัยนาท', dailyRate: 348 },
  { name: 'ชัยภูมิ', dailyRate: 348 },
  { name: 'พัทลุง', dailyRate: 348 },
  { name: 'สิงห์บุรี', dailyRate: 348 },
  { name: 'อ่างทอง', dailyRate: 348 },
  // 347 บาท/วัน
  { name: 'กำแพงเพชร', dailyRate: 347 },
  { name: 'พิจิตร', dailyRate: 347 },
  { name: 'มหาสารคาม', dailyRate: 347 },
  { name: 'แม่ฮ่องสอน', dailyRate: 347 },
  { name: 'ระนอง', dailyRate: 347 },
  { name: 'ราชบุรี', dailyRate: 347 },
  { name: 'ลำปาง', dailyRate: 347 },
  { name: 'เลย', dailyRate: 347 },
  { name: 'ศรีสะเกษ', dailyRate: 347 },
  { name: 'สตูล', dailyRate: 347 },
  { name: 'สุโขทัย', dailyRate: 347 },
  { name: 'หนองบัวลำภู', dailyRate: 347 },
  { name: 'อำนาจเจริญ', dailyRate: 347 },
  { name: 'อุดรธานี', dailyRate: 347 },
  { name: 'อุตรดิตถ์', dailyRate: 347 },
  { name: 'อุทัยธานี', dailyRate: 347 },
  // 345 บาท/วัน
  { name: 'ตรัง', dailyRate: 345 },
  { name: 'น่าน', dailyRate: 345 },
  { name: 'พะเยา', dailyRate: 345 },
  { name: 'แพร่', dailyRate: 345 },
  // 337 บาท/วัน
  { name: 'นราธิวาส', dailyRate: 337 },
  { name: 'ปัตตานี', dailyRate: 337 },
  { name: 'ยะลา', dailyRate: 337 },
];

const STANDARD_HOURS_PER_DAY = 8;

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateMinimumWage(input: MinimumWageInput): MinimumWageResult {
  const province = PROVINCE_RATES[input.provinceIndex];
  if (!province) {
    throw new Error('Invalid province index');
  }

  const dailyWage = province.dailyRate;
  const monthlyWage = roundCurrency(dailyWage * input.workingDaysPerMonth);
  const hourlyRate = roundCurrency(dailyWage / STANDARD_HOURS_PER_DAY);

  let weekdayOtPay = 0;
  let holidayWorkPay = 0;
  let holidayOtPay = 0;

  if (input.includeOt) {
    weekdayOtPay = roundCurrency(hourlyRate * 1.5 * input.weekdayOtHours);
    holidayWorkPay = roundCurrency(hourlyRate * 2 * input.holidayWorkHours);
    holidayOtPay = roundCurrency(hourlyRate * 3 * input.holidayOtHours);
  }

  const totalOtPay = roundCurrency(weekdayOtPay + holidayWorkPay + holidayOtPay);
  const totalMonthlyIncome = roundCurrency(monthlyWage + totalOtPay);

  return {
    dailyWage,
    monthlyWage,
    hourlyRate,
    weekdayOtPay,
    holidayWorkPay,
    holidayOtPay,
    totalOtPay,
    totalMonthlyIncome,
  };
}
