export interface HomeRenovationBudgetInput {
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  contingencyPercent: number;
}

export interface HomeRenovationBudgetResult {
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  contingencyPercent: number;
  result: number;
}

export function calculateHomeRenovationBudget(input: HomeRenovationBudgetInput): HomeRenovationBudgetResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    materialCost: input.materialCost,
    laborCost: input.laborCost,
    equipmentCost: input.equipmentCost,
    contingencyPercent: input.contingencyPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateHomeRenovationBudget({
  materialCost: 150000, laborCost: 100000, equipmentCost: 30000, contingencyPercent: 15,
});

export const EXAMPLE_2 = calculateHomeRenovationBudget({
  materialCost: 250000, laborCost: 180000, equipmentCost: 50000, contingencyPercent: 15,
});

export const EXAMPLE_3 = calculateHomeRenovationBudget({
  materialCost: 200000, laborCost: 150000, equipmentCost: 40000, contingencyPercent: 15,
});

