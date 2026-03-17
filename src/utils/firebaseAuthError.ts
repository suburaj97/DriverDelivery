export type FirebaseAuthError = {
  code?: string;
  message?: string;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

export function getFirebaseAuthErrorCode(err: unknown): string | null {
  if (!isObject(err)) return null;
  const code = err.code;
  return typeof code === 'string' ? code : null;
}

export function mapFirebaseAuthErrorCodeToI18nKey(
  code: string | null,
  fallbackKey: string,
): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'errors.auth.emailAlreadyInUse';
    case 'auth/credential-already-in-use':
    case 'auth/phone-number-already-exists':
      return 'errors.auth.phoneAlreadyInUse';
    case 'auth/invalid-email':
      return 'errors.invalidEmail';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'errors.auth.invalidCredentials';
    case 'auth/weak-password':
      return 'errors.auth.weakPassword';
    case 'auth/network-request-failed':
      return 'errors.auth.networkRequestFailed';
    case 'auth/too-many-requests':
      return 'errors.auth.tooManyRequests';
    case 'auth/operation-not-allowed':
      return 'errors.auth.operationNotAllowed';
    default:
      return fallbackKey;
  }
}
