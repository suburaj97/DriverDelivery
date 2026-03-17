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
    name: (data as any).name ?? '',
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
    name: driver.name ?? '',
    phone: driver.phone ?? '',
    phoneVerifiedAt: driver.phoneVerifiedAt ? new Date(driver.phoneVerifiedAt) : null,
    createdAt: new Date(driver.createdAt),
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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

export const updateDriverOnLogin = async (
  driverId: string,
  input: { email?: string; name?: string; phone?: string },
): Promise<void> => {
  const payload: Record<string, unknown> = {
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (input.email) payload.email = input.email;
  if (input.name) payload.name = input.name;
  if (input.phone) payload.phone = input.phone;

  await firebaseFirestore.collection(DRIVERS_COLLECTION).doc(driverId).set(payload, {
    merge: true,
  });
};

export const updateLastLogin = async (driverId: string): Promise<void> => {
  await updateDriverOnLogin(driverId, {});
};
