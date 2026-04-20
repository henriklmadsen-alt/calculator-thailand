// Child support (ค่าเลี้ยงดูบุตร) estimator based on Thai family law guidelines.
// Thai Civil and Commercial Code §1564, §1598/38 — courts use discretion;
// this tool applies common judicial guidelines (not a statutory formula).

export interface ChildSupportInput {
  /** Monthly income of the requesting parent (ผู้ร้อง) in THB */
  parentAIncome: number;
  /** Monthly income of the other parent (ผู้ถูกร้อง) in THB */
  parentBIncome: number;
  /** Number of children (1–10) */
  numberOfChildren: number;
  /** Monthly child-specific expenses (education, medical, etc.) — optional override */
  childExpenses?: number;
}

export interface ChildSupportResult {
  /** Combined parental income */
  combinedIncome: number;
  /** Income share ratio of parent A (0–1) */
  parentAShare: number;
  /** Income share ratio of parent B (0–1) */
  parentBShare: number;
  /** Guideline percentage of combined income allocated to children */
  childPercentage: number;
  /** Total estimated child support per month */
  totalSupport: number;
  /** Support amount per child per month */
  perChildSupport: number;
  /** Parent A's contribution */
  parentAContribution: number;
  /** Parent B's contribution */
  parentBContribution: number;
}

/**
 * Returns the guideline percentage of combined income typically allocated
 * to child support by Thai courts. These are approximate midpoints from
 * observed court rulings — not codified rates.
 */
function guidelinePercent(children: number): number {
  if (children <= 1) return 0.25;
  if (children === 2) return 0.35;
  if (children === 3) return 0.40;
  return Math.min(0.50, 0.40 + (children - 3) * 0.03);
}

export function calculateChildSupport(input: ChildSupportInput): ChildSupportResult {
  const { parentAIncome, parentBIncome, numberOfChildren, childExpenses } = input;

  if (parentAIncome < 0 || parentBIncome < 0) {
    throw new Error('Income must not be negative');
  }
  if (numberOfChildren < 1 || numberOfChildren > 10 || !Number.isInteger(numberOfChildren)) {
    throw new Error('Number of children must be an integer between 1 and 10');
  }

  const combinedIncome = parentAIncome + parentBIncome;

  // Avoid division by zero when both incomes are 0
  const parentAShare = combinedIncome > 0 ? parentAIncome / combinedIncome : 0.5;
  const parentBShare = combinedIncome > 0 ? parentBIncome / combinedIncome : 0.5;

  const childPercentage = guidelinePercent(numberOfChildren);

  // If user provides explicit child expenses, use those; otherwise estimate from income
  const totalSupport =
    childExpenses !== undefined && childExpenses > 0
      ? childExpenses
      : Math.round(combinedIncome * childPercentage);

  const perChildSupport = Math.round(totalSupport / numberOfChildren);
  const parentAContribution = Math.round(totalSupport * parentAShare);
  const parentBContribution = totalSupport - parentAContribution; // avoid rounding gap

  return {
    combinedIncome,
    parentAShare,
    parentBShare,
    childPercentage,
    totalSupport,
    perChildSupport,
    parentAContribution,
    parentBContribution,
  };
}
