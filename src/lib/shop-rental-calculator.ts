// Shop Rental Calculator — คำนวณค่าเช่าร้าน
// Calculates total shop/office rental costs including rent, common area, parking, utilities, and move-in costs.

export interface ShopRentalInput {
  /** Monthly rent in THB */
  monthlyRent: number;
  /** Shop area in square meters (for per-sqm display) */
  areaSqm: number;
  /** Common area fee per month */
  commonAreaFee: number;
  /** Number of parking spaces */
  parkingSpaces: number;
  /** Cost per parking space per month */
  parkingCostPerSpace: number;
  /** Estimated monthly electricity cost */
  electricityCost: number;
  /** Estimated monthly water cost */
  waterCost: number;
  /** Estimated monthly internet/phone cost */
  internetCost: number;
  /** Key money / goodwill (ค่าเซ้ง) — one-time upfront */
  keyMoney: number;
  /** Number of deposit months (typically 2-6 for commercial) */
  depositMonths: number;
  /** Number of advance rent months */
  advanceMonths: number;
  /** Contract length in months (for annual cost projection) */
  contractMonths: number;
  /** Other monthly costs */
  otherCost: number;
}

export interface ShopRentalResult {
  /** Monthly rent */
  monthlyRent: number;
  /** Rent per square meter per month */
  rentPerSqm: number;
  /** Monthly common area fee */
  commonAreaFee: number;
  /** Monthly parking total */
  parkingTotal: number;
  /** Sum of utility costs per month */
  totalUtilities: number;
  /** Total monthly cost (rent + common + parking + utilities + other) */
  totalMonthlyCost: number;
  /** Cost per sqm including all monthly costs */
  totalCostPerSqm: number;
  /** Deposit amount */
  depositAmount: number;
  /** Advance rent amount */
  advanceAmount: number;
  /** Key money */
  keyMoney: number;
  /** Total move-in cost (deposit + advance + key money) */
  moveInCost: number;
  /** Total cost over contract period */
  totalContractCost: number;
  /** Contract length in months */
  contractMonths: number;
  /** Breakdown of monthly costs */
  costBreakdown: CostItem[];
}

export interface CostItem {
  label: string;
  amount: number;
}

export function calculateShopRental(input: ShopRentalInput): ShopRentalResult {
  const {
    monthlyRent,
    areaSqm,
    commonAreaFee,
    parkingSpaces,
    parkingCostPerSpace,
    electricityCost,
    waterCost,
    internetCost,
    keyMoney,
    depositMonths,
    advanceMonths,
    contractMonths,
    otherCost,
  } = input;

  const rentPerSqm = areaSqm > 0 ? monthlyRent / areaSqm : 0;
  const parkingTotal = parkingSpaces * parkingCostPerSpace;
  const totalUtilities = electricityCost + waterCost + internetCost;
  const totalMonthlyCost = monthlyRent + commonAreaFee + parkingTotal + totalUtilities + otherCost;
  const totalCostPerSqm = areaSqm > 0 ? totalMonthlyCost / areaSqm : 0;

  // Move-in costs
  const depositAmount = monthlyRent * depositMonths;
  const advanceAmount = monthlyRent * advanceMonths;
  const moveInCost = depositAmount + advanceAmount + keyMoney;

  // Total contract cost = move-in + (monthly × contract months)
  const totalContractCost = moveInCost + totalMonthlyCost * contractMonths;

  // Cost breakdown
  const costBreakdown: CostItem[] = [];
  if (monthlyRent > 0) costBreakdown.push({ label: 'ค่าเช่ารายเดือน', amount: monthlyRent });
  if (commonAreaFee > 0) costBreakdown.push({ label: 'ค่าส่วนกลาง', amount: commonAreaFee });
  if (parkingTotal > 0) costBreakdown.push({ label: 'ค่าที่จอดรถ', amount: parkingTotal });
  if (electricityCost > 0) costBreakdown.push({ label: 'ค่าไฟฟ้า', amount: electricityCost });
  if (waterCost > 0) costBreakdown.push({ label: 'ค่าน้ำ', amount: waterCost });
  if (internetCost > 0) costBreakdown.push({ label: 'ค่าอินเทอร์เน็ต/โทรศัพท์', amount: internetCost });
  if (otherCost > 0) costBreakdown.push({ label: 'ค่าใช้จ่ายอื่น ๆ', amount: otherCost });

  return {
    monthlyRent,
    rentPerSqm,
    commonAreaFee,
    parkingTotal,
    totalUtilities,
    totalMonthlyCost,
    totalCostPerSqm,
    depositAmount,
    advanceAmount,
    keyMoney,
    moveInCost,
    totalContractCost,
    contractMonths,
    costBreakdown,
  };
}
