import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SplashScreen from '../screens/SplashScreen';
import { authenticateBiometric, isBiometricAvailable } from '../services/biometrics';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// How long the splash branding stays on screen before routing.
const SPLASH_DURATION_MS = 2000;

// The launch-time biometric gate. `idle` until boot is ready; `checking` while
// the OS prompt is up; then `passed`/`failed`. `failed` means the user could
// not unlock, so we sign them out and land them on Login.
type BiometricGate = 'idle' | 'checking' | 'passed' | 'failed';

// Decides where the user lands. Phases:
//  1. Boot: show Splash until the 2s minimum has elapsed AND both persisted
//     stores (auth + settings) have rehydrated from AsyncStorage.
//  2. Biometric gate: if a session exists, biometrics is enabled, and the
//     device supports it, prompt before revealing the app. Success → app;
//     failure → sign out → Login.
//  3. Otherwise render the app or auth stack based on auth state.
export default function RootNavigator() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const signOut = useAuthStore((s) => s.signOut);
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const theme = useTheme();
  const navTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist.hasHydrated() && useSettingsStore.persist.hasHydrated(),
  );
  const [gate, setGate] = useState<BiometricGate>('idle');

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_DURATION_MS);

    // Both stores must rehydrate before we read isAuthenticated / biometricEnabled.
    const markHydrated = () => {
      if (useAuthStore.persist.hasHydrated() && useSettingsStore.persist.hasHydrated()) {
        setHydrated(true);
      }
    };
    const unsubAuth = useAuthStore.persist.onFinishHydration(markHydrated);
    const unsubSettings = useSettingsStore.persist.onFinishHydration(markHydrated);

    return () => {
      clearTimeout(timer);
      unsubAuth();
      unsubSettings();
    };
  }, []);

  const isReady = minTimeElapsed && hydrated;

  // Run the biometric gate once boot is ready (and only once).
  useEffect(() => {
    if (!isReady || gate !== 'idle') return;

    let cancelled = false;
    (async () => {
      const needsUnlock = isAuthenticated && biometricEnabled && (await isBiometricAvailable());
      if (!needsUnlock) {
        if (!cancelled) setGate('passed');
        return;
      }
      if (!cancelled) setGate('checking');
      const ok = await authenticateBiometric(t('auth.biometric.promptMessage'));
      if (cancelled) return;
      if (ok) {
        setGate('passed');
      } else {
        // Failed unlock: drop the session and send the user to Login.
        signOut();
        setGate('failed');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isReady, gate, isAuthenticated, biometricEnabled, signOut, t]);

  // Keep Splash up through boot and while the biometric prompt is resolving.
  const showSplash = !isReady || gate === 'idle' || gate === 'checking';

  return (
    <NavigationContainer theme={navTheme}>
      {showSplash ? (
        <SplashScreen />
      ) : isAuthenticated ? (
        <AppNavigator />
      ) : (
        // Unauthenticated (fresh launch, after logout, or failed biometric
        // unlock) always lands on Login — AuthNavigator's default route.
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
