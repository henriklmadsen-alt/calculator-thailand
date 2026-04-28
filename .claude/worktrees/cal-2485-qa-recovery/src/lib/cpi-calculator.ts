/**
 * Thai CPI / Inflation Calculator (คำนวณดัชนีราคาผู้บริโภค)
 * Compare purchasing power of Thai Baht across years using CPI data.
 *
 * Data source: สำนักดัชนีเศรษฐกิจการค้า กระทรวงพาณิชย์
 * (Bureau of Trade and Economic Indices, Ministry of Commerce)
 * Base year: พ.ศ. 2562 (2019) = 100
 */

export interface CpiInput {
  amount: number;       // จำนวนเงิน (บาท)
  fromYear: number;     // ปี พ.ศ. ต้นทาง
  toYear: number;       // ปี พ.ศ. ปลายทาง
}

export interface CpiResult {
  amount: number;
  fromYear: number;
  toYear: number;
  fromCpi: number;
  toCpi: number;
  adjustedAmount: number;       // มูลค่าเทียบเท่า
  inflationRate: number;        // อัตราเงินเฟ้อสะสม (%)
  annualizedRate: number;       // อัตราเงินเฟ้อเฉลี่ยต่อปี (%)
  purchasingPowerChange: number; // การเปลี่ยนแปลงอำนาจซื้อ (%)
  yearSpan: number;
}

/**
 * Thai CPI annual averages (ดัชนีราคาผู้บริโภคทั่วไป เฉลี่ยรายปี)
 * Base year: พ.ศ. 2562 (2019) = 100
 * Source: สำนักดัชนีเศรษฐกิจการค้า กระทรวงพาณิชย์
 */
export const THAI_CPI_DATA: Record<number, number> = {
  2536: 58.93,
  2537: 61.90,
  2538: 65.44,
  2539: 69.24,
  2540: 73.10,
  2541: 79.21,
  2542: 79.36,
  2543: 80.30,
  2544: 81.62,
  2545: 82.16,
  2546: 83.57,
  2547: 85.84,
  2548: 89.63,
  2549: 93.35,
  2550: 95.42,
  2551: 100.55,
  2552: 99.56,
  2553: 102.82,
  2554: 106.72,
  2555: 110.00,
  2556: 112.38,
  2557: 114.42,
  2558: 113.49,
  2559: 113.72,
  2560: 114.37,
  2561: 115.46,
  2562: 100.00,  // ปีฐาน (rebased)
  2563: 99.08,
  2564: 100.35,
  2565: 106.36,
  2566: 107.68,
  2567: 108.06,
  2568: 108.83,
};

export function getAvailableYears(): number[] {
  return Object.keys(THAI_CPI_DATA).map(Number).sort((a, b) => a - b);
}

export function getMinYear(): number {
  return Math.min(...getAvailableYears());
}

export function getMaxYear(): number {
  return Math.max(...getAvailableYears());
}

/**
 * Calculate purchasing power adjustment using CPI
 * Formula: Adjusted Amount = Original Amount × (CPI_target / CPI_base)
 */
export function calculateCpi(input: CpiInput): CpiResult | null {
  const { amount, fromYear, toYear } = input;

  const fromCpi = THAI_CPI_DATA[fromYear];
  const toCpi = THAI_CPI_DATA[toYear];

  if (fromCpi == null || toCpi == null || amount <= 0) {
    return null;
  }

  const adjustedAmount = amount * (toCpi / fromCpi);
  const yearSpan = Math.abs(toYear - fromYear);
  const inflationRate = ((toCpi - fromCpi) / fromCpi) * 100;

  let annualizedRate = 0;
  if (yearSpan > 0) {
    annualizedRate = (Math.pow(toCpi / fromCpi, 1 / yearSpan) - 1) * 100;
  }

  const purchasingPowerChange = ((fromCpi - toCpi) / toCpi) * 100;

  return {
    amount,
    fromYear,
    toYear,
    fromCpi,
    toCpi,
    adjustedAmount,
    inflationRate,
    annualizedRate,
    purchasingPowerChange,
    yearSpan,
  };
}

export function formatThaiNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
