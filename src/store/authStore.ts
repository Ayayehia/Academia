import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Mock auth state. No real backend yet — just the shape the app navigation
// reacts to, plus the registered user, persisted across launches.
export type AuthUser = {
  name: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  /** Save a (mock) session: token + user. Flips the app into the authed stack. */
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      signIn: ({ token, user }) => set({ token, user, isAuthenticated: true }),
      signOut: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
