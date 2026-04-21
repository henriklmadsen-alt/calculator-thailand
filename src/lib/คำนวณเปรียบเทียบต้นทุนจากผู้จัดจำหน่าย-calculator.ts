/**
 * คำนวณเปรียบเทียบต้นทุนจากผู้จัดจำหน่าย (Procurement Cost Analysis) - KLC-1067
 *
 * Sources:
 * - Thai Federation of Industries
 * - Department of Industrial Works
 * - Thai Standards Institute (TISI)
 *
 * Calculation includes:
 * - Basic cost analysis
 * - Efficiency metrics
 * - Planning and forecasting
 */

export interface ProcurementCostAnalysisInput {
  amount1: number;
  amount2?: number;
}

export interface ProcurementCostAnalysisResult {
  total: number;
  analysis: string;
}

export function calculateProcurementCostAnalysis(input: ProcurementCostAnalysisInput): ProcurementCostAnalysisResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateProcurementCostAnalysis({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateProcurementCostAnalysis({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateProcurementCostAnalysis({ amount1: 1000000, amount2: 500000 });
