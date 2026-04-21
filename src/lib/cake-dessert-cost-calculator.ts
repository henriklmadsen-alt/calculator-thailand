export interface CakeDessertInput {
  cakeServings: number;
  cakePrice: number;
  cupcakeQuantity: number;
  cupcakeUnitPrice: number;
  cookieQuantity: number;
  cookieUnitPrice: number;
  chocolateFountainQuantity: number;
  chocolateFountainUnitPrice: number;
}

export interface CakeDessertResult {
  cakeCost: number;
  cupcakeCost: number;
  cookieCost: number;
  chocolateFountainCost: number;
  totalDessertCost: number;
  cakePricePerServing: number;
}

export function calculateCakeDessert(input: CakeDessertInput): CakeDessertResult {
  const cakeCost = input.cakePrice;
  const cupcakeCost = Math.round(input.cupcakeQuantity * input.cupcakeUnitPrice);
  const cookieCost = Math.round(input.cookieQuantity * input.cookieUnitPrice);
  const chocolateFountainCost = Math.round(input.chocolateFountainQuantity * input.chocolateFountainUnitPrice);
  const totalDessertCost = Math.round(cakeCost + cupcakeCost + cookieCost + chocolateFountainCost);
  const cakePricePerServing = input.cakeServings > 0 ? Math.round(cakeCost / input.cakeServings) : 0;

  return {
    cakeCost,
    cupcakeCost,
    cookieCost,
    chocolateFountainCost,
    totalDessertCost,
    cakePricePerServing,
  };
}

export const EXAMPLE_1 = calculateCakeDessert({
  cakeServings: 50,
  cakePrice: 3000,
  cupcakeQuantity: 20,
  cupcakeUnitPrice: 40,
  cookieQuantity: 50,
  cookieUnitPrice: 20,
  chocolateFountainQuantity: 1,
  chocolateFountainUnitPrice: 2000,
});

export const EXAMPLE_2 = calculateCakeDessert({
  cakeServings: 100,
  cakePrice: 5000,
  cupcakeQuantity: 40,
  cupcakeUnitPrice: 50,
  cookieQuantity: 100,
  cookieUnitPrice: 25,
  chocolateFountainQuantity: 2,
  chocolateFountainUnitPrice: 2500,
});

export const EXAMPLE_3 = calculateCakeDessert({
  cakeServings: 150,
  cakePrice: 7000,
  cupcakeQuantity: 60,
  cupcakeUnitPrice: 60,
  cookieQuantity: 150,
  cookieUnitPrice: 30,
  chocolateFountainQuantity: 2,
  chocolateFountainUnitPrice: 3000,
});
