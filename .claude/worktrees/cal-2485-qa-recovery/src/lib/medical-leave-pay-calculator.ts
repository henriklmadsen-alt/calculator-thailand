/**
 * Thai Medical Leave Pay Calculator (คำนวณเงินเดือนระหว่างลาป่วย)
 *
 * Sources:
 * - Thai Labor Code medical leave provisions
 * - Ministry of Labor guidelines
 * - Employee compensation standards
 */

export interface MedicalLeaveInput {
  dailyWage: number;
  leaveDaysNeeded: number;
  leaveAllowancePercent: number; // 50-100% depending on company
}

export interface MedicalLeaveResult {
  leaveEntitled: number;
  medicalLeaveCost: number;
  employeeLoses: number;
  employerCost: number;
  replacementCost: number;
  totalCost: number;
  notes: string;
}

export function calculateMedicalLeavePay(
  input: MedicalLeaveInput,
): MedicalLeaveResult {
  const {
    dailyWage,
    leaveDaysNeeded,
    leaveAllowancePercent,
  } = input;

  // Thai law: 30 days annual leave, 10 days medical leave
  const leaveEntitled = 10;
  const leaveDaysUsed = Math.min(leaveDaysNeeded, leaveEntitled);

  const medicalLeaveCost = Math.round(
    (dailyWage * leaveDaysUsed * leaveAllowancePercent) / 100,
  );
  const employeeLoses = dailyWage * (leaveDaysUsed - Math.round(leaveDaysUsed * leaveAllowancePercent / 100));

  // Employer cost for salary during leave
  const employerCost = medicalLeaveCost;

  // Cost for temporary replacement
  const replacementCost = dailyWage * leaveDaysUsed * 0.8; // Temporary staff cost

  const totalCost = employerCost + replacementCost;

  const notes =
    leaveDaysNeeded > leaveEntitled
      ? 'Additional days beyond medical leave may require unpaid leave or salary deduction'
      : 'Within annual medical leave allowance';

  return {
    leaveEntitled,
    medicalLeaveCost,
    employeeLoses,
    employerCost,
    replacementCost,
    totalCost,
    notes,
  };
}
