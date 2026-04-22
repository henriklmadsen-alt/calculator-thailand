export interface PhotographyInput {
  cameraBodyCost: number;
  lensCost: number;
  tripodCost: number;
  lightersCost: number;
  memoryCost: number;
  otherEquipmentCost: number;
  editingSoftwareCost: number;
  monthlySessionsTargeted: number;
  pricePerSession: number;
}

export interface PhotographyResult {
  totalEquipmentCost: number;
  monthlyRevenue: number;
  monthlyCost: number; // software, maintenance
  monthlyProfit: number;
  breakEvenMonths: number;
  roiPercentage: number;
}

export function calculatePhotographyROI(input: PhotographyInput): PhotographyResult {
  const totalEquipmentCost = Math.round(
    input.cameraBodyCost + input.lensCost + input.tripodCost + input.lightersCost + input.memoryCost + input.otherEquipmentCost + input.editingSoftwareCost
  );
  const monthlyRevenue = Math.round(input.monthlySessionsTargeted * input.pricePerSession);
  const monthlyCost = Math.round(totalEquipmentCost / 24); // 2-year depreciation
  const monthlyProfit = Math.round(monthlyRevenue - monthlyCost);
  const breakEvenMonths = monthlyProfit > 0 ? Math.round(totalEquipmentCost / monthlyProfit) : 999;
  const roiPercentage = monthlyProfit > 0 ? Math.round((monthlyProfit * 12 / totalEquipmentCost) * 100) : 0;

  return {
    totalEquipmentCost,
    monthlyRevenue,
    monthlyCost,
    monthlyProfit,
    breakEvenMonths,
    roiPercentage,
  };
}

export const EXAMPLE_1 = calculatePhotographyROI({
  cameraBodyCost: 15000,
  lensCost: 8000,
  tripodCost: 2000,
  lightersCost: 3000,
  memoryCost: 2000,
  otherEquipmentCost: 2000,
  editingSoftwareCost: 3000,
  monthlySessionsTargeted: 4,
  pricePerSession: 5000,
});

export const EXAMPLE_2 = calculatePhotographyROI({
  cameraBodyCost: 25000,
  lensCost: 15000,
  tripodCost: 3000,
  lightersCost: 5000,
  memoryCost: 3000,
  otherEquipmentCost: 4000,
  editingSoftwareCost: 4000,
  monthlySessionsTargeted: 8,
  pricePerSession: 7000,
});

export const EXAMPLE_3 = calculatePhotographyROI({
  cameraBodyCost: 20000,
  lensCost: 12000,
  tripodCost: 2500,
  lightersCost: 4000,
  memoryCost: 2500,
  otherEquipmentCost: 3000,
  editingSoftwareCost: 3500,
  monthlySessionsTargeted: 6,
  pricePerSession: 6000,
});
