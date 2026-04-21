/**
 * Thai Chronic Disease Management Cost Calculator (คำนวณค่าจัดการโรคเรื้อรัง)
 *
 * Sources:
 * - Ministry of Public Health Chronic Disease Guidelines
 * - Thai Diabetes, Hypertension, and Asthma Associations
 */

export type ChronicDiseaseType =
  | 'diabetes'
  | 'hypertension'
  | 'asthma'
  | 'copd'
  | 'heartDisease';

export interface ChronicDiseaseInput {
  diseaseType: ChronicDiseaseType;
  followUpPerYear: number;
  facilityType: 'government' | 'private';
}

export interface ChronicDiseaseResult {
  monthlyCost: number;
  annualCost: number;
  medicationCost: number;
  monitoringCost: number;
  otherCosts: number;
  governmentSubsidy: number;
  outOfPocket: number;
  diseaseType: string;
  recommendedMonitoring: string;
}

function getDiseaseCosts(
  diseaseType: ChronicDiseaseType,
  facilityType: 'government' | 'private',
): { medication: number; monitoring: number; other: number } {
  const costs = facilityType === 'government'
    ? {
        diabetes: {
          medication: 500,
          monitoring: 400,
          other: 300,
        },
        hypertension: {
          medication: 300,
          monitoring: 300,
          other: 200,
        },
        asthma: {
          medication: 400,
          monitoring: 300,
          other: 200,
        },
        copd: {
          medication: 600,
          monitoring: 400,
          other: 300,
        },
        heartDisease: {
          medication: 800,
          monitoring: 500,
          other: 400,
        },
      }
    : {
        diabetes: {
          medication: 1500,
          monitoring: 1000,
          other: 800,
        },
        hypertension: {
          medication: 1000,
          monitoring: 800,
          other: 600,
        },
        asthma: {
          medication: 1200,
          monitoring: 900,
          other: 700,
        },
        copd: {
          medication: 2000,
          monitoring: 1200,
          other: 1000,
        },
        heartDisease: {
          medication: 2500,
          monitoring: 1500,
          other: 1200,
        },
      };

  return costs[diseaseType];
}

export function calculateChronicDiseaseCost(
  input: ChronicDiseaseInput,
): ChronicDiseaseResult {
  const {
    diseaseType,
    followUpPerYear,
    facilityType,
  } = input;

  const costs = getDiseaseCosts(diseaseType, facilityType);
  const monthlyCost = costs.medication + costs.monitoring + costs.other;
  const annualCost = monthlyCost * 12;

  const medicationCost = costs.medication * 12;
  const monitoringCost = costs.monitoring * followUpPerYear;
  const otherCosts = costs.other * 12;

  // Thai government provides chronic disease drug subsidy
  const governmentSubsidy = facilityType === 'government'
    ? Math.round(medicationCost * 0.5)
    : 0;
  const outOfPocket = annualCost - governmentSubsidy;

  const recommendedMonitoring =
    diseaseType === 'diabetes'
      ? 'Every 2-3 months with blood tests'
      : diseaseType === 'hypertension'
        ? 'Every 1-3 months'
        : diseaseType === 'asthma'
          ? 'Every 3 months'
          : 'Every 1-2 months';

  return {
    monthlyCost,
    annualCost,
    medicationCost,
    monitoringCost,
    otherCosts,
    governmentSubsidy,
    outOfPocket,
    diseaseType: `โรค: ${diseaseType}`,
    recommendedMonitoring,
  };
}
