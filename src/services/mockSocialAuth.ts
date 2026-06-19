import { type AuthSession } from '../store/authStore';

// Mock social sign-in. In a real app each provider would run an OAuth/OIDC
// flow (open a browser, get a provider token, exchange it with our backend for
// our own session token). Here we just fabricate a fixed session after a short
// delay — no provider, no network, no verification — purely for learning.

export type SocialProvider = 'google' | 'apple';

export const MOCK_SOCIAL_TOKEN = 'mock-social-token';

const SOCIAL_USER = { name: 'Social User', email: 'social.user@test.com' } as const;

// Flip to `true` to exercise the error path ("Something went wrong…").
const FORCE_FAILURE = false;

const DELAY_MS = 800;

/** Simulate a social sign-in request. Resolves with the mock session, or
 *  rejects when FORCE_FAILURE is on so callers can show the general error. */
export function mockSocialSignIn(_provider: SocialProvider): Promise<AuthSession> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (FORCE_FAILURE) {
        reject(new Error('mock-social-failed'));
        return;
      }
      resolve({ token: MOCK_SOCIAL_TOKEN, user: { ...SOCIAL_USER } });
    }, DELAY_MS);
  });
}
