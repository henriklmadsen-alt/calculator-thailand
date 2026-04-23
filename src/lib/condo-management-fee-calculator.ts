export interface CondoManagementFeeInput {
  baseManagementFee: number;
  commonAreaFee: number;
  reserveFundPercent: number;
  specialAssessmentAnnual: number;
}

export interface CondoManagementFeeResult {
  baseManagementFee: number;
  commonAreaFee: number;
  reserveFundPercent: number;
  specialAssessmentAnnual: number;
  result: number;
}

export function calculateCondoManagementFee(input: CondoManagementFeeInput): CondoManagementFeeResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    baseManagementFee: input.baseManagementFee,
    commonAreaFee: input.commonAreaFee,
    reserveFundPercent: input.reserveFundPercent,
    specialAssessmentAnnual: input.specialAssessmentAnnual,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateCondoManagementFee({
  baseManagementFee: 2500, commonAreaFee: 1500, reserveFundPercent: 10, specialAssessmentAnnual: 5000,
});

export const EXAMPLE_2 = calculateCondoManagementFee({
  baseManagementFee: 5000, commonAreaFee: 3000, reserveFundPercent: 12, specialAssessmentAnnual: 10000,
});

export const EXAMPLE_3 = calculateCondoManagementFee({
  baseManagementFee: 3500, commonAreaFee: 2000, reserveFundPercent: 11, specialAssessmentAnnual: 7500,
});

