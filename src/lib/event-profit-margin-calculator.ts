export interface EventProfitMarginInput {
  totalCosts: number;
  sellingPrice: number;
  targetProfitMarginPercentage?: number;
}

export interface EventProfitMarginResult {
  profitAmount: number;
  profitMarginPercentage: number;
  profitStatus: string;
}

export function calculateEventProfitMargin(input: EventProfitMarginInput): EventProfitMarginResult {
  const profitAmount = Math.round(input.sellingPrice - input.totalCosts);
  const profitMarginPercentage = input.totalCosts > 0
    ? Math.round((profitAmount / input.totalCosts) * 100)
    : 0;

  let profitStatus = '';
  if (input.targetProfitMarginPercentage) {
    if (profitMarginPercentage >= input.targetProfitMarginPercentage) {
      profitStatus = 'เป้าหมายถึงแล้ว';
    } else {
      const shortfall = input.targetProfitMarginPercentage - profitMarginPercentage;
      profitStatus = `ต่ำกว่าเป้าหมาย ${shortfall.toFixed(1)}%`;
    }
  } else {
    profitStatus = profitAmount > 0 ? 'กำไร' : profitAmount < 0 ? 'ขาดทุน' : 'คุ้มทุน';
  }

  return {
    profitAmount,
    profitMarginPercentage,
    profitStatus,
  };
}

export const EXAMPLE_1 = calculateEventProfitMargin({
  totalCosts: 50000,
  sellingPrice: 65000,
  targetProfitMarginPercentage: 20,
});

export const EXAMPLE_2 = calculateEventProfitMargin({
  totalCosts: 100000,
  sellingPrice: 135000,
  targetProfitMarginPercentage: 30,
});

export const EXAMPLE_3 = calculateEventProfitMargin({
  totalCosts: 200000,
  sellingPrice: 280000,
  targetProfitMarginPercentage: 35,
});
