export interface PaintingSuppliesInput {
  canvasCost: number;
  paintSetCost: number;
  brushesSetCost: number;
  paletteAndMixingCost: number;
  solventsCost: number;
  varnishFixativeCost: number;
  otherSuppliesCost: number;
  paintingAreaSqMeter: number;
}

export interface PaintingSuppliesResult {
  totalCost: number;
  costPerSqMeter: number;
  costPerPainting: number;
  suggestedSellingPrice: number;
  profitPerPainting: number;
  costBreakdown: {
    canvas: number;
    paint: number;
    brushes: number;
    palette: number;
    solvents: number;
    varnish: number;
    other: number;
  };
}

export function calculatePaintingSupplies(input: PaintingSuppliesInput): PaintingSuppliesResult {
  const totalCost = Math.round(
    input.canvasCost +
    input.paintSetCost +
    input.brushesSetCost +
    input.paletteAndMixingCost +
    input.solventsCost +
    input.varnishFixativeCost +
    input.otherSuppliesCost
  );

  const costPerSqMeter = input.paintingAreaSqMeter > 0 ? Math.round(totalCost / input.paintingAreaSqMeter) : 0;
  const costPerPainting = totalCost;
  const suggestedSellingPrice = Math.round(totalCost * 3); // 300% markup for art supplies
  const profitPerPainting = Math.round(suggestedSellingPrice - costPerPainting);

  return {
    totalCost,
    costPerSqMeter,
    costPerPainting,
    suggestedSellingPrice,
    profitPerPainting,
    costBreakdown: {
      canvas: input.canvasCost,
      paint: input.paintSetCost,
      brushes: input.brushesSetCost,
      palette: input.paletteAndMixingCost,
      solvents: input.solventsCost,
      varnish: input.varnishFixativeCost,
      other: input.otherSuppliesCost,
    },
  };
}

export const EXAMPLE_1 = calculatePaintingSupplies({
  canvasCost: 500,
  paintSetCost: 800,
  brushesSetCost: 400,
  paletteAndMixingCost: 200,
  solventsCost: 300,
  varnishFixativeCost: 250,
  otherSuppliesCost: 150,
  paintingAreaSqMeter: 0.5,
});

export const EXAMPLE_2 = calculatePaintingSupplies({
  canvasCost: 1200,
  paintSetCost: 1500,
  brushesSetCost: 700,
  paletteAndMixingCost: 350,
  solventsCost: 400,
  varnishFixativeCost: 350,
  otherSuppliesCost: 300,
  paintingAreaSqMeter: 1.2,
});

export const EXAMPLE_3 = calculatePaintingSupplies({
  canvasCost: 800,
  paintSetCost: 1000,
  brushesSetCost: 550,
  paletteAndMixingCost: 250,
  solventsCost: 350,
  varnishFixativeCost: 300,
  otherSuppliesCost: 200,
  paintingAreaSqMeter: 0.8,
});
