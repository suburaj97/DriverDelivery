import { optimizeRouteLocal } from '@/utils/routeFallback';
import type { Delivery } from '@/types/Delivery';
import { DeliveryStatus } from '@/types/Delivery';

describe('optimizeRouteLocal', () => {
  it('orders by nearest neighbor using haversine distance', () => {
    const driver = { lat: 0, lng: 0 };

    const deliveries: Delivery[] = [
      {
        id: 'A',
        driverId: 'D',
        orderId: '1',
        customerName: 'A',
        address: 'A',
        lat: 1,
        lng: 1,
        status: DeliveryStatus.Pending,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'B',
        driverId: 'D',
        orderId: '2',
        customerName: 'B',
        address: 'B',
        lat: 0.1,
        lng: 0.1,
        status: DeliveryStatus.Pending,
        createdAt: new Date().toISOString(),
      },
    ];

    const result = optimizeRouteLocal(driver, deliveries);
    expect(result.orderedDeliveries.map((d) => d.id)).toEqual(['B', 'A']);
    expect(result.totalDistanceKm).toBeGreaterThan(0);
  });

  it('returns empty result with no deliveries', () => {
    const result = optimizeRouteLocal({ lat: 0, lng: 0 }, []);
    expect(result.orderedDeliveries).toEqual([]);
    expect(result.totalDistanceKm).toBe(0);
  });
});

