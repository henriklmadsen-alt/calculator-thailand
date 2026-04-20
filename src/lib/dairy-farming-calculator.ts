export function calc(cows: number, days: number) {
  const feed = cows * days * 150, vet = cows * days * 5, labor = cows * days * 20;
  const total = feed + vet + labor, milk = cows * days * 8, income = milk * 15, profit = income - total;
  return { total: Math.round(total), income: Math.round(income), profit: Math.round(profit) };
}
export const E1 = calc(5, 30), E2 = calc(10, 60), E3 = calc(20, 90);
