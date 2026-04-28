export interface TotalEventBudgetInput {
  venueCost: number;
  cateringCost: number;
  decorationCost: number;
  entertainmentCost: number;
  equipmentRentalCost: number;
  staffServiceCost: number;
  photographyCost: number;
  transportationCost: number;
  insuranceCost?: number;
  miscellaneousCost?: number;
  contingencyPercentage?: number;
}

export interface TotalEventBudgetResult {
  subtotalCost: number;
  contingencyAmount: number;
  totalEventBudget: number;
  categoryBreakdown: Record<string, number>;
}

export function calculateTotalEventBudget(input: TotalEventBudgetInput): TotalEventBudgetResult {
  const subtotalCost = Math.round(
    input.venueCost +
    input.cateringCost +
    input.decorationCost +
    input.entertainmentCost +
    input.equipmentRentalCost +
    input.staffServiceCost +
    input.photographyCost +
    input.transportationCost +
    (input.insuranceCost || 0) +
    (input.miscellaneousCost || 0)
  );

  const contingencyPercentage = input.contingencyPercentage || 10;
  const contingencyAmount = Math.round(subtotalCost * (contingencyPercentage / 100));
  const totalEventBudget = Math.round(subtotalCost + contingencyAmount);

  const categoryBreakdown = {
    venue: subtotalCost > 0 ? Math.round((input.venueCost / subtotalCost) * 100) : 0,
    catering: subtotalCost > 0 ? Math.round((input.cateringCost / subtotalCost) * 100) : 0,
    decoration: subtotalCost > 0 ? Math.round((input.decorationCost / subtotalCost) * 100) : 0,
    entertainment: subtotalCost > 0 ? Math.round((input.entertainmentCost / subtotalCost) * 100) : 0,
    equipment: subtotalCost > 0 ? Math.round((input.equipmentRentalCost / subtotalCost) * 100) : 0,
    staff: subtotalCost > 0 ? Math.round((input.staffServiceCost / subtotalCost) * 100) : 0,
    photography: subtotalCost > 0 ? Math.round((input.photographyCost / subtotalCost) * 100) : 0,
    transportation: subtotalCost > 0 ? Math.round((input.transportationCost / subtotalCost) * 100) : 0,
  };

  return {
    subtotalCost,
    contingencyAmount,
    totalEventBudget,
    categoryBreakdown,
  };
}

export const EXAMPLE_1 = calculateTotalEventBudget({
  venueCost: 15000,
  cateringCost: 20000,
  decorationCost: 8000,
  entertainmentCost: 5000,
  equipmentRentalCost: 7000,
  staffServiceCost: 6000,
  photographyCost: 4000,
  transportationCost: 3000,
  miscellaneousCost: 2000,
  contingencyPercentage: 10,
});

export const EXAMPLE_2 = calculateTotalEventBudget({
  venueCost: 30000,
  cateringCost: 50000,
  decorationCost: 15000,
  entertainmentCost: 10000,
  equipmentRentalCost: 12000,
  staffServiceCost: 10000,
  photographyCost: 8000,
  transportationCost: 5000,
  insuranceCost: 3000,
  miscellaneousCost: 4000,
  contingencyPercentage: 10,
});

export const EXAMPLE_3 = calculateTotalEventBudget({
  venueCost: 50000,
  cateringCost: 100000,
  decorationCost: 30000,
  entertainmentCost: 20000,
  equipmentRentalCost: 25000,
  staffServiceCost: 20000,
  photographyCost: 15000,
  transportationCost: 10000,
  insuranceCost: 5000,
  miscellaneousCost: 10000,
  contingencyPercentage: 15,
});
