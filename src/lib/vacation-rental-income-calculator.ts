export interface VacationRentalIncomeInput {
  nightlyRate: number;
  occupancyRatePercent: number;
  daysPerYear: number;
}

export interface VacationRentalIncomeResult {
  nightlyRate: number;
  occupancyRatePercent: number;
  daysPerYear: number;
  result: number;
}

export function calculateVacationRentalIncome(input: VacationRentalIncomeInput): VacationRentalIncomeResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    nightlyRate: input.nightlyRate,
    occupancyRatePercent: input.occupancyRatePercent,
    daysPerYear: input.daysPerYear,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateVacationRentalIncome({
  nightlyRate: 3000, occupancyRatePercent: 65, daysPerYear: 365,
});

export const EXAMPLE_2 = calculateVacationRentalIncome({
  nightlyRate: 5000, occupancyRatePercent: 70, daysPerYear: 365,
});

export const EXAMPLE_3 = calculateVacationRentalIncome({
  nightlyRate: 4000, occupancyRatePercent: 68, daysPerYear: 365,
});

