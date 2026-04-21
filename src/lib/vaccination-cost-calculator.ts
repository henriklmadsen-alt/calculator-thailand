/**
 * Thai Vaccination Cost Calculator (คำนวณค่าวัคซีน)
 *
 * Sources:
 * - Ministry of Public Health National Immunization Schedule
 * - Thai CDC (สำนักวัณโรค และโรคปอดอื่น)
 * - Private clinic vaccination rates
 */

export type VaccinationType =
  | 'childhood'
  | 'adult'
  | 'travel'
  | 'seasonal'
  | 'preventive';

export interface VaccinationInput {
  vaccinationType: VaccinationType;
  numberOfVaccines: number;
  facilityType: 'government' | 'private';
  needsBoosterShots: boolean;
}

export interface VaccinationResult {
  initialVaccinationCost: number;
  boosterCostPerShot: number;
  numberOfBooters: number;
  totalBoosterCost: number;
  estimatedTotalCost: number;
  governmentCoverage: number;
  outOfPocket: number;
  vaccinationType: string;
  schedule: string;
}

function getCostPerVaccine(
  vaccinationType: VaccinationType,
  facilityType: 'government' | 'private',
): number {
  const costs = facilityType === 'government'
    ? {
        childhood: 300,
        adult: 400,
        travel: 500,
        seasonal: 200,
        preventive: 600,
      }
    : {
        childhood: 800,
        adult: 1200,
        travel: 1500,
        seasonal: 800,
        preventive: 2000,
      };

  return costs[vaccinationType];
}

export function calculateVaccinationCost(
  input: VaccinationInput,
): VaccinationResult {
  const {
    vaccinationType,
    numberOfVaccines,
    facilityType,
    needsBoosterShots,
  } = input;

  const costPerVaccine = getCostPerVaccine(vaccinationType, facilityType);
  const initialVaccinationCost = costPerVaccine * numberOfVaccines;

  const boosterCostPerShot = costPerVaccine * 0.8; // Boosters cost 80% of initial
  const numberOfBooters = needsBoosterShots ? Math.ceil(numberOfVaccines * 0.5) : 0;
  const totalBoosterCost = boosterCostPerShot * numberOfBooters;

  const estimatedTotalCost = initialVaccinationCost + totalBoosterCost;

  // Government provides free vaccination for childhood vaccines
  const governmentCoverage = vaccinationType === 'childhood'
    ? facilityType === 'government'
      ? estimatedTotalCost
      : initialVaccinationCost * 0.5
    : 0;
  const outOfPocket = estimatedTotalCost - governmentCoverage;

  const schedule =
    vaccinationType === 'childhood'
      ? 'Birth, 2mo, 4mo, 6mo, 12mo, 18mo, 4y'
      : vaccinationType === 'travel'
        ? 'Varies by destination, 4-6 weeks before travel'
        : 'Annual or as recommended';

  return {
    initialVaccinationCost,
    boosterCostPerShot: Math.round(boosterCostPerShot),
    numberOfBooters,
    totalBoosterCost,
    estimatedTotalCost,
    governmentCoverage,
    outOfPocket,
    vaccinationType: `วัคซีน: ${vaccinationType}`,
    schedule,
  };
}
