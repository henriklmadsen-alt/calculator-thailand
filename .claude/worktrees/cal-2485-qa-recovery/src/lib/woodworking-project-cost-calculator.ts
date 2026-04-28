export interface WoodworkingInput {
  woodCost: number;
  toolsCost: number;
  finishCost: number; // paint, varnish, stain
  hardwareCost: number; // nails, screws, hinges
  glassMirrorCost: number;
  otherMaterialsCost: number;
  projectArea: number; // sq cm
}

export interface WoodworkingResult {
  totalCost: number;
  costPerSqCm: number;
  suggestedSellingPrice: number;
  profitPerProject: number;
}

export function calculateWoodworkingCost(input: WoodworkingInput): WoodworkingResult {
  const totalCost = Math.round(
    input.woodCost + input.toolsCost + input.finishCost + input.hardwareCost + input.glassMirrorCost + input.otherMaterialsCost
  );
  const costPerSqCm = input.projectArea > 0 ? Math.round(totalCost / input.projectArea * 100) / 100 : 0;
  const suggestedSellingPrice = Math.round(totalCost * 3);
  const profitPerProject = Math.round(suggestedSellingPrice - totalCost);

  return {
    totalCost,
    costPerSqCm,
    suggestedSellingPrice,
    profitPerProject,
  };
}

export const EXAMPLE_1 = calculateWoodworkingCost({
  woodCost: 1000,
  toolsCost: 500,
  finishCost: 300,
  hardwareCost: 200,
  glassMirrorCost: 0,
  otherMaterialsCost: 100,
  projectArea: 2000,
});

export const EXAMPLE_2 = calculateWoodworkingCost({
  woodCost: 2000,
  toolsCost: 800,
  finishCost: 500,
  hardwareCost: 400,
  glassMirrorCost: 600,
  otherMaterialsCost: 200,
  projectArea: 4000,
});

export const EXAMPLE_3 = calculateWoodworkingCost({
  woodCost: 1500,
  toolsCost: 600,
  finishCost: 400,
  hardwareCost: 300,
  glassMirrorCost: 300,
  otherMaterialsCost: 150,
  projectArea: 3000,
});
