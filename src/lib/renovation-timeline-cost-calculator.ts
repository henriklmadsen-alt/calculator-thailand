export interface RenovationTimelineCostInput {
  projectScope: number;
  daysPerPhase: number;
  numberOfPhases: number;
  dailyLaborCost: number;
}

export interface RenovationTimelineCostResult {
  projectScope: number;
  daysPerPhase: number;
  numberOfPhases: number;
  dailyLaborCost: number;
  result: number;
}

export function calculateRenovationTimelineCost(input: RenovationTimelineCostInput): RenovationTimelineCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    projectScope: input.projectScope,
    daysPerPhase: input.daysPerPhase,
    numberOfPhases: input.numberOfPhases,
    dailyLaborCost: input.dailyLaborCost,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRenovationTimelineCost({
  projectScope: 500000, daysPerPhase: 10, numberOfPhases: 3, dailyLaborCost: 3000,
});

export const EXAMPLE_2 = calculateRenovationTimelineCost({
  projectScope: 800000, daysPerPhase: 15, numberOfPhases: 4, dailyLaborCost: 4000,
});

export const EXAMPLE_3 = calculateRenovationTimelineCost({
  projectScope: 650000, daysPerPhase: 12, numberOfPhases: 3, dailyLaborCost: 3500,
});

