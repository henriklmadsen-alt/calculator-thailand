export interface VenueRentalInput {
  baseRental: number;
  depositAmount: number;
  decorationIncluded: boolean;
  decorationCost?: number;
}

export interface VenueRentalResult {
  baseRental: number;
  depositAmount: number;
  decorationCost: number;
  totalVenueCost: number;
  costBreakdown: Record<string, number>;
}

export function calculateVenueRental(input: VenueRentalInput): VenueRentalResult {
  const decorationCost = input.decorationIncluded ? 0 : (input.decorationCost || 0);
  const totalVenueCost = Math.round(input.baseRental + input.depositAmount + decorationCost);
  const costBreakdown = {
    baseRental: input.baseRental,
    deposit: input.depositAmount,
    decoration: decorationCost,
  };

  return {
    baseRental: input.baseRental,
    depositAmount: input.depositAmount,
    decorationCost,
    totalVenueCost,
    costBreakdown,
  };
}

export const EXAMPLE_1 = calculateVenueRental({
  baseRental: 10000,
  depositAmount: 5000,
  decorationIncluded: true,
});

export const EXAMPLE_2 = calculateVenueRental({
  baseRental: 15000,
  depositAmount: 7500,
  decorationIncluded: false,
  decorationCost: 5000,
});

export const EXAMPLE_3 = calculateVenueRental({
  baseRental: 25000,
  depositAmount: 12500,
  decorationIncluded: false,
  decorationCost: 8000,
});
