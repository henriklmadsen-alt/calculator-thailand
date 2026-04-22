export interface MaterialPriceComparisonInput {
  localPrice: number;
  importedPrice: number;
  quantity: number;
}

export interface MaterialPriceComparisonResult {
  localPrice: number;
  importedPrice: number;
  quantity: number;
  result: number;
}

export function calculateMaterialPriceComparison(input: MaterialPriceComparisonInput): MaterialPriceComparisonResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    localPrice: input.localPrice,
    importedPrice: input.importedPrice,
    quantity: input.quantity,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateMaterialPriceComparison({
  localPrice: 500, importedPrice: 800, quantity: 100,
});

export const EXAMPLE_2 = calculateMaterialPriceComparison({
  localPrice: 800, importedPrice: 1200, quantity: 200,
});

export const EXAMPLE_3 = calculateMaterialPriceComparison({
  localPrice: 600, importedPrice: 1000, quantity: 150,
});

