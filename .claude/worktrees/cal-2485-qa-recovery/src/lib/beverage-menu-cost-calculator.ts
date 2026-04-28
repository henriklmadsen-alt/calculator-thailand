export interface BeverageMenuInput {
  guestCount: number;
  waterBottlesPerPerson: number;
  waterBottlePrice: number;
  softDrinkServingsPerPerson: number;
  softDrinkPrice: number;
  coffeeTeaServingsPerPerson: number;
  coffeeTeaPrice: number;
  wineServingsPerPerson: number;
  winePrice: number;
  spiritServingsPerPerson: number;
  spiritPrice: number;
}

export interface BeverageMenuResult {
  waterCost: number;
  softDrinkCost: number;
  coffeTeaCost: number;
  wineCost: number;
  spiritCost: number;
  totalBeverageCost: number;
  costPerGuest: number;
}

export function calculateBeverageMenu(input: BeverageMenuInput): BeverageMenuResult {
  const waterCost = Math.round(input.guestCount * input.waterBottlesPerPerson * input.waterBottlePrice);
  const softDrinkCost = Math.round(input.guestCount * input.softDrinkServingsPerPerson * input.softDrinkPrice);
  const coffeTeaCost = Math.round(input.guestCount * input.coffeeTeaServingsPerPerson * input.coffeeTeaPrice);
  const wineCost = Math.round(input.guestCount * input.wineServingsPerPerson * input.winePrice);
  const spiritCost = Math.round(input.guestCount * input.spiritServingsPerPerson * input.spiritPrice);
  const totalBeverageCost = Math.round(waterCost + softDrinkCost + coffeTeaCost + wineCost + spiritCost);
  const costPerGuest = Math.round(totalBeverageCost / input.guestCount);

  return {
    waterCost,
    softDrinkCost,
    coffeTeaCost,
    wineCost,
    spiritCost,
    totalBeverageCost,
    costPerGuest,
  };
}

export const EXAMPLE_1 = calculateBeverageMenu({
  guestCount: 50,
  waterBottlesPerPerson: 1.5,
  waterBottlePrice: 20,
  softDrinkServingsPerPerson: 1,
  softDrinkPrice: 50,
  coffeeTeaServingsPerPerson: 0.5,
  coffeeTeaPrice: 40,
  wineServingsPerPerson: 0.5,
  winePrice: 200,
  spiritServingsPerPerson: 0.3,
  spiritPrice: 100,
});

export const EXAMPLE_2 = calculateBeverageMenu({
  guestCount: 100,
  waterBottlesPerPerson: 2,
  waterBottlePrice: 25,
  softDrinkServingsPerPerson: 1.5,
  softDrinkPrice: 60,
  coffeeTeaServingsPerPerson: 0.5,
  coffeeTeaPrice: 45,
  wineServingsPerPerson: 0.8,
  winePrice: 250,
  spiritServingsPerPerson: 0.5,
  spiritPrice: 120,
});

export const EXAMPLE_3 = calculateBeverageMenu({
  guestCount: 150,
  waterBottlesPerPerson: 2.5,
  waterBottlePrice: 30,
  softDrinkServingsPerPerson: 2,
  softDrinkPrice: 70,
  coffeeTeaServingsPerPerson: 1,
  coffeeTeaPrice: 50,
  wineServingsPerPerson: 1,
  winePrice: 300,
  spiritServingsPerPerson: 0.6,
  spiritPrice: 150,
});
