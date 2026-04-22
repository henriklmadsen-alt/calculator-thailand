export interface TenantScreeningCostInput {
  backgroundCheckCost: number;
  creditCheckCost: number;
  referenceCheckCost: number;
  numberOfApplicants: number;
}

export interface TenantScreeningCostResult {
  backgroundCheckCost: number;
  creditCheckCost: number;
  referenceCheckCost: number;
  numberOfApplicants: number;
  result: number;
}

export function calculateTenantScreeningCost(input: TenantScreeningCostInput): TenantScreeningCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    backgroundCheckCost: input.backgroundCheckCost,
    creditCheckCost: input.creditCheckCost,
    referenceCheckCost: input.referenceCheckCost,
    numberOfApplicants: input.numberOfApplicants,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateTenantScreeningCost({
  backgroundCheckCost: 1500, creditCheckCost: 1000, referenceCheckCost: 500, numberOfApplicants: 3,
});

export const EXAMPLE_2 = calculateTenantScreeningCost({
  backgroundCheckCost: 2000, creditCheckCost: 1500, referenceCheckCost: 750, numberOfApplicants: 5,
});

export const EXAMPLE_3 = calculateTenantScreeningCost({
  backgroundCheckCost: 1800, creditCheckCost: 1200, referenceCheckCost: 600, numberOfApplicants: 4,
});

