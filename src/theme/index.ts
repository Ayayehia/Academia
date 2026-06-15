import { useColorScheme } from 'react-native';

import { useSettingsStore } from '../store/settingsStore';
import { palette, radius, spacing, typography, type ThemeMode } from './tokens';

// Build the active theme object from tokens for a given mode.
export const getTheme = (mode: ThemeMode) => ({
  mode,
  colors: palette[mode],
  spacing,
  radius,
  typography,
});

export type Theme = ReturnType<typeof getTheme>;

// Resolve the effective theme from the settings store + system preference.
export const useTheme = (): Theme => {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const system = useColorScheme();
  const resolved: ThemeMode =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;
  return getTheme(resolved);
};

export { palette, radius, spacing, typography };
export type { ThemeMode };
