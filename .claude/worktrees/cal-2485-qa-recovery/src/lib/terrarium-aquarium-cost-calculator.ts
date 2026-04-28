export interface TerrariumInput {
  containerCost: number;
  substrateCost: number;
  plantsCost: number;
  decorationsCost: number;
  lightingCost: number;
  filteringSystemCost: number;
  otherEquipmentCost: number;
  maintenanceMonthlyCost: number;
}

export interface TerrariumResult {
  setupCost: number;
  monthlyCost: number;
  annualCost: number;
  fiveYearCost: number;
}

export function calculateTerrariumSetup(input: TerrariumInput): TerrariumResult {
  const setupCost = Math.round(
    input.containerCost + input.substrateCost + input.plantsCost + input.decorationsCost +
    input.lightingCost + input.filteringSystemCost + input.otherEquipmentCost
  );
  const monthlyCost = Math.round(input.maintenanceMonthlyCost);
  const annualCost = Math.round(setupCost + (monthlyCost * 12));
  const fiveYearCost = Math.round(setupCost + (monthlyCost * 12 * 5));

  return { setupCost, monthlyCost, annualCost, fiveYearCost };
}

export const EXAMPLE_1 = calculateTerrariumSetup({
  containerCost: 1500,
  substrateCost: 400,
  plantsCost: 600,
  decorationsCost: 300,
  lightingCost: 500,
  filteringSystemCost: 0,
  otherEquipmentCost: 200,
  maintenanceMonthlyCost: 150,
});

export const EXAMPLE_2 = calculateTerrariumSetup({
  containerCost: 2500,
  substrateCost: 600,
  plantsCost: 1000,
  decorationsCost: 500,
  lightingCost: 800,
  filteringSystemCost: 1000,
  otherEquipmentCost: 400,
  maintenanceMonthlyCost: 300,
});

export const EXAMPLE_3 = calculateTerrariumSetup({
  containerCost: 2000,
  substrateCost: 500,
  plantsCost: 800,
  decorationsCost: 400,
  lightingCost: 600,
  filteringSystemCost: 500,
  otherEquipmentCost: 300,
  maintenanceMonthlyCost: 200,
});
