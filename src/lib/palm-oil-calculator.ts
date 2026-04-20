export function calc(rai: number) {
  const investment = rai * 12000, yearly = rai * 3000, yieldKg = rai * 2000, price = 10;
  const income = yieldKg * price, profit = income - yearly, roi = (profit / investment) * 100;
  return { investment: Math.round(investment), income: Math.round(income), profit: Math.round(profit), roi: Math.round(roi * 10) / 10 };
}
export const E1 = calc(10), E2 = calc(20), E3 = calc(30);
