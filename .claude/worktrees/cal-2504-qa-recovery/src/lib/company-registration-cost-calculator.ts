/**
 * Thai Company Registration Cost Calculator (คำนวณค่าจดทะเบียนบริษัท)
 *
 * Sources:
 * - Department of Business Development (DBD) - สำนักงานพัฒนาธุรกิจกระลาษฎีย์
 * - Royal Decree on Application for Juristic Person Registry B.E. 2534 (2534)
 * - DBD Fee Schedule 2024/2025
 *
 * Covers:
 * - DBD registration fee (based on registered capital)
 * - Stamp duty on memorandum of association
 * - Stamp duty on articles of association
 * - Notary/lawyer fees (optional estimate)
 * - Company seal cost (optional)
 *
 * Note: Fees are estimates and may vary by location and service provider.
 * Always verify with DBD or your accountant for exact amounts.
 */

export type CompanyType = 'limited' | 'unlimited' | 'partnership';

export interface CompanyRegistrationInput {
  companyType: CompanyType;
  registeredCapital: number; // THB
  numberOfPartners: number;
  includeNotaryFee: boolean;
  includeLawyerFee: boolean;
  includeSeal: boolean;
}

export interface CompanyRegistrationResult {
  companyType: CompanyType;
  companyTypeName: string;
  registeredCapital: number;
  numberOfPartners: number;

  // DBD registration fee
  dbdRegistrationFee: number;

  // Stamp duties
  stampDutyMOA: number; // Memorandum of Association
  stampDutyAOA: number; // Articles of Association
  totalStampDuty: number;

  // Optional services
  notaryFee: number;
  lawyerFee: number;
  sealCost: number;

  // Summary
  subtotal: number;
  vat: number;
  total: number;
}

const COMPANY_TYPE_NAMES: Record<CompanyType, string> = {
  limited: 'บริษัทจำกัด (Limited Company)',
  unlimited: 'บริษัทมหาชนจำกัด (Public Company)',
  partnership: 'ห้างหุ้นส่วนสามัญ (Partnership)',
};

/**
 * DBD Registration Fee Schedule (2024)
 * Based on registered capital amount
 * Source: DBD Fee Schedule
 */
function getDBDRegistrationFee(registeredCapital: number): number {
  // Limited Company fee structure
  if (registeredCapital <= 100000) {
    return 500;
  } else if (registeredCapital <= 500000) {
    return 750;
  } else if (registeredCapital <= 1000000) {
    return 1000;
  } else if (registeredCapital <= 5000000) {
    return 2000;
  } else if (registeredCapital <= 10000000) {
    return 5000;
  } else if (registeredCapital <= 50000000) {
    return 10000;
  } else {
    // Over 50 million: 10,000 + additional
    const additional = Math.ceil((registeredCapital - 50000000) / 1000000) * 500;
    return Math.min(10000 + additional, 50000); // Cap at 50,000
  }
}

/**
 * Stamp Duty on Memorandum of Association
 * Rate: 0.5% of registered capital, minimum 10 THB
 * Source: Revenue Code
 */
function getStampDutyMOA(registeredCapital: number): number {
  const fee = registeredCapital * 0.005;
  return Math.max(fee, 10);
}

/**
 * Stamp Duty on Articles of Association
 * Rate: 0.5% of registered capital, minimum 10 THB
 * Source: Revenue Code
 */
function getStampDutyAOA(registeredCapital: number): number {
  const fee = registeredCapital * 0.005;
  return Math.max(fee, 10);
}

/**
 * Typical notary fees (optional service)
 * Average estimate: 500-2000 THB
 */
function getNotaryFee(): number {
  return 1000; // Average estimate
}

/**
 * Typical lawyer/accountant fees (optional service)
 * Average estimate: 2000-5000 THB
 */
function getLawyerFee(): number {
  return 3500; // Average estimate
}

/**
 * Company seal cost (optional)
 * Average estimate: 300-800 THB
 */
function getSealCost(): number {
  return 500; // Average estimate
}

export function calculateCompanyRegistrationCost(
  input: CompanyRegistrationInput,
): CompanyRegistrationResult {
  const dbdFee = getDBDRegistrationFee(input.registeredCapital);
  const moaStamp = getStampDutyMOA(input.registeredCapital);
  const aoaStamp = getStampDutyAOA(input.registeredCapital);
  const totalStamp = moaStamp + aoaStamp;

  const notaryFee = input.includeNotaryFee ? getNotaryFee() : 0;
  const lawyerFee = input.includeLawyerFee ? getLawyerFee() : 0;
  const sealCost = input.includeSeal ? getSealCost() : 0;

  const subtotal = dbdFee + totalStamp + notaryFee + lawyerFee + sealCost;

  // VAT 7% applies to some services (notary, lawyer) but not government fees
  const vatableAmount = notaryFee + lawyerFee + sealCost;
  const vat = vatableAmount * 0.07;

  const total = subtotal + vat;

  return {
    companyType: input.companyType,
    companyTypeName: COMPANY_TYPE_NAMES[input.companyType],
    registeredCapital: input.registeredCapital,
    numberOfPartners: input.numberOfPartners,
    dbdRegistrationFee: Math.round(dbdFee),
    stampDutyMOA: Math.round(moaStamp),
    stampDutyAOA: Math.round(aoaStamp),
    totalStampDuty: Math.round(totalStamp),
    notaryFee: Math.round(notaryFee),
    lawyerFee: Math.round(lawyerFee),
    sealCost: Math.round(sealCost),
    subtotal: Math.round(subtotal),
    vat: Math.round(vat),
    total: Math.round(total),
  };
}

/**
 * Worked Example 1: Small Limited Company
 * Registered capital: 100,000 THB
 * With notary fee only
 */
export const EXAMPLE_1 = calculateCompanyRegistrationCost({
  companyType: 'limited',
  registeredCapital: 100000,
  numberOfPartners: 1,
  includeNotaryFee: true,
  includeLawyerFee: false,
  includeSeal: false,
});

/**
 * Worked Example 2: Medium Limited Company
 * Registered capital: 1,000,000 THB
 * With full services (notary + lawyer + seal)
 */
export const EXAMPLE_2 = calculateCompanyRegistrationCost({
  companyType: 'limited',
  registeredCapital: 1000000,
  numberOfPartners: 2,
  includeNotaryFee: true,
  includeLawyerFee: true,
  includeSeal: true,
});

/**
 * Worked Example 3: Large Limited Company
 * Registered capital: 10,000,000 THB
 * With full services
 */
export const EXAMPLE_3 = calculateCompanyRegistrationCost({
  companyType: 'limited',
  registeredCapital: 10000000,
  numberOfPartners: 5,
  includeNotaryFee: true,
  includeLawyerFee: true,
  includeSeal: true,
});
