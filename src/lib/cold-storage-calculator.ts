export function calc(tonnes: number, months: number) {
  const monthly = tonnes * 800, total = monthly * months;
  return { monthlyRate: Math.round(monthly), total: Math.round(total) };
}
export const E1 = calc(5, 3), E2 = calc(10, 6), E3 = calc(20, 12);
