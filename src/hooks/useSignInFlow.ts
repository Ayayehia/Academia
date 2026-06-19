import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { isBiometricAvailable } from '../services/biometrics';
import { type AuthSession, useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

// Shared post-auth flow used by every entry point (email/password login,
// register, and social login). Saving the session flips `isAuthenticated`,
// which RootNavigator reacts to by swapping to the app stack — so there's no
// manual navigation to Home. After the *first* successful auth we also offer
// to enable biometric login (once), as long as the device supports it.
export function useSignInFlow() {
  const { t } = useTranslation();
  const signIn = useAuthStore((s) => s.signIn);
  const biometricPromptSeen = useSettingsStore((s) => s.biometricPromptSeen);
  const setBiometricEnabled = useSettingsStore((s) => s.setBiometricEnabled);
  const setBiometricPromptSeen = useSettingsStore((s) => s.setBiometricPromptSeen);

  const completeSignIn = useCallback(
    async (session: AuthSession) => {
      // 1. Save the session → navigates to Home automatically.
      signIn(session);

      // 2. Offer biometrics only once, and only when supported + enrolled.
      if (biometricPromptSeen) return;

      const available = await isBiometricAvailable();
      if (!available) {
        setBiometricPromptSeen(true);
        return;
      }

      Alert.alert(
        t('auth.biometric.enableTitle'),
        t('auth.biometric.enableMessage'),
        [
          {
            text: t('auth.biometric.notNow'),
            style: 'cancel',
            onPress: () => {
              setBiometricEnabled(false);
              setBiometricPromptSeen(true);
            },
          },
          {
            text: t('auth.biometric.enable'),
            onPress: () => {
              setBiometricEnabled(true);
              setBiometricPromptSeen(true);
            },
          },
        ],
      );
    },
    [signIn, biometricPromptSeen, setBiometricEnabled, setBiometricPromptSeen, t],
  );

  return { completeSignIn };
}
