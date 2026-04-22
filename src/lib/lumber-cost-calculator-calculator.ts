export interface LumberCostCalculatorInput {
  linearMeters: number;
  costPerMeter: number;
  woodType: number;
  gradeQuality: number;
}

export interface LumberCostCalculatorResult {
  linearMeters: number;
  costPerMeter: number;
  woodType: number;
  gradeQuality: number;
  result: number;
}

export function calculateLumberCostCalculator(input: LumberCostCalculatorInput): LumberCostCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    linearMeters: input.linearMeters,
    costPerMeter: input.costPerMeter,
    woodType: input.woodType,
    gradeQuality: input.gradeQuality,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateLumberCostCalculator({
  linearMeters: 100, costPerMeter: 150, woodType: 1, gradeQuality: 1,
});

export const EXAMPLE_2 = calculateLumberCostCalculator({
  linearMeters: 200, costPerMeter: 250, woodType: 2, gradeQuality: 2,
});

export const EXAMPLE_3 = calculateLumberCostCalculator({
  linearMeters: 150, costPerMeter: 200, woodType: 1, gradeQuality: 1,
});

