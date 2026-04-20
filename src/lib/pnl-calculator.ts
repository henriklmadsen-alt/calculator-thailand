/**
 * Thai Profit & Loss Calculator
 * คำนวณกำไร-ขาดทุน — วิเคราะห์ผลประกอบการธุรกิจ
 *
 * Standard P&L formulas:
 * - Gross Profit = Revenue - COGS
 * - Operating Profit = Gross Profit - Operating Expenses
 * - Net Profit = Operating Profit - Other Expenses + Other Income
 * - Gross Profit Margin (%) = (Gross Profit / Revenue) × 100
 * - Operating Profit Margin (%) = (Operating Profit / Revenue) × 100
 * - Net Profit Margin (%) = (Net Profit / Revenue) × 100
 */

export interface PnLInput {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  otherIncome: number;
  otherExpenses: number;
}

export interface PnLResult {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossProfitMargin: number;
  operatingExpenses: number;
  operatingProfit: number;
  operatingProfitMargin: number;
  otherIncome: number;
  otherExpenses: number;
  netProfit: number;
  netProfitMargin: number;
  isLoss: boolean;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundPercent(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculatePnL(input: PnLInput): PnLResult {
  if (!Number.isFinite(input.revenue) || input.revenue < 0) {
    throw new Error('revenue must be a non-negative number.');
  }
  if (!Number.isFinite(input.costOfGoodsSold) || input.costOfGoodsSold < 0) {
    throw new Error('costOfGoodsSold must be a non-negative number.');
  }
  if (!Number.isFinite(input.operatingExpenses) || input.operatingExpenses < 0) {
    throw new Error('operatingExpenses must be a non-negative number.');
  }
  if (!Number.isFinite(input.otherIncome) || input.otherIncome < 0) {
    throw new Error('otherIncome must be a non-negative number.');
  }
  if (!Number.isFinite(input.otherExpenses) || input.otherExpenses < 0) {
    throw new Error('otherExpenses must be a non-negative number.');
  }

  const grossProfit = roundCurrency(input.revenue - input.costOfGoodsSold);
  const operatingProfit = roundCurrency(grossProfit - input.operatingExpenses);
  const netProfit = roundCurrency(operatingProfit + input.otherIncome - input.otherExpenses);

  const grossProfitMargin = input.revenue > 0
    ? roundPercent((grossProfit / input.revenue) * 100)
    : 0;
  const operatingProfitMargin = input.revenue > 0
    ? roundPercent((operatingProfit / input.revenue) * 100)
    : 0;
  const netProfitMargin = input.revenue > 0
    ? roundPercent((netProfit / input.revenue) * 100)
    : 0;

  return {
    revenue: input.revenue,
    costOfGoodsSold: input.costOfGoodsSold,
    grossProfit,
    grossProfitMargin,
    operatingExpenses: input.operatingExpenses,
    operatingProfit,
    operatingProfitMargin,
    otherIncome: input.otherIncome,
    otherExpenses: input.otherExpenses,
    netProfit,
    netProfitMargin,
    isLoss: netProfit < 0,
  };
}
