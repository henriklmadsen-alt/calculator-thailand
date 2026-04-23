export interface ModelBuildingInput {
  kitCost: number;
  gluePaintCost: number;
  toolsCost: number;
  displayCaseCost: number;
  lightingCost: number;
  otherMaterialsCost: number;
  buildingHours: number;
  hourlyValue: number;
}

export interface ModelBuildingResult {
  materialCost: number;
  laborValue: number;
  totalProjectValue: number;
  roi: number;
}

export function calculateModelBuildingCost(input: ModelBuildingInput): ModelBuildingResult {
  const materialCost = Math.round(
    input.kitCost + input.gluePaintCost + input.toolsCost + input.displayCaseCost + input.lightingCost + input.otherMaterialsCost
  );
  const laborValue = Math.round(input.buildingHours * input.hourlyValue);
  const totalProjectValue = Math.round(materialCost + laborValue);
  const roi = totalProjectValue > 0 ? Math.round((laborValue / materialCost) * 100) : 0;

  return { materialCost, laborValue, totalProjectValue, roi };
}

export const EXAMPLE_1 = calculateModelBuildingCost({
  kitCost: 800,
  gluePaintCost: 300,
  toolsCost: 200,
  displayCaseCost: 400,
  lightingCost: 200,
  otherMaterialsCost: 100,
  buildingHours: 20,
  hourlyValue: 150,
});

export const EXAMPLE_2 = calculateModelBuildingCost({
  kitCost: 1500,
  gluePaintCost: 500,
  toolsCost: 300,
  displayCaseCost: 600,
  lightingCost: 400,
  otherMaterialsCost: 200,
  buildingHours: 40,
  hourlyValue: 200,
});

export const EXAMPLE_3 = calculateModelBuildingCost({
  kitCost: 1000,
  gluePaintCost: 400,
  toolsCost: 250,
  displayCaseCost: 500,
  lightingCost: 300,
  otherMaterialsCost: 150,
  buildingHours: 30,
  hourlyValue: 175,
});
