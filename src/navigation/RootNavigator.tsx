import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { useEffect, useState } from 'react';

import SplashScreen from '../screens/SplashScreen';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// How long the splash branding stays on screen before routing.
const SPLASH_DURATION_MS = 2000;

// Decides where the user lands. Three phases:
//  1. Boot: show Splash until the 2s minimum has elapsed AND the persisted
//     auth state has rehydrated from AsyncStorage (avoids reading a stale
//     default and flashing the wrong stack).
//  2/3. Once ready, declaratively render the app or auth stack based on auth.
export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const theme = useTheme();
  const navTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_DURATION_MS);
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  const isReady = minTimeElapsed && hydrated;

  return (
    <NavigationContainer theme={navTheme}>
      {!isReady ? (
        <SplashScreen />
      ) : isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
