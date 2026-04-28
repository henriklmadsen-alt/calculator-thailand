/**
 * Thai Employee Cost Calculator (Employer View)
 * คำนวณค่าจ้างพนักงาน — ต้นทุนรวมที่นายจ้างต้องจ่ายต่อพนักงานหนึ่งคน
 *
 * Covers:
 * - Base salary
 * - Employer social security contribution (มาตรา 33: 5%, cap 750 baht)
 * - Employer provident fund contribution (กองทุนสำรองเลี้ยงชีพ)
 * - Other benefits (health insurance, group accident, etc.)
 *
 * Legal basis:
 * - พ.ร.บ. ประกันสังคม พ.ศ. 2533 มาตรา 33: employer matches 5%, floor 1,650 / cap 15,000
 * - พ.ร.บ. กองทุนสำรองเลี้ยงชีพ พ.ศ. 2530: employer contribution 2-15% of salary
 */

export interface EmployeeCostInput {
  monthlySalary: number;
  workingDaysPerMonth: number;
  includeSocialSecurity: boolean;
  includeProvidentFund: boolean;
  providentFundPercent: number; // employer contribution % (2-15)
  healthInsurance: number; // monthly employer cost
  groupAccidentInsurance: number; // monthly employer cost
  otherBenefits: number; // monthly employer cost for other benefits
}

export interface EmployeeCostResult {
  monthlySalary: number;
  dailyRate: number;
  hourlyRate: number;
  socialSecurityEmployer: number;
  providentFundEmployer: number;
  healthInsurance: number;
  groupAccidentInsurance: number;
  otherBenefits: number;
  totalBenefits: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  costMultiplier: number; // total cost / salary ratio
}

const STANDARD_HOURS_PER_DAY = 8;
const SSO_RATE = 0.05;
const SSO_MIN_BASE = 1650;
const SSO_MAX_BASE = 15000;

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateEmployeeCost(input: EmployeeCostInput): EmployeeCostResult {
  if (!Number.isFinite(input.monthlySalary) || input.monthlySalary <= 0) {
    throw new Error('monthlySalary must be a positive number.');
  }
  if (!Number.isFinite(input.workingDaysPerMonth) || input.workingDaysPerMonth <= 0) {
    throw new Error('workingDaysPerMonth must be a positive number.');
  }

  const monthlySalary = input.monthlySalary;
  const dailyRate = roundCurrency(monthlySalary / input.workingDaysPerMonth);
  const hourlyRate = roundCurrency(dailyRate / STANDARD_HOURS_PER_DAY);

  // Employer social security (same rate as employee: 5% of salary, cap at 750)
  let socialSecurityEmployer = 0;
  if (input.includeSocialSecurity) {
    const ssoBase = Math.max(SSO_MIN_BASE, Math.min(monthlySalary, SSO_MAX_BASE));
    socialSecurityEmployer = roundCurrency(ssoBase * SSO_RATE);
  }

  // Employer provident fund contribution
  let providentFundEmployer = 0;
  if (input.includeProvidentFund) {
    const pct = Math.max(0, Math.min(input.providentFundPercent, 15));
    providentFundEmployer = roundCurrency(monthlySalary * (pct / 100));
  }

  const healthInsurance = roundCurrency(Math.max(0, input.healthInsurance || 0));
  const groupAccidentInsurance = roundCurrency(Math.max(0, input.groupAccidentInsurance || 0));
  const otherBenefits = roundCurrency(Math.max(0, input.otherBenefits || 0));

  const totalBenefits = roundCurrency(
    socialSecurityEmployer + providentFundEmployer + healthInsurance + groupAccidentInsurance + otherBenefits,
  );
  const totalMonthlyCost = roundCurrency(monthlySalary + totalBenefits);
  const totalAnnualCost = roundCurrency(totalMonthlyCost * 12);
  const costMultiplier = roundCurrency((totalMonthlyCost / monthlySalary) * 100) / 100;

  return {
    monthlySalary,
    dailyRate,
    hourlyRate,
    socialSecurityEmployer,
    providentFundEmployer,
    healthInsurance,
    groupAccidentInsurance,
    otherBenefits,
    totalBenefits,
    totalMonthlyCost,
    totalAnnualCost,
    costMultiplier,
  };
}
