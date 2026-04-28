/**
 * Thai Pregnancy & Maternity Cost Estimator (คำนวณค่าใช้จ่ายการตั้งครรภ์)
 *
 * Sources:
 * - Ministry of Public Health Hospital Tariffs
 * - Thai Obstetrician Association (สมาคมสูติแพทย์ไทย)
 * - Hospital Association Thailand maternity package rates
 *
 * Includes:
 * - Prenatal visits and screening
 * - Delivery method (vaginal vs cesarean)
 * - Postnatal care
 * - Hospital type (government vs private)
 */

export type DeliveryType = 'vaginal' | 'cesarean';
export type HospitalType = 'government' | 'private';

export interface PregnancyCostInput {
  hospitalType: HospitalType;
  deliveryType: DeliveryType;
  numberOfVisits: number; // Typical 10-15 prenatal visits
  hasInsurance: boolean;
}

export interface PregnancyCostResult {
  prenatalVisitsCost: number;
  deliveryCost: number;
  postnatalCost: number;
  babylabTests: number;
  subtotal: number;
  insuranceCoverage: number;
  outOfPocket: number;
  hospitalType: string;
  deliveryType: string;
  monthlyBreakdown: number; // Estimate per month
}

function getPrenatalCostPerVisit(hospitalType: HospitalType): number {
  return hospitalType === 'government' ? 500 : 1500;
}

function getDeliveryCost(
  hospitalType: HospitalType,
  deliveryType: DeliveryType,
): number {
  if (hospitalType === 'government') {
    return deliveryType === 'vaginal' ? 5000 : 8000;
  } else {
    return deliveryType === 'vaginal' ? 20000 : 35000;
  }
}

function getPostnatalCost(hospitalType: HospitalType): number {
  // Usually 2-3 days postpartum care
  return hospitalType === 'government' ? 3000 : 10000;
}

export function calculatePregnancyCost(
  input: PregnancyCostInput,
): PregnancyCostResult {
  const {
    hospitalType,
    deliveryType,
    numberOfVisits,
    hasInsurance,
  } = input;

  const prenatalVisitsCost = getPrenatalCostPerVisit(hospitalType) * numberOfVisits;
  const deliveryCost = getDeliveryCost(hospitalType, deliveryType);
  const postnatalCost = getPostnatalCost(hospitalType);
  const babylabTests = hospitalType === 'government' ? 1000 : 2500;

  const subtotal = prenatalVisitsCost + deliveryCost + postnatalCost + babylabTests;

  // Insurance coverage typically 80-90% for maternity
  const insuranceRate = hasInsurance ? (hospitalType === 'government' ? 0.9 : 0.8) : 0;
  const insuranceCoverage = Math.round(subtotal * insuranceRate);
  const outOfPocket = subtotal - insuranceCoverage;

  const monthlyBreakdown = Math.round(subtotal / 9); // Average over 9 months

  return {
    prenatalVisitsCost,
    deliveryCost,
    postnatalCost,
    babylabTests,
    subtotal,
    insuranceCoverage,
    outOfPocket,
    hospitalType: hospitalType === 'government' ? 'โรงพยาบาลรัฐ' : 'โรงพยาบาลเอกชน',
    deliveryType: deliveryType === 'vaginal' ? 'คลอดตามธรรมชาติ' : 'คลอดผ่าตัด',
    monthlyBreakdown,
  };
}
