// Design tokens — the single source of truth for spacing, radius, type, and color.
// No hardcoded values should appear in screens; consume these instead.

export type ThemeMode = 'light' | 'dark';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  sizes: { sm: 12, md: 14, lg: 16, xl: 20, xxl: 28 },
  weights: { regular: '400', medium: '500', bold: '700' },
} as const;

// User-selectable font size. The scale multiplies every typography token so the
// whole app's text resizes from a single setting.
export type FontSize = 'small' | 'medium' | 'large';

export const fontScale: Record<FontSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.18,
};

export const palette = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F7',
    text: '#11181C',
    textMuted: '#687076',
    primary: '#2F6FED',
    border: '#E2E4E9',
    danger: '#E5484D',
    success: '#2EA043',
    warning: '#D29922',
  },
  dark: {
    background: '#0B0E12',
    surface: '#151A21',
    text: '#ECEDEE',
    textMuted: '#9BA1A6',
    primary: '#5B8DEF',
    border: '#2A2F37',
    danger: '#FF6369',
    success: '#3FB950',
    warning: '#E3B341',
  },
} as const;
