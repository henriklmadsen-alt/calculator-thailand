export interface RentalPropertyInsuranceInput {
  propertyValue: number;
  insuranceRatePercent: number;
  liabilityValue: number;
  liabilityRatePercent: number;
}

export interface RentalPropertyInsuranceResult {
  propertyValue: number;
  insuranceRatePercent: number;
  liabilityValue: number;
  liabilityRatePercent: number;
  result: number;
}

export function calculateRentalPropertyInsurance(input: RentalPropertyInsuranceInput): RentalPropertyInsuranceResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyValue: input.propertyValue,
    insuranceRatePercent: input.insuranceRatePercent,
    liabilityValue: input.liabilityValue,
    liabilityRatePercent: input.liabilityRatePercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRentalPropertyInsurance({
  propertyValue: 2500000, insuranceRatePercent: 0.5, liabilityValue: 1000000, liabilityRatePercent: 0.3,
});

export const EXAMPLE_2 = calculateRentalPropertyInsurance({
  propertyValue: 5000000, insuranceRatePercent: 0.45, liabilityValue: 2000000, liabilityRatePercent: 0.25,
});

export const EXAMPLE_3 = calculateRentalPropertyInsurance({
  propertyValue: 3500000, insuranceRatePercent: 0.48, liabilityValue: 1500000, liabilityRatePercent: 0.28,
});

