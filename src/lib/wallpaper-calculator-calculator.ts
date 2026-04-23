export interface WallpaperCalculatorInput {
  roomHeight: number;
  roomPerimeter: number;
  patternRepeat: number;
  rollLength: number;
}

export interface WallpaperCalculatorResult {
  roomHeight: number;
  roomPerimeter: number;
  patternRepeat: number;
  rollLength: number;
  result: number;
}

export function calculateWallpaperCalculator(input: WallpaperCalculatorInput): WallpaperCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    roomHeight: input.roomHeight,
    roomPerimeter: input.roomPerimeter,
    patternRepeat: input.patternRepeat,
    rollLength: input.rollLength,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateWallpaperCalculator({
  roomHeight: 3, roomPerimeter: 20, patternRepeat: 0.5, rollLength: 10,
});

export const EXAMPLE_2 = calculateWallpaperCalculator({
  roomHeight: 3, roomPerimeter: 25, patternRepeat: 0.5, rollLength: 10,
});

export const EXAMPLE_3 = calculateWallpaperCalculator({
  roomHeight: 3, roomPerimeter: 22, patternRepeat: 0.5, rollLength: 10,
});

