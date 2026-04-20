/**
 * Air Quality & Health Cost Calculator (KLC-0580)
 */

export interface AirQualityInput {
  aqi: number; // Air Quality Index (0-500)
  daysExposed: number;
  age: number;
}

export interface AirQualityResult {
  aqi: number;
  riskLevel: string;
  healthImpact: string;
  estimatedCostPerDay: number;
  totalCost: number;
}

const AQI_THRESHOLDS = [
  { limit: 50, level: 'Good', cost: 0 },
  { limit: 100, level: 'Moderate', cost: 50 },
  { limit: 150, level: 'Unhealthy for Sensitive Groups', cost: 150 },
  { limit: 200, level: 'Unhealthy', cost: 300 },
  { limit: 300, level: 'Very Unhealthy', cost: 600 },
  { limit: Infinity, level: 'Hazardous', cost: 1000 },
];

export function calculateAirQualityCost(input: AirQualityInput): AirQualityResult {
  let threshold = AQI_THRESHOLDS[0];
  for (const t of AQI_THRESHOLDS) {
    if (input.aqi <= t.limit) {
      threshold = t;
      break;
    }
  }

  const ageAdjustment = input.age > 65 || input.age < 5 ? 1.5 : 1;
  const costPerDay = threshold.cost * ageAdjustment;
  const totalCost = costPerDay * input.daysExposed;

  return {
    aqi: input.aqi,
    riskLevel: threshold.level,
    healthImpact: `Estimated health cost due to air pollution exposure`,
    estimatedCostPerDay: Math.round(costPerDay),
    totalCost: Math.round(totalCost),
  };
}

export const EXAMPLE_1 = calculateAirQualityCost({ aqi: 75, daysExposed: 30, age: 40 });
export const EXAMPLE_2 = calculateAirQualityCost({ aqi: 150, daysExposed: 30, age: 70 });
export const EXAMPLE_3 = calculateAirQualityCost({ aqi: 250, daysExposed: 30, age: 30 });
