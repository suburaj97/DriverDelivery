import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { firebaseFirestore } from '@/config/firebaseConfig';
import type { Delivery } from '@/types/Delivery';
import { DeliveryStatus } from '@/types/Delivery';
import { toDate } from '@/utils/dateUtils';

const DELIVERIES_COLLECTION = 'deliveries';

const mapDeliveryFromDoc = (
  id: string,
  data: FirebaseFirestoreTypes.DocumentData,
): Delivery => {
  const raw = data as any;
  const lat =
    typeof raw.lat === 'number'
      ? raw.lat
      : typeof raw.latitude === 'number'
        ? raw.latitude
        : Number(raw.lat ?? raw.latitude);
  const lng =
    typeof raw.lng === 'number'
      ? raw.lng
      : typeof raw.longitude === 'number'
        ? raw.longitude
        : Number(raw.lng ?? raw.longitude);

  return {
    id,
    driverId: String(raw.driverId ?? ''),
    orderId: String(raw.orderId ?? ''),
    customerName: String(raw.customerName ?? ''),
    address: String(raw.address ?? ''),
    lat: Number.isFinite(lat) ? lat : 0,
    lng: Number.isFinite(lng) ? lng : 0,
    status: (raw.status as DeliveryStatus) ?? DeliveryStatus.Pending,
    createdAt: raw.createdAt as any,
  } as Delivery;
};

const normalizeDeliveries = (items: Delivery[]): Delivery[] =>
  items.map((item) => {
    const createdAt =
      typeof item.createdAt === 'string'
        ? item.createdAt
        : (toDate(item.createdAt)?.toISOString() ?? new Date().toISOString());

    return {
      ...item,
      createdAt,
    };
  });

export const subscribeToDriverDeliveries = (
  driverId: string,
  callback: (deliveries: Delivery[]) => void,
  onError?: () => void,
): (() => void) => {
  return firebaseFirestore
    .collection(DELIVERIES_COLLECTION)
    .where('driverId', '==', driverId)
    .onSnapshot(
      (snapshot) => {
        const raw = snapshot.docs.map((docSnap) =>
          mapDeliveryFromDoc(docSnap.id, docSnap.data()),
        );
        callback(normalizeDeliveries(raw));
      },
      () => {
        onError?.();
      },
    );
};

export const getDriverDeliveries = async (
  driverId: string,
): Promise<Delivery[]> => {
  const snapshot = await firebaseFirestore
    .collection(DELIVERIES_COLLECTION)
    .where('driverId', '==', driverId)
    .get();
  const raw = snapshot.docs.map((docSnap) =>
    mapDeliveryFromDoc(docSnap.id, docSnap.data()),
  );
  return normalizeDeliveries(raw);
};

export const getDeliveryById = async (
  deliveryId: string,
): Promise<Delivery | null> => {
  const snapshot = await firebaseFirestore
    .collection(DELIVERIES_COLLECTION)
    .doc(deliveryId)
    .get();
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  if (!data) return null;
  const mapped = mapDeliveryFromDoc(snapshot.id, data);
  return normalizeDeliveries([mapped])[0] ?? null;
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: DeliveryStatus,
): Promise<void> => {
  await firebaseFirestore.collection(DELIVERIES_COLLECTION).doc(deliveryId).update({
    status,
  });
};
