export interface EventInsuranceInput {
  coverageType: 'liability' | 'property' | 'comprehensive';
  coverageAmount: number;
  eventType: 'wedding' | 'corporate' | 'social';
  attendeeCount: number;
}

export interface EventInsuranceResult {
  basePremium: number;
  typeMultiplier: number;
  eventMultiplier: number;
  estimatedInsurancePremium: number;
}

export function calculateEventInsurance(input: EventInsuranceInput): EventInsuranceResult {
  const basePremium = Math.round(input.coverageAmount * 0.005);

  const typeMultiplierMap: Record<string, number> = {
    liability: 1,
    property: 1.5,
    comprehensive: 2,
  };
  const typeMultiplier = typeMultiplierMap[input.coverageType] || 1;

  const eventMultiplierMap: Record<string, number> = {
    wedding: 1.2,
    corporate: 1.1,
    social: 1,
  };
  const eventMultiplier = eventMultiplierMap[input.eventType] || 1;

  const estimatedInsurancePremium = Math.round(
    basePremium * typeMultiplier * eventMultiplier * (input.attendeeCount / 100)
  );

  return {
    basePremium,
    typeMultiplier,
    eventMultiplier,
    estimatedInsurancePremium,
  };
}

export const EXAMPLE_1 = calculateEventInsurance({
  coverageType: 'liability',
  coverageAmount: 500000,
  eventType: 'social',
  attendeeCount: 50,
});

export const EXAMPLE_2 = calculateEventInsurance({
  coverageType: 'comprehensive',
  coverageAmount: 1000000,
  eventType: 'wedding',
  attendeeCount: 100,
});

export const EXAMPLE_3 = calculateEventInsurance({
  coverageType: 'property',
  coverageAmount: 2000000,
  eventType: 'corporate',
  attendeeCount: 200,
});
