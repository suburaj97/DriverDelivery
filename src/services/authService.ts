import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutAuth,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

import { firebaseAuth } from '@/config/firebaseConfig';
import { getFirebaseAuthErrorCode } from '@/utils/firebaseAuthError';

export const signInWithEmailPassword = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return credential.user;
};

export const signUpWithEmailPassword = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.User> => {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return credential.user;
};

export const signOut = async (): Promise<void> => {
  await signOutAuth(firebaseAuth);
};

export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return firebaseAuth.currentUser;
};

export interface OtpRequestResult {
  verificationId: string;
  autoVerifiedCode: string | null;
}

export const requestOtp = async (phone: string): Promise<OtpRequestResult> => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User must be signed in to request OTP.');
  }

  // Uses Firebase Phone Auth to send an SMS and provide a verificationId.
  // This is secure (rate-limited + verified by Firebase) vs. a Firestore-stored OTP.
  const listener = firebaseAuth.verifyPhoneNumber(phone);

  return new Promise<OtpRequestResult>((resolve, reject) => {
    let resolved = false;
    listener.on(
      'state_changed',
      (snapshot) => {
        if (resolved) return;
        if (snapshot.state === 'error') {
          resolved = true;
          reject(snapshot.error ?? new Error('OTP request failed.'));
          return;
        }

        // "timeout" means auto-retrieval timed out, but we still have a verificationId
        // and can proceed with manual code entry.
        if (
          snapshot.state === 'sent' ||
          snapshot.state === 'verified' ||
          snapshot.state === 'timeout'
        ) {
          resolved = true;
          resolve({
            verificationId: snapshot.verificationId,
            autoVerifiedCode: snapshot.code,
          });
        }
      },
      (err) => {
        if (resolved) return;
        resolved = true;
        reject(err);
      },
    );
  });
};

export const verifyOtp = async (
  verificationId: string,
  code: string,
): Promise<{ ok: true } | { ok: false; errorCode: string | null }> => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User must be signed in to verify OTP.');
  }

  if (!verificationId) {
    throw new Error('Missing verificationId.');
  }

  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);
    await user.updatePhoneNumber(credential);
    return { ok: true };
  } catch (err) {
    return { ok: false, errorCode: getFirebaseAuthErrorCode(err) };
  }
};
