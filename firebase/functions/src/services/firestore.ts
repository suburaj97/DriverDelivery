import { firestore } from '../config';

const DEVICE_TOKENS_COLLECTION = 'device_tokens';

export const getDeviceTokenForDriver = async (
  driverId: string,
): Promise<string | null> => {
  const docRef = firestore
    .collection(DEVICE_TOKENS_COLLECTION)
    .doc(driverId);

  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data() as { token?: string } | undefined;
  return data?.token ?? null;
};

