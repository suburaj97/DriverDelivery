import { getApp } from '@react-native-firebase/app';
import { getAuth, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  getFirestore,
  type FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  getMessaging,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

/**
 * Firebase initialization module (Android/iOS native).
 *
 * React Native Firebase uses native configuration from `google-services.json`
 * (Android) / `GoogleService-Info.plist` (iOS). No API keys are required in JS.
 *
 * All app code should import initialized instances from here.
 */

const app = getApp();

export const firebaseAuth: FirebaseAuthTypes.Module = getAuth(app);
export const firebaseFirestore: FirebaseFirestoreTypes.Module = getFirestore(app);
export const firebaseMessaging: FirebaseMessagingTypes.Module = getMessaging(app);

export function getFirebaseMessaging(): FirebaseMessagingTypes.Module {
  return firebaseMessaging;
}
