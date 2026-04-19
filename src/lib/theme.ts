export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeContrastPair {
  label: string;
  foreground: string;
  background: string;
  minimumRatio: number;
}

const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

export const THEME_STORAGE_KEY = 'ct.theme-preference.v1';
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export function resolveThemePreference(value: string | null | undefined): ThemePreference {
  if (!value) {
    return DEFAULT_THEME_PREFERENCE;
  }
  if ((THEME_PREFERENCES as readonly string[]).includes(value)) {
    return value as ThemePreference;
  }
  return DEFAULT_THEME_PREFERENCE;
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): EffectiveTheme {
  if (preference === 'dark') {
    return 'dark';
  }
  if (preference === 'light') {
    return 'light';
  }
  return systemPrefersDark ? 'dark' : 'light';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.trim().replace('#', '');
  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

function toLinearChannel(channel: number): number {
  const sRgb = channel / 255;
  if (sRgb <= 0.03928) {
    return sRgb / 12.92;
  }
  return ((sRgb + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const red = toLinearChannel(r);
  const green = toLinearChannel(g);
  const blue = toLinearChannel(b);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const fg = relativeLuminance(foregroundHex);
  const bg = relativeLuminance(backgroundHex);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

export const DARK_THEME_CONTRAST_PAIRS: readonly ThemeContrastPair[] = [
  {
    label: 'Body text on page background',
    foreground: '#e2e8f0',
    background: '#020617',
    minimumRatio: 4.5,
  },
  {
    label: 'Strong text on card background',
    foreground: '#f8fafc',
    background: '#0f172a',
    minimumRatio: 4.5,
  },
  {
    label: 'Muted text on card background',
    foreground: '#cbd5e1',
    background: '#111827',
    minimumRatio: 4.5,
  },
  {
    label: 'Primary link on page background',
    foreground: '#7dd3fc',
    background: '#020617',
    minimumRatio: 4.5,
  },
  {
    label: 'Alert text on dark warning surface',
    foreground: '#fef3c7',
    background: '#3f2d0b',
    minimumRatio: 4.5,
  },
];
