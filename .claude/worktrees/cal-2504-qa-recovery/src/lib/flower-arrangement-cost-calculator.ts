export interface FlowerArrangementInput {
  bouquetQuantity: number;
  bouquetUnitPrice: number;
  corsageQuantity: number;
  corsageUnitPrice: number;
  centerpieceQuantity: number;
  centerpieceUnitPrice: number;
  archQuantity: number;
  archUnitPrice: number;
}

export interface FlowerArrangementResult {
  bouquetCost: number;
  corsageCost: number;
  centerpieceCost: number;
  archCost: number;
  totalFlowerCost: number;
  costBreakdown: Record<string, number>;
}

export function calculateFlowerArrangement(input: FlowerArrangementInput): FlowerArrangementResult {
  const bouquetCost = Math.round(input.bouquetQuantity * input.bouquetUnitPrice);
  const corsageCost = Math.round(input.corsageQuantity * input.corsageUnitPrice);
  const centerpieceCost = Math.round(input.centerpieceQuantity * input.centerpieceUnitPrice);
  const archCost = Math.round(input.archQuantity * input.archUnitPrice);
  const totalFlowerCost = Math.round(bouquetCost + corsageCost + centerpieceCost + archCost);

  return {
    bouquetCost,
    corsageCost,
    centerpieceCost,
    archCost,
    totalFlowerCost,
    costBreakdown: {
      bouquets: bouquetCost,
      corsages: corsageCost,
      centerpieces: centerpieceCost,
      arches: archCost,
    },
  };
}

export const EXAMPLE_1 = calculateFlowerArrangement({
  bouquetQuantity: 5,
  bouquetUnitPrice: 500,
  corsageQuantity: 10,
  corsageUnitPrice: 150,
  centerpieceQuantity: 8,
  centerpieceUnitPrice: 400,
  archQuantity: 2,
  archUnitPrice: 2000,
});

export const EXAMPLE_2 = calculateFlowerArrangement({
  bouquetQuantity: 10,
  bouquetUnitPrice: 800,
  corsageQuantity: 20,
  corsageUnitPrice: 200,
  centerpieceQuantity: 15,
  centerpieceUnitPrice: 600,
  archQuantity: 3,
  archUnitPrice: 3000,
});

export const EXAMPLE_3 = calculateFlowerArrangement({
  bouquetQuantity: 15,
  bouquetUnitPrice: 1000,
  corsageQuantity: 30,
  corsageUnitPrice: 250,
  centerpieceQuantity: 20,
  centerpieceUnitPrice: 800,
  archQuantity: 4,
  archUnitPrice: 4000,
});
