import { serverTimestamp } from '@react-native-firebase/firestore';

import { firebaseFirestore } from '@/config/firebaseConfig';
import type { Driver } from '@/types/Driver';
import { toDate } from '@/utils/dateUtils';

const DRIVERS_COLLECTION = 'drivers';

export const getDriver = async (driverId: string): Promise<Driver | null> => {
  const snapshot = await firebaseFirestore
    .collection(DRIVERS_COLLECTION)
    .doc(driverId)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    email: (data as any).email ?? '',
    phone: (data as any).phone ?? '',
    phoneVerifiedAt:
      toDate((data as any).phoneVerifiedAt)?.toISOString() ?? undefined,
    createdAt:
      toDate((data as any).createdAt)?.toISOString() ?? new Date().toISOString(),
  };
};

export const createDriver = async (driver: Driver): Promise<void> => {
  await firebaseFirestore.collection(DRIVERS_COLLECTION).doc(driver.id).set({
    email: driver.email,
    phone: driver.phone ?? '',
    phoneVerifiedAt: driver.phoneVerifiedAt ? new Date(driver.phoneVerifiedAt) : null,
    createdAt: new Date(driver.createdAt),
    lastLoginAt: serverTimestamp(),
  });
};

export const updateDriverPhone = async (
  driverId: string,
  phone: string,
): Promise<void> => {
  await firebaseFirestore.collection(DRIVERS_COLLECTION).doc(driverId).update({
    phone,
    phoneVerifiedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateLastLogin = async (driverId: string): Promise<void> => {
  await firebaseFirestore.collection(DRIVERS_COLLECTION).doc(driverId).set(
    {
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
};
