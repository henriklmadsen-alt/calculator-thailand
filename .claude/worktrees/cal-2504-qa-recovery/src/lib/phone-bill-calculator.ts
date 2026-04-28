// Phone bill calculator — estimates monthly mobile phone costs for Thai operators.
// Reference: AIS, TrueMove H, DTAC publicly listed rates (2569).
// VAT 7% applied per Revenue Department extension through 30 Sep 2569.

export const PHONE_VAT_RATE = 0.07;

export type PhoneProvider = 'ais' | 'true' | 'dtac';
export type PhonePlanType = 'postpaid' | 'prepaid';

export interface ProviderExcessRates {
  callPerMinute: number; // THB per minute beyond package
  dataPerMB: number; // THB per MB beyond package (or per-day charge equiv)
  smsPerMessage: number; // THB per SMS
}

// Approximate excess-usage rates per provider (2569).
// Source: AIS/TrueMove H/DTAC rate cards for voice, SMS, and data overage.
const PROVIDER_EXCESS_RATES: Record<PhoneProvider, ProviderExcessRates> = {
  ais: { callPerMinute: 1.5, dataPerMB: 1.5, smsPerMessage: 2.0 },
  true: { callPerMinute: 1.5, dataPerMB: 1.5, smsPerMessage: 2.0 },
  dtac: { callPerMinute: 1.5, dataPerMB: 1.5, smsPerMessage: 2.0 },
};

export interface PhoneBillInput {
  provider: PhoneProvider;
  planType: PhonePlanType;
  packagePrice: number; // Monthly package / top-up amount (THB)
  excessCallMinutes: number; // Call minutes beyond package
  excessDataMB: number; // Data MB beyond package
  smsCount: number; // SMS sent
  addonServices: number; // Additional services (THB)
}

export interface PhoneBillBreakdownItem {
  label: string;
  amount: number;
}

export interface PhoneBillResult {
  provider: PhoneProvider;
  planType: PhonePlanType;
  packagePrice: number;
  excessCallCharge: number;
  excessDataCharge: number;
  smsCharge: number;
  addonServices: number;
  subtotalBeforeVat: number;
  vatAmount: number;
  totalBill: number;
  breakdown: PhoneBillBreakdownItem[];
  appliedRates: ProviderExcessRates;
}

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getProviderExcessRates(provider: PhoneProvider): ProviderExcessRates {
  return PROVIDER_EXCESS_RATES[provider] ?? PROVIDER_EXCESS_RATES.ais;
}

export function calculatePhoneBill(input: PhoneBillInput): PhoneBillResult {
  const provider = input.provider;
  const planType = input.planType;
  const packagePrice = sanitizeNumber(input.packagePrice);
  const excessCallMinutes = sanitizeNumber(input.excessCallMinutes);
  const excessDataMB = sanitizeNumber(input.excessDataMB);
  const smsCount = sanitizeNumber(input.smsCount);
  const addonServices = sanitizeNumber(input.addonServices);

  const rates = getProviderExcessRates(provider);

  const excessCallCharge = roundCurrency(excessCallMinutes * rates.callPerMinute);
  const excessDataCharge = roundCurrency(excessDataMB * rates.dataPerMB);
  const smsCharge = roundCurrency(smsCount * rates.smsPerMessage);

  const subtotalBeforeVat = roundCurrency(
    packagePrice + excessCallCharge + excessDataCharge + smsCharge + addonServices,
  );
  const vatAmount = roundCurrency(subtotalBeforeVat * PHONE_VAT_RATE);
  const totalBill = roundCurrency(subtotalBeforeVat + vatAmount);

  const breakdown: PhoneBillBreakdownItem[] = [
    { label: 'ค่าแพ็กเกจรายเดือน / เติมเงิน', amount: packagePrice },
  ];
  if (excessCallCharge > 0) {
    breakdown.push({ label: `ค่าโทรเกินแพ็กเกจ (${excessCallMinutes} นาที × ${rates.callPerMinute} บาท)`, amount: excessCallCharge });
  }
  if (excessDataCharge > 0) {
    breakdown.push({ label: `ค่าเน็ตเกินแพ็กเกจ (${excessDataMB} MB × ${rates.dataPerMB} บาท)`, amount: excessDataCharge });
  }
  if (smsCharge > 0) {
    breakdown.push({ label: `ค่า SMS (${smsCount} ข้อความ × ${rates.smsPerMessage} บาท)`, amount: smsCharge });
  }
  if (addonServices > 0) {
    breakdown.push({ label: 'ค่าบริการเสริม', amount: addonServices });
  }
  breakdown.push({ label: 'รวมก่อน VAT', amount: subtotalBeforeVat });
  breakdown.push({ label: 'VAT 7%', amount: vatAmount });
  breakdown.push({ label: 'รวมทั้งหมด', amount: totalBill });

  return {
    provider,
    planType,
    packagePrice,
    excessCallCharge,
    excessDataCharge,
    smsCharge,
    addonServices,
    subtotalBeforeVat,
    vatAmount,
    totalBill,
    breakdown,
    appliedRates: rates,
  };
}
