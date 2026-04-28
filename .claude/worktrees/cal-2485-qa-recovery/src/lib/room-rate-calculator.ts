// Room Rate Calculator — คำนวณค่าห้องพัก
// Compares monthly vs daily rates, calculates move-in costs, and total monthly expenses.

export interface RoomRateInput {
  /** Room rate amount in THB */
  roomRate: number;
  /** 'monthly' or 'daily' */
  rateType: 'monthly' | 'daily';
  /** Number of deposit months (typically 1-3) */
  depositMonths: number;
  /** Number of advance rent months (typically 1-2) */
  advanceMonths: number;
  /** Estimated monthly electricity cost */
  electricityCost: number;
  /** Estimated monthly water cost */
  waterCost: number;
  /** Monthly internet cost */
  internetCost: number;
  /** Common area fee / maintenance fee per month */
  commonFee: number;
  /** Other monthly costs (parking, etc.) */
  otherCost: number;
}

export interface RoomRateResult {
  /** Monthly room rate */
  monthlyRate: number;
  /** Daily rate equivalent */
  dailyRate: number;
  /** Deposit amount */
  depositAmount: number;
  /** Advance rent amount */
  advanceAmount: number;
  /** Total move-in cost (deposit + advance) */
  moveInCost: number;
  /** Sum of all utility/extra costs per month */
  totalUtilities: number;
  /** Total monthly cost (room + all utilities) */
  totalMonthlyCost: number;
  /** Total annual cost */
  totalAnnualCost: number;
  /** Breakdown of utility costs */
  utilityBreakdown: UtilityItem[];
}

export interface UtilityItem {
  label: string;
  amount: number;
}

const DAYS_PER_MONTH = 30;

export function calculateRoomRate(input: RoomRateInput): RoomRateResult {
  const {
    roomRate,
    rateType,
    depositMonths,
    advanceMonths,
    electricityCost,
    waterCost,
    internetCost,
    commonFee,
    otherCost,
  } = input;

  // Convert between monthly and daily rates
  const monthlyRate = rateType === 'monthly' ? roomRate : roomRate * DAYS_PER_MONTH;
  const dailyRate = rateType === 'daily' ? roomRate : roomRate / DAYS_PER_MONTH;

  // Move-in costs
  const depositAmount = monthlyRate * depositMonths;
  const advanceAmount = monthlyRate * advanceMonths;
  const moveInCost = depositAmount + advanceAmount;

  // Utility breakdown
  const utilityBreakdown: UtilityItem[] = [];
  if (electricityCost > 0) utilityBreakdown.push({ label: 'ค่าไฟฟ้า', amount: electricityCost });
  if (waterCost > 0) utilityBreakdown.push({ label: 'ค่าน้ำ', amount: waterCost });
  if (internetCost > 0) utilityBreakdown.push({ label: 'ค่าอินเทอร์เน็ต', amount: internetCost });
  if (commonFee > 0) utilityBreakdown.push({ label: 'ค่าส่วนกลาง', amount: commonFee });
  if (otherCost > 0) utilityBreakdown.push({ label: 'ค่าใช้จ่ายอื่น ๆ', amount: otherCost });

  const totalUtilities = electricityCost + waterCost + internetCost + commonFee + otherCost;
  const totalMonthlyCost = monthlyRate + totalUtilities;
  const totalAnnualCost = totalMonthlyCost * 12;

  return {
    monthlyRate,
    dailyRate,
    depositAmount,
    advanceAmount,
    moveInCost,
    totalUtilities,
    totalMonthlyCost,
    totalAnnualCost,
    utilityBreakdown,
  };
}
