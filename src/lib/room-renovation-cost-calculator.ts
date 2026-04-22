export interface RoomRenovationCostInput {
  roomArea: number;
  costPerSquareMeter: number;
  additionalFixtures: number;
}

export interface RoomRenovationCostResult {
  roomArea: number;
  costPerSquareMeter: number;
  additionalFixtures: number;
  result: number;
}

export function calculateRoomRenovationCost(input: RoomRenovationCostInput): RoomRenovationCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    roomArea: input.roomArea,
    costPerSquareMeter: input.costPerSquareMeter,
    additionalFixtures: input.additionalFixtures,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRoomRenovationCost({
  roomArea: 20, costPerSquareMeter: 8000, additionalFixtures: 25000,
});

export const EXAMPLE_2 = calculateRoomRenovationCost({
  roomArea: 30, costPerSquareMeter: 10000, additionalFixtures: 40000,
});

export const EXAMPLE_3 = calculateRoomRenovationCost({
  roomArea: 25, costPerSquareMeter: 9000, additionalFixtures: 30000,
});

