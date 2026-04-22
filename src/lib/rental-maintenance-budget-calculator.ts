export interface RentalMaintenanceBudgetInput {
  propertyValue: number;
  maintenancePercentPerYear: number;
}

export interface RentalMaintenanceBudgetResult {
  propertyValue: number;
  maintenancePercentPerYear: number;
  result: number;
}

export function calculateRentalMaintenanceBudget(input: RentalMaintenanceBudgetInput): RentalMaintenanceBudgetResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyValue: input.propertyValue,
    maintenancePercentPerYear: input.maintenancePercentPerYear,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRentalMaintenanceBudget({
  propertyValue: 2500000, maintenancePercentPerYear: 1,
});

export const EXAMPLE_2 = calculateRentalMaintenanceBudget({
  propertyValue: 5000000, maintenancePercentPerYear: 1.2,
});

export const EXAMPLE_3 = calculateRentalMaintenanceBudget({
  propertyValue: 3500000, maintenancePercentPerYear: 1.1,
});

