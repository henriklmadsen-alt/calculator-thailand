export interface JewelryInput {
  metalCost: number; // gold, silver, copper
  gemstonesCost: number;
  toolsCost: number;
  stringBeadsCost: number;
  claspsAndFittingsCost: number;
  polishAndFinishCost: number;
  packagingCost: number;
  otherMaterialsCost: number;
}

export interface JewelryResult {
  totalCost: number;
  suggestedSellingPrice: number;
  profitPerPiece: number;
  materialCost: number;
  laborAndOtherCost: number;
}

export function calculateJewelryMakingCost(input: JewelryInput): JewelryResult {
  const materialCost = Math.round(input.metalCost + input.gemstonesCost + input.stringBeadsCost);
  const laborAndOtherCost = Math.round(
    input.toolsCost + input.claspsAndFittingsCost + input.polishAndFinishCost + input.packagingCost + input.otherMaterialsCost
  );
  const totalCost = Math.round(materialCost + laborAndOtherCost);
  const suggestedSellingPrice = Math.round(totalCost * 3.5); // 250% markup for jewelry
  const profitPerPiece = Math.round(suggestedSellingPrice - totalCost);

  return {
    totalCost,
    suggestedSellingPrice,
    profitPerPiece,
    materialCost,
    laborAndOtherCost,
  };
}

export const EXAMPLE_1 = calculateJewelryMakingCost({
  metalCost: 500,
  gemstonesCost: 300,
  toolsCost: 200,
  stringBeadsCost: 100,
  claspsAndFittingsCost: 80,
  polishAndFinishCost: 50,
  packagingCost: 100,
  otherMaterialsCost: 50,
});

export const EXAMPLE_2 = calculateJewelryMakingCost({
  metalCost: 1000,
  gemstonesCost: 600,
  toolsCost: 200,
  stringBeadsCost: 150,
  claspsAndFittingsCost: 120,
  polishAndFinishCost: 80,
  packagingCost: 150,
  otherMaterialsCost: 100,
});

export const EXAMPLE_3 = calculateJewelryMakingCost({
  metalCost: 700,
  gemstonesCost: 400,
  toolsCost: 200,
  stringBeadsCost: 120,
  claspsAndFittingsCost: 100,
  polishAndFinishCost: 60,
  packagingCost: 120,
  otherMaterialsCost: 70,
});
