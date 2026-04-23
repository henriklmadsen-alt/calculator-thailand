export interface PaintCoverageCalculatorInput {
  wallArea: number;
  paintCoveragePerLiter: number;
  coats: number;
}

export interface PaintCoverageCalculatorResult {
  wallArea: number;
  paintCoveragePerLiter: number;
  coats: number;
  result: number;
}

export function calculatePaintCoverageCalculator(input: PaintCoverageCalculatorInput): PaintCoverageCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    wallArea: input.wallArea,
    paintCoveragePerLiter: input.paintCoveragePerLiter,
    coats: input.coats,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePaintCoverageCalculator({
  wallArea: 100, paintCoveragePerLiter: 8, coats: 2,
});

export const EXAMPLE_2 = calculatePaintCoverageCalculator({
  wallArea: 150, paintCoveragePerLiter: 8, coats: 2,
});

export const EXAMPLE_3 = calculatePaintCoverageCalculator({
  wallArea: 120, paintCoveragePerLiter: 8, coats: 2,
});

