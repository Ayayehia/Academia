import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { type AppLanguage } from '../i18n';
import { type ThemeMode } from '../theme/tokens';

type ThemeSetting = ThemeMode | 'system';

// User preferences (language + theme), persisted across launches.
type SettingsState = {
  language: AppLanguage;
  themeMode: ThemeSetting;
  setLanguage: (language: AppLanguage) => void;
  setThemeMode: (mode: ThemeSetting) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: (i18n.language as AppLanguage) ?? 'en',
      themeMode: 'system',
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Re-apply the persisted language to i18n once rehydrated.
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    },
  ),
);
