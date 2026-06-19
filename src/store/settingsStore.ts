import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { type AppLanguage } from '../i18n';
import { type ThemeMode } from '../theme/tokens';

type ThemeSetting = ThemeMode | 'system';

// User preferences (language + theme + biometrics), persisted across launches.
type SettingsState = {
  language: AppLanguage;
  themeMode: ThemeSetting;
  /** Whether the user opted into biometric login. Placeholder for a future
   *  Settings screen; read on launch to decide if we gate behind biometrics. */
  biometricEnabled: boolean;
  /** Whether we've already offered to enable biometrics (so the post-login
   *  enroll prompt fires only after the *first* successful auth, not every time). */
  biometricPromptSeen: boolean;
  setLanguage: (language: AppLanguage) => void;
  setThemeMode: (mode: ThemeSetting) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setBiometricPromptSeen: (seen: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: (i18n.language as AppLanguage) ?? 'en',
      themeMode: 'system',
      biometricEnabled: false,
      biometricPromptSeen: false,
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      setThemeMode: (themeMode) => set({ themeMode }),
      setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
      setBiometricPromptSeen: (biometricPromptSeen) => set({ biometricPromptSeen }),
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
