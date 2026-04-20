export function calculatePoultry(birds: number, days: number) {
  const feedCost = birds * days * 1.5;
  const healthCost = birds * days * 0.2;
  const totalCost = feedCost + healthCost;
  const eggsProduced = birds * days * 0.85;
  const income = eggsProduced * 3;
  const profit = income - totalCost;
  return { totalCost: Math.round(totalCost), income: Math.round(income), profit: Math.round(profit) };
}
export const EXAMPLE_1 = calculatePoultry(100, 30);
export const EXAMPLE_2 = calculatePoultry(200, 60);
export const EXAMPLE_3 = calculatePoultry(300, 90);
