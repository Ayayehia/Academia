import { useColorScheme } from 'react-native';

import { useSettingsStore } from '../store/settingsStore';
import { fontScale, palette, radius, spacing, typography, type ThemeMode } from './tokens';

// Build the active theme object from tokens for a given mode. `scale` multiplies
// the typography sizes so the font-size setting resizes text app-wide.
export const getTheme = (mode: ThemeMode, scale = 1) => ({
  mode,
  colors: palette[mode],
  spacing,
  radius,
  typography: {
    sizes: {
      sm: Math.round(typography.sizes.sm * scale),
      md: Math.round(typography.sizes.md * scale),
      lg: Math.round(typography.sizes.lg * scale),
      xl: Math.round(typography.sizes.xl * scale),
      xxl: Math.round(typography.sizes.xxl * scale),
    },
    weights: typography.weights,
  },
});

export type Theme = ReturnType<typeof getTheme>;

// Resolve the effective theme from the settings store + system preference.
// Subscribing to themeMode AND fontSize makes both apply instantly everywhere.
export const useTheme = (): Theme => {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const system = useColorScheme();
  const resolved: ThemeMode =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;
  return getTheme(resolved, fontScale[fontSize]);
};

export { palette, radius, spacing, typography };
export type { ThemeMode };
