export interface RealEstateInvestmentTimelineInput {
  purchasePrice: number;
  downPaymentPercent: number;
  monthlyRent: number;
  monthlyExpenses: number;
}

export interface RealEstateInvestmentTimelineResult {
  purchasePrice: number;
  downPaymentPercent: number;
  monthlyRent: number;
  monthlyExpenses: number;
  result: number;
}

export function calculateRealEstateInvestmentTimeline(input: RealEstateInvestmentTimelineInput): RealEstateInvestmentTimelineResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    purchasePrice: input.purchasePrice,
    downPaymentPercent: input.downPaymentPercent,
    monthlyRent: input.monthlyRent,
    monthlyExpenses: input.monthlyExpenses,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRealEstateInvestmentTimeline({
  purchasePrice: 2500000, downPaymentPercent: 20, monthlyRent: 15000, monthlyExpenses: 4000,
});

export const EXAMPLE_2 = calculateRealEstateInvestmentTimeline({
  purchasePrice: 5000000, downPaymentPercent: 25, monthlyRent: 30000, monthlyExpenses: 8000,
});

export const EXAMPLE_3 = calculateRealEstateInvestmentTimeline({
  purchasePrice: 3500000, downPaymentPercent: 30, monthlyRent: 21000, monthlyExpenses: 5500,
});

