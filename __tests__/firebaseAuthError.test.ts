import { mapFirebaseAuthErrorCodeToI18nKey } from '@/utils/firebaseAuthError';

describe('firebaseAuthError', () => {
  test('maps phone already in use errors', () => {
    expect(
      mapFirebaseAuthErrorCodeToI18nKey(
        'auth/credential-already-in-use',
        'errors.auth.signUpFailed',
      ),
    ).toBe('errors.auth.phoneAlreadyInUse');

    expect(
      mapFirebaseAuthErrorCodeToI18nKey(
        'auth/phone-number-already-exists',
        'errors.auth.signUpFailed',
      ),
    ).toBe('errors.auth.phoneAlreadyInUse');
  });
});

