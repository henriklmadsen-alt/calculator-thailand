export interface RealEstateCapitalGainsTaxInput {
  purchasePrice: number;
  sellingPrice: number;
  holdingYears: number;
  capitalGainsTaxRate: number;
}

export interface RealEstateCapitalGainsTaxResult {
  purchasePrice: number;
  sellingPrice: number;
  holdingYears: number;
  capitalGainsTaxRate: number;
  result: number;
}

export function calculateRealEstateCapitalGainsTax(input: RealEstateCapitalGainsTaxInput): RealEstateCapitalGainsTaxResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    purchasePrice: input.purchasePrice,
    sellingPrice: input.sellingPrice,
    holdingYears: input.holdingYears,
    capitalGainsTaxRate: input.capitalGainsTaxRate,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRealEstateCapitalGainsTax({
  purchasePrice: 2500000, sellingPrice: 3500000, holdingYears: 7, capitalGainsTaxRate: 20,
});

export const EXAMPLE_2 = calculateRealEstateCapitalGainsTax({
  purchasePrice: 5000000, sellingPrice: 6500000, holdingYears: 10, capitalGainsTaxRate: 15,
});

export const EXAMPLE_3 = calculateRealEstateCapitalGainsTax({
  purchasePrice: 3500000, sellingPrice: 4500000, holdingYears: 8, capitalGainsTaxRate: 18,
});

