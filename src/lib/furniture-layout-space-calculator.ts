export interface FurnitureLayoutSpaceInput {
  roomWidth: number;
  roomLength: number;
  furnitureWidth: number;
  furnitureDepth: number;
}

export interface FurnitureLayoutSpaceResult {
  roomWidth: number;
  roomLength: number;
  furnitureWidth: number;
  furnitureDepth: number;
  result: number;
}

export function calculateFurnitureLayoutSpace(input: FurnitureLayoutSpaceInput): FurnitureLayoutSpaceResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    roomWidth: input.roomWidth,
    roomLength: input.roomLength,
    furnitureWidth: input.furnitureWidth,
    furnitureDepth: input.furnitureDepth,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateFurnitureLayoutSpace({
  roomWidth: 5, roomLength: 6, furnitureWidth: 2, furnitureDepth: 1,
});

export const EXAMPLE_2 = calculateFurnitureLayoutSpace({
  roomWidth: 6, roomLength: 7, furnitureWidth: 2.5, furnitureDepth: 1.2,
});

export const EXAMPLE_3 = calculateFurnitureLayoutSpace({
  roomWidth: 5.5, roomLength: 6.5, furnitureWidth: 2.2, furnitureDepth: 1.1,
});

