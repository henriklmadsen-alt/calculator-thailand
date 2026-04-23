export interface ContractorLaborCostInput {
  skillLevel: number;
  daysRequired: number;
  numberOfWorkers: number;
}

export interface ContractorLaborCostResult {
  skillLevel: number;
  daysRequired: number;
  numberOfWorkers: number;
  result: number;
}

export function calculateContractorLaborCost(input: ContractorLaborCostInput): ContractorLaborCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    skillLevel: input.skillLevel,
    daysRequired: input.daysRequired,
    numberOfWorkers: input.numberOfWorkers,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateContractorLaborCost({
  skillLevel: 1, daysRequired: 20, numberOfWorkers: 3,
});

export const EXAMPLE_2 = calculateContractorLaborCost({
  skillLevel: 2, daysRequired: 30, numberOfWorkers: 4,
});

export const EXAMPLE_3 = calculateContractorLaborCost({
  skillLevel: 1, daysRequired: 25, numberOfWorkers: 3,
});

