// Shared auth validation — single source of truth for email + password rules.
// Pure functions only (no React), so they're reused across Register, Login,
// and the password-reset screens.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmailValid = (v: string) => EMAIL_RE.test(v.trim());

// Per-rule booleans powering both the live checklist and overall validity.
export const passwordRules = (v: string) => ({
  minLength: v.length >= 8,
  upper: /[A-Z]/.test(v),
  lower: /[a-z]/.test(v),
  number: /[0-9]/.test(v),
  special: /[!@#$%^&*]/.test(v),
});

export const isPasswordValid = (v: string) => Object.values(passwordRules(v)).every(Boolean);

export const RULE_KEYS = ['minLength', 'upper', 'lower', 'number', 'special'] as const;

export type PasswordRuleKey = (typeof RULE_KEYS)[number];
