export interface InteriorDesignFeeInput {
  projectCost: number;
  designFeePercent: number;
  hoursRequired: number;
  hourlyRate: number;
}

export interface InteriorDesignFeeResult {
  projectCost: number;
  designFeePercent: number;
  hoursRequired: number;
  hourlyRate: number;
  result: number;
}

export function calculateInteriorDesignFee(input: InteriorDesignFeeInput): InteriorDesignFeeResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    projectCost: input.projectCost,
    designFeePercent: input.designFeePercent,
    hoursRequired: input.hoursRequired,
    hourlyRate: input.hourlyRate,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateInteriorDesignFee({
  projectCost: 500000, designFeePercent: 10, hoursRequired: 50, hourlyRate: 800,
});

export const EXAMPLE_2 = calculateInteriorDesignFee({
  projectCost: 800000, designFeePercent: 10, hoursRequired: 80, hourlyRate: 1000,
});

export const EXAMPLE_3 = calculateInteriorDesignFee({
  projectCost: 650000, designFeePercent: 10, hoursRequired: 65, hourlyRate: 900,
});

