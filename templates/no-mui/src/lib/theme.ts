export type ColorMode = 'light' | 'dark';

export const colorModeKey = 'color-mode';

export function pickColorMode(saved: string | null, prefersDark: boolean): ColorMode {
  if (saved === 'light' || saved === 'dark') return saved;
  return prefersDark ? 'dark' : 'light';
}
