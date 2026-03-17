export enum DeliveryStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Delivered = 'delivered',
}

export interface Delivery {
  id: string;
  driverId: string;
  orderId: string;
  customerName: string;
  address: string;
  lat: number;
  lng: number;
  status: DeliveryStatus;
  createdAt: string;
}
