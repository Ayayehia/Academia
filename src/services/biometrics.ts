import * as LocalAuthentication from 'expo-local-authentication';

// Thin wrapper over expo-local-authentication. Biometrics is only a *local
// gate* (the OS proves the device owner is present and returns yes/no) — it
// never replaces our stored session token, it just guards access to it.

/** True only when the device has a biometric sensor AND the user has enrolled
 *  Face ID / Touch ID / a fingerprint. Both must hold to prompt. */
export async function isBiometricAvailable(): Promise<boolean> {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hasHardware && isEnrolled;
}

/** Show the OS biometric dialog. Returns whether authentication succeeded. */
export async function authenticateBiometric(promptMessage: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    // Allow the device passcode as a fallback so users aren't locked out.
    disableDeviceFallback: false,
  });
  return result.success;
}
