export function calc(kg: number, distance: number) {
  const costPerKg = distance > 50 ? 3 : 2, total = kg * costPerKg;
  return { total: Math.round(total), costPerKg };
}
export const E1 = calc(1000, 30), E2 = calc(2000, 50), E3 = calc(5000, 80);
