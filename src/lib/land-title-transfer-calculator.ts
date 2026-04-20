/**
 * Thai Land Title Transfer Fee Calculator (คำนวณค่าโอนที่ดิน)
 *
 * Sources:
 * - Department of Land (กรมที่ดิน)
 * - Land Deed Office (สำนักที่ดิน)
 * - Revenue Code for Stamp Duty and Land Tax
 * - Land Valuation and Tax Schedule 2024/2025
 *
 * Covers:
 * - Land Department registration fee
 * - Stamp duty on transfer deed
 * - Land and Building Tax (New tax)
 * - Capital Gains Tax (if applicable)
 * - Optional lawyer/notary fees
 *
 * Note: Actual fees depend on land value, type, and location.
 * Always consult a lawyer or Land Department for exact amounts.
 */

export type TransferType = 'gift' | 'sale' | 'inheritance' | 'exchange';

export interface LandTitleTransferInput {
  transferType: TransferType;
  landValue: number; // THB
  landArea: number; // rai (1 rai = 1,600 sqm)
  isFirstTimeOwner: boolean;
  includeNotaryFee: boolean;
  includeLawyerFee: boolean;
}

export interface LandTitleTransferResult {
  transferType: TransferType;
  transferTypeName: string;
  landValue: number;
  landArea: number;
  isFirstTimeOwner: boolean;

  // Fees and taxes
  registrationFee: number;
  stampDutyFee: number;
  landBuildingTax: number;
  capitalGainsTax: number;

  // Optional services
  notaryFee: number;
  lawyerFee: number;

  // Summary
  subtotal: number;
  vat: number;
  total: number;
  notes: string[];
}

const TRANSFER_TYPE_NAMES: Record<TransferType, string> = {
  gift: 'โอนให้เป็นของขวัญ (Gift Transfer)',
  sale: 'โอนจากการขายบ้าน (Sale Transfer)',
  inheritance: 'โอนทางมรดก (Inheritance)',
  exchange: 'โอนโดยการแลกเปลี่ยน (Exchange)',
};

/**
 * Land Department Registration Fee
 * Base fee: 20 THB, plus 5 THB per 10,000 THB of land value
 * Source: Land Department Fee Schedule
 */
function getRegistrationFee(landValue: number): number {
  const baseFee = 20;
  const additionalFee = Math.ceil(landValue / 10000) * 5;
  return baseFee + additionalFee;
}

/**
 * Stamp Duty on Transfer Deed
 * Rate: 0.5% of land value, minimum 20 THB
 * Source: Revenue Code
 */
function getStampDutyFee(landValue: number): number {
  const fee = landValue * 0.005;
  return Math.max(fee, 20);
}

/**
 * Land and Building Tax (New Tax - Conditional)
 * For property valued > 5 million THB or transfer > 3 million THB
 * Rate: 0.02% of land value (first time owner exempt)
 * Source: Land and Building Tax Law B.E. 2564
 */
function getLandBuildingTax(landValue: number, isFirstTimeOwner: boolean): number {
  if (isFirstTimeOwner || landValue <= 5000000) {
    return 0; // Exemption for first-time owner or property < 5M
  }
  return landValue * 0.0002;
}

/**
 * Capital Gains Tax (Conditional)
 * Only applies to sale transfers and inheritance in some cases
 * Rate: 15% on gain (sale price - acquisition cost)
 * For simplification, calculated as 5% of land value for sale transfers
 * Source: Revenue Code - Personal Income Tax
 */
function getCapitalGainsTax(transferType: TransferType, landValue: number): number {
  if (transferType === 'sale') {
    // Simplified: assume 5% of land value as taxable gain
    return landValue * 0.05 * 0.15; // 15% tax on estimated 5% gain
  }
  if (transferType === 'inheritance') {
    return 0; // Generally exempt for inheritance
  }
  if (transferType === 'gift') {
    // Gift tax: 7.5% if gift value > 20,000 per recipient
    return Math.max(0, (landValue - 20000) * 0.075);
  }
  return 0;
}

/**
 * Notary Fee
 * Typical range: 1,000-2,500 THB
 */
function getNotaryFee(): number {
  return 1500;
}

/**
 * Lawyer Fee
 * Typical range: 2,000-5,000 THB
 */
function getLawyerFee(): number {
  return 3500;
}

export function calculateLandTitleTransfer(
  input: LandTitleTransferInput,
): LandTitleTransferResult {
  const registrationFee = getRegistrationFee(input.landValue);
  const stampDutyFee = getStampDutyFee(input.landValue);
  const landBuildingTax = getLandBuildingTax(input.landValue, input.isFirstTimeOwner);
  const capitalGainsTax = getCapitalGainsTax(input.transferType, input.landValue);

  const notaryFee = input.includeNotaryFee ? getNotaryFee() : 0;
  const lawyerFee = input.includeLawyerFee ? getLawyerFee() : 0;

  const subtotalBeforeVat = registrationFee + stampDutyFee + landBuildingTax + capitalGainsTax;
  const vatableAmount = notaryFee + lawyerFee;
  const vat = vatableAmount * 0.07;

  const total = subtotalBeforeVat + vatableAmount + vat;

  const notes: string[] = [];
  if (input.isFirstTimeOwner && input.landValue > 5000000) {
    notes.push('First-time owner exemption applied for Land & Building Tax');
  }
  if (input.transferType === 'sale' && input.landValue > 3000000) {
    notes.push('Capital gains tax calculated on estimated gain');
  }
  if (input.transferType === 'gift') {
    notes.push('Gift tax included; may vary by recipient relationship');
  }

  return {
    transferType: input.transferType,
    transferTypeName: TRANSFER_TYPE_NAMES[input.transferType],
    landValue: input.landValue,
    landArea: input.landArea,
    isFirstTimeOwner: input.isFirstTimeOwner,
    registrationFee: Math.round(registrationFee),
    stampDutyFee: Math.round(stampDutyFee),
    landBuildingTax: Math.round(landBuildingTax),
    capitalGainsTax: Math.round(capitalGainsTax),
    notaryFee: Math.round(notaryFee),
    lawyerFee: Math.round(lawyerFee),
    subtotal: Math.round(subtotalBeforeVat + vatableAmount),
    vat: Math.round(vat),
    total: Math.round(total),
    notes,
  };
}

/**
 * Worked Example 1: Gift Transfer of 2M THB Property
 * Small property, first-time recipient, no legal fees
 */
export const EXAMPLE_1 = calculateLandTitleTransfer({
  transferType: 'gift',
  landValue: 2000000,
  landArea: 1,
  isFirstTimeOwner: true,
  includeNotaryFee: false,
  includeLawyerFee: false,
});

/**
 * Worked Example 2: Sale Transfer of 5M THB Property with Lawyer
 * Moderate property, capital gains apply, with lawyer fee
 */
export const EXAMPLE_2 = calculateLandTitleTransfer({
  transferType: 'sale',
  landValue: 5000000,
  landArea: 2,
  isFirstTimeOwner: false,
  includeNotaryFee: true,
  includeLawyerFee: true,
});

/**
 * Worked Example 3: Inheritance Transfer of 8M THB Property
 * Large property, inheritance exemptions apply
 */
export const EXAMPLE_3 = calculateLandTitleTransfer({
  transferType: 'inheritance',
  landValue: 8000000,
  landArea: 3,
  isFirstTimeOwner: true,
  includeNotaryFee: true,
  includeLawyerFee: true,
});
