/**
 * Thai Farm Equipment ROI Calculator
 * Sources: Thai Agricultural Engineering Department, Equipment Rental Rates
 */

export type EquipmentType = 'tractor' | 'thresher' | 'pumpset';

export interface FarmEquipmentInput {
  equipmentType: EquipmentType;
  purchaseCost: number;
  annualUsageDays: number; // Days per year the equipment is used
  rentalRatePerDay: number; // Daily rental rate if owned equipment is rented out
}

export interface FarmEquipmentResult {
  equipmentType: EquipmentType;
  equipmentTypeName: string;
  purchaseCost: number;
  annualUsageDays: number;
  rentalRatePerDay: number;

  annualMaintenanceCost: number;
  annualDepreciationCost: number;
  totalAnnualOwnershipCost: number;

  annualRentalIncome: number;
  netAnnualCost: number;
  paybackPeriod: number; // years
  roiPercentage: number;
}

const EQUIPMENT_NAMES: Record<EquipmentType, string> = {
  tractor: 'แทรกเตอร์',
  thresher: 'เครื่องแยงข้าว',
  pumpset: 'เครื่องสูบน้ำ',
};

export function calculateFarmEquipmentROI(input: FarmEquipmentInput): FarmEquipmentResult {
  // Annual maintenance: 10% of purchase cost
  const annualMaint = input.purchaseCost * 0.1;

  // Depreciation over 10 years (10% per year)
  const annualDepreciation = input.purchaseCost / 10;

  const totalOwnershipCost = annualMaint + annualDepreciation;

  // Annual rental income
  const annualRentalIncome = input.annualUsageDays * input.rentalRatePerDay;

  const netAnnualCost = totalOwnershipCost - annualRentalIncome;
  const payback = netAnnualCost > 0 ? input.purchaseCost / annualRentalIncome : 0;
  const roi = annualRentalIncome > 0 ? (annualRentalIncome / input.purchaseCost) * 100 : 0;

  return {
    equipmentType: input.equipmentType,
    equipmentTypeName: EQUIPMENT_NAMES[input.equipmentType],
    purchaseCost: Math.round(input.purchaseCost),
    annualUsageDays: input.annualUsageDays,
    rentalRatePerDay: Math.round(input.rentalRatePerDay),
    annualMaintenanceCost: Math.round(annualMaint),
    annualDepreciationCost: Math.round(annualDepreciation),
    totalAnnualOwnershipCost: Math.round(totalOwnershipCost),
    annualRentalIncome: Math.round(annualRentalIncome),
    netAnnualCost: Math.round(netAnnualCost),
    paybackPeriod: Math.round(payback * 10) / 10,
    roiPercentage: Math.round(roi * 10) / 10,
  };
}

export const EXAMPLE_1 = calculateFarmEquipmentROI({
  equipmentType: 'tractor',
  purchaseCost: 800000,
  annualUsageDays: 120,
  rentalRatePerDay: 2000,
});

export const EXAMPLE_2 = calculateFarmEquipmentROI({
  equipmentType: 'thresher',
  purchaseCost: 150000,
  annualUsageDays: 60,
  rentalRatePerDay: 1000,
});

export const EXAMPLE_3 = calculateFarmEquipmentROI({
  equipmentType: 'pumpset',
  purchaseCost: 50000,
  annualUsageDays: 200,
  rentalRatePerDay: 300,
});
