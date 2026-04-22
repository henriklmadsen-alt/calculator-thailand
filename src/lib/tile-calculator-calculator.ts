export interface TileCalculatorInput {
  areaToTile: number;
  tileSizeSquareMeter: number;
  wastePercent: number;
}

export interface TileCalculatorResult {
  areaToTile: number;
  tileSizeSquareMeter: number;
  wastePercent: number;
  result: number;
}

export function calculateTileCalculator(input: TileCalculatorInput): TileCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    areaToTile: input.areaToTile,
    tileSizeSquareMeter: input.tileSizeSquareMeter,
    wastePercent: input.wastePercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateTileCalculator({
  areaToTile: 20, tileSizeSquareMeter: 0.25, wastePercent: 10,
});

export const EXAMPLE_2 = calculateTileCalculator({
  areaToTile: 30, tileSizeSquareMeter: 0.25, wastePercent: 10,
});

export const EXAMPLE_3 = calculateTileCalculator({
  areaToTile: 25, tileSizeSquareMeter: 0.25, wastePercent: 10,
});

