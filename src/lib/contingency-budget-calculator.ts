export interface ContingencyBudgetInput {
  estimatedCost: number;
  contingencyPercent: number;
}

export interface ContingencyBudgetResult {
  estimatedCost: number;
  contingencyPercent: number;
  result: number;
}

export function calculateContingencyBudget(input: ContingencyBudgetInput): ContingencyBudgetResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    estimatedCost: input.estimatedCost,
    contingencyPercent: input.contingencyPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateContingencyBudget({
  estimatedCost: 500000, contingencyPercent: 15,
});

export const EXAMPLE_2 = calculateContingencyBudget({
  estimatedCost: 800000, contingencyPercent: 15,
});

export const EXAMPLE_3 = calculateContingencyBudget({
  estimatedCost: 650000, contingencyPercent: 15,
});

