export interface DIYHomeInput {
  woodAndMaterials: number;
  toolsCost: number;
  paintAndFinish: number;
  hardwareCost: number;
  guidesAndResources: number;
  otherCost: number;
  projectSize: number; // sq cm
}

export interface DIYHomeResult {
  totalCost: number;
  costPerSqCm: number;
  estimatedValue: number;
  savings: number;
}

export function calculateDIYHomeCraft(input: DIYHomeInput): DIYHomeResult {
  const totalCost = Math.round(
    input.woodAndMaterials + input.toolsCost + input.paintAndFinish + input.hardwareCost + input.guidesAndResources + input.otherCost
  );
  const costPerSqCm = input.projectSize > 0 ? Math.round(totalCost / input.projectSize * 100) / 100 : 0;
  const estimatedValue = Math.round(totalCost * 2);
  const savings = Math.round(estimatedValue - totalCost);

  return { totalCost, costPerSqCm, estimatedValue, savings };
}

export const EXAMPLE_1 = calculateDIYHomeCraft({
  woodAndMaterials: 1000,
  toolsCost: 500,
  paintAndFinish: 300,
  hardwareCost: 200,
  guidesAndResources: 100,
  otherCost: 100,
  projectSize: 5000,
});

export const EXAMPLE_2 = calculateDIYHomeCraft({
  woodAndMaterials: 1500,
  toolsCost: 600,
  paintAndFinish: 400,
  hardwareCost: 300,
  guidesAndResources: 150,
  otherCost: 150,
  projectSize: 8000,
});

export const EXAMPLE_3 = calculateDIYHomeCraft({
  woodAndMaterials: 1200,
  toolsCost: 550,
  paintAndFinish: 350,
  hardwareCost: 250,
  guidesAndResources: 120,
  otherCost: 120,
  projectSize: 6000,
});
