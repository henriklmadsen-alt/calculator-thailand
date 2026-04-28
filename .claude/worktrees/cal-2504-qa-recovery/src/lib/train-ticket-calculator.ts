/**
 * Thai Train Ticket Cost Calculator (KLC-0560)
 * State Railway of Thailand (SRT) fare estimation by distance and class
 */

export type TrainClass = '3rd' | '2nd' | '1st';

export interface TrainTicketResult {
  distance: number;
  trainClass: TrainClass;
  baseFare: number;
  classMultiplier: number;
  totalFare: number;
}

function getClassMultiplier(trainClass: TrainClass): number {
  const multipliers: Record<TrainClass, number> = {
    '3rd': 1.0,
    '2nd': 1.5,
    '1st': 2.2,
  };
  return multipliers[trainClass];
}

function getBaseFare(distance: number): number {
  // Simplified: 5 THB base + 1.5 THB per km
  return 5 + Math.round(distance * 1.5);
}

export function calculateTrainTicket(distance: number, classType: TrainClass): TrainTicketResult {
  const baseFare = getBaseFare(distance);
  const classMultiplier = getClassMultiplier(classType);
  const totalFare = Math.round(baseFare * classMultiplier);

  return {
    distance,
    trainClass: classType,
    baseFare,
    classMultiplier,
    totalFare,
  };
}

/**
 * Example 1: Short journey Bangkok to Ayutthaya, 3rd class (~80 km)
 */
export const EXAMPLE_1 = calculateTrainTicket(80, '3rd');

/**
 * Example 2: Medium journey Bangkok to Chiang Mai, 2nd class (~680 km)
 */
export const EXAMPLE_2 = calculateTrainTicket(680, '2nd');

/**
 * Example 3: Long journey Bangkok to Surat Thani, 1st class (~645 km)
 */
export const EXAMPLE_3 = calculateTrainTicket(645, '1st');
