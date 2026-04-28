export type UnitCategory = 'length' | 'mass' | 'temperature' | 'area';

export interface UnitConversionInput {
  category: UnitCategory;
  value: number;
  fromUnit: string;
  toUnit: string;
}

const LENGTH_TO_METER: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  ft: 0.3048,
  in: 0.0254,
  mi: 1609.344,
  yd: 0.9144,
};

const MASS_TO_KILOGRAM: Record<string, number> = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  t: 1000,
  lb: 0.45359237,
  oz: 0.028349523125,
};

// Thai area: 1 ไร่ = 4 งาน = 400 ตารางวา = 1,600 ตารางเมตร
// 1 ตารางวา = 4 ตารางเมตร
// 1 งาน = 100 ตารางวา = 400 ตารางเมตร
// 1 เอเคอร์ = 4,046.8564224 ตารางเมตร
const AREA_TO_SQ_METER: Record<string, number> = {
  sqm: 1,
  sqwa: 4,
  ngan: 400,
  rai: 1600,
  acre: 4046.8564224,
};

function toFiniteNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('value must be a finite number');
  }
  return value;
}

function normalizeUnit(unit: string): string {
  return String(unit || '').trim().toLowerCase();
}

function convertByMap(value: number, fromUnit: string, toUnit: string, map: Record<string, number>): number {
  const fromFactor = map[fromUnit];
  const toFactor = map[toUnit];
  if (!fromFactor || !toFactor) {
    throw new Error(`unsupported unit conversion: ${fromUnit} -> ${toUnit}`);
  }
  return (value * fromFactor) / toFactor;
}

function toCelsius(value: number, fromUnit: string): number {
  if (fromUnit === 'c') return value;
  if (fromUnit === 'f') return ((value - 32) * 5) / 9;
  if (fromUnit === 'k') return value - 273.15;
  throw new Error(`unsupported temperature unit: ${fromUnit}`);
}

function fromCelsius(value: number, toUnit: string): number {
  if (toUnit === 'c') return value;
  if (toUnit === 'f') return (value * 9) / 5 + 32;
  if (toUnit === 'k') return value + 273.15;
  throw new Error(`unsupported temperature unit: ${toUnit}`);
}

export function convertUnit(input: UnitConversionInput): number {
  const value = toFiniteNumber(input.value);
  const fromUnit = normalizeUnit(input.fromUnit);
  const toUnit = normalizeUnit(input.toUnit);

  if (!fromUnit || !toUnit) {
    throw new Error('fromUnit and toUnit are required');
  }

  if (fromUnit === toUnit) {
    return value;
  }

  if (input.category === 'length') {
    return convertByMap(value, fromUnit, toUnit, LENGTH_TO_METER);
  }

  if (input.category === 'mass') {
    return convertByMap(value, fromUnit, toUnit, MASS_TO_KILOGRAM);
  }

  if (input.category === 'temperature') {
    const celsius = toCelsius(value, fromUnit);
    return fromCelsius(celsius, toUnit);
  }

  if (input.category === 'area') {
    return convertByMap(value, fromUnit, toUnit, AREA_TO_SQ_METER);
  }

  throw new Error(`unsupported category: ${input.category}`);
}
