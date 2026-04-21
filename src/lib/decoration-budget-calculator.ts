export interface DecorationBudgetInput {
  flowersCost: number;
  balloonsCost: number;
  fabricCost: number;
  lightingCost: number;
  laborCost: number;
}

export interface DecorationBudgetResult {
  totalDecorationCost: number;
  flowersCost: number;
  balloonsCost: number;
  fabricCost: number;
  lightingCost: number;
  laborCost: number;
}

export function calculateDecorationBudget(input: DecorationBudgetInput): DecorationBudgetResult {
  const totalDecorationCost = Math.round(
    input.flowersCost +
    input.balloonsCost +
    input.fabricCost +
    input.lightingCost +
    input.laborCost
  );

  return {
    totalDecorationCost,
    flowersCost: input.flowersCost,
    balloonsCost: input.balloonsCost,
    fabricCost: input.fabricCost,
    lightingCost: input.lightingCost,
    laborCost: input.laborCost,
  };
}

export const EXAMPLE_1 = calculateDecorationBudget({
  flowersCost: 2000,
  balloonsCost: 500,
  fabricCost: 1000,
  lightingCost: 1500,
  laborCost: 2000,
});

export const EXAMPLE_2 = calculateDecorationBudget({
  flowersCost: 5000,
  balloonsCost: 1000,
  fabricCost: 2500,
  lightingCost: 3000,
  laborCost: 4000,
});

export const EXAMPLE_3 = calculateDecorationBudget({
  flowersCost: 8000,
  balloonsCost: 2000,
  fabricCost: 4000,
  lightingCost: 5000,
  laborCost: 6000,
});
