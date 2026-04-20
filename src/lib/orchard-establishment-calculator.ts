export function calc(rai: number) {
  const land = rai * 15000, seedlings = rai * 8000, fertilizer = rai * 2000, labor = rai * 5000;
  const total = land + seedlings + fertilizer + labor;
  const yearlyIncome = rai * 30000, payback = total / yearlyIncome;
  return { total: Math.round(total), yearlyIncome: Math.round(yearlyIncome), payback: Math.round(payback * 10) / 10 };
}
export const E1 = calc(5), E2 = calc(10), E3 = calc(20);
