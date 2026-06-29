import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { type AppLanguage } from '../i18n';
import { applyLanguage, isRTLLanguage } from '../i18n/language';
import { type FontSize, type ThemeMode } from '../theme/tokens';

type ThemeSetting = ThemeMode | 'system';

// User preferences (theme, font size, language, biometrics), persisted across
// launches so the app remembers them.
type SettingsState = {
  language: AppLanguage;
  themeMode: ThemeSetting;
  fontSize: FontSize;
  /** Whether the user opted into biometric login. Read on launch to decide if
   *  we gate behind biometrics. */
  biometricEnabled: boolean;
  /** Whether we've already offered to enable biometrics (so the post-login
   *  enroll prompt fires only after the *first* successful auth, not every time). */
  biometricPromptSeen: boolean;
  setLanguage: (language: AppLanguage) => void;
  setThemeMode: (mode: ThemeSetting) => void;
  setFontSize: (size: FontSize) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setBiometricPromptSeen: (seen: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: (i18n.language as AppLanguage) ?? 'en',
      themeMode: 'system',
      fontSize: 'medium',
      biometricEnabled: false,
      biometricPromptSeen: false,
      // Persist the choice and apply it to i18next + layout direction. A
      // direction change triggers a confirm-and-reload (see applyLanguage).
      setLanguage: (language) => {
        set({ language });
        applyLanguage(language);
      },
      setThemeMode: (themeMode) => set({ themeMode }),
      setFontSize: (fontSize) => set({ fontSize }),
      setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
      setBiometricPromptSeen: (biometricPromptSeen) => set({ biometricPromptSeen }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // On boot, sync i18next text to the persisted language. The native RTL
      // flag already persists across launches, so we only align allowRTL here
      // (no reload needed — direction is already consistent).
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
          I18nManager.allowRTL(isRTLLanguage(state.language));
        }
      },
    },
  ),
);
