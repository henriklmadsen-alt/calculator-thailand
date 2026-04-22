export interface RentalExpenseTrackerInput {
  maintenanceCost: number;
  insuranceCost: number;
  propertyTaxCost: number;
  managementFee: number;
  otherExpenses: number;
}

export interface RentalExpenseTrackerResult {
  maintenanceCost: number;
  insuranceCost: number;
  propertyTaxCost: number;
  managementFee: number;
  otherExpenses: number;
  result: number;
}

export function calculateRentalExpenseTracker(input: RentalExpenseTrackerInput): RentalExpenseTrackerResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    maintenanceCost: input.maintenanceCost,
    insuranceCost: input.insuranceCost,
    propertyTaxCost: input.propertyTaxCost,
    managementFee: input.managementFee,
    otherExpenses: input.otherExpenses,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRentalExpenseTracker({
  maintenanceCost: 2000, insuranceCost: 1500, propertyTaxCost: 1000, managementFee: 2500, otherExpenses: 500,
});

export const EXAMPLE_2 = calculateRentalExpenseTracker({
  maintenanceCost: 4000, insuranceCost: 3000, propertyTaxCost: 2000, managementFee: 5000, otherExpenses: 1000,
});

export const EXAMPLE_3 = calculateRentalExpenseTracker({
  maintenanceCost: 3000, insuranceCost: 2000, propertyTaxCost: 1500, managementFee: 3500, otherExpenses: 750,
});

