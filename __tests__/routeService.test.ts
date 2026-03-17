import { optimizeRoute } from '@/services/routeService';
import type { Delivery } from '@/types/Delivery';
import { DeliveryStatus } from '@/types/Delivery';

const makeDelivery = (id: string, lat: number, lng: number): Delivery => ({
  id,
  driverId: 'D',
  orderId: id,
  customerName: id,
  address: id,
  lat,
  lng,
  status: DeliveryStatus.Pending,
  createdAt: new Date().toISOString(),
});

describe('optimizeRoute', () => {
  const driver = { lat: 0, lng: 0 };

  beforeEach(() => {
    // @ts-expect-error test override
    global.fetch = undefined;
  });

  it('uses Google mode when preferred and API succeeds', async () => {
    const deliveries = [makeDelivery('A', 1, 1), makeDelivery('B', 2, 2)];

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'OK',
        rows: [
          {
            elements: [
              { status: 'OK', distance: { value: 0 }, duration: { value: 0 } },
              { status: 'OK', distance: { value: 1000 }, duration: { value: 100 } },
              { status: 'OK', distance: { value: 500 }, duration: { value: 50 } },
            ],
          },
          {
            elements: [
              { status: 'OK', distance: { value: 1000 }, duration: { value: 100 } },
              { status: 'OK', distance: { value: 0 }, duration: { value: 0 } },
              { status: 'OK', distance: { value: 800 }, duration: { value: 80 } },
            ],
          },
          {
            elements: [
              { status: 'OK', distance: { value: 500 }, duration: { value: 50 } },
              { status: 'OK', distance: { value: 600 }, duration: { value: 60 } },
              { status: 'OK', distance: { value: 0 }, duration: { value: 0 } },
            ],
          },
        ],
      }),
    });

    // @ts-expect-error test override
    global.fetch = mockFetch;

    const result = await optimizeRoute(driver, deliveries, {
      googleMapsApiKey: 'key',
      preferGoogle: true,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.mode).toBe('google');
    expect(result.orderedDeliveries.map((d) => d.id)).toEqual(['B', 'A']);
    expect(result.totalDurationSec).toBe(110);
  });

  it('falls back to local mode when Google API is denied', async () => {
    const deliveries = [makeDelivery('A', 1, 1), makeDelivery('B', 0.1, 0.1)];

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'REQUEST_DENIED',
        error_message: 'The provided API key is invalid.',
      }),
    });

    // @ts-expect-error test override
    global.fetch = mockFetch;

    const result = await optimizeRoute(driver, deliveries, {
      googleMapsApiKey: 'bad',
      preferGoogle: true,
    });

    expect(result.mode).toBe('local');
    expect(result.googleErrorStatus).toBe('REQUEST_DENIED');
    expect(result.orderedDeliveries.map((d) => d.id)).toEqual(['B', 'A']);
  });

  it('uses local mode when preferGoogle is false', async () => {
    const deliveries = [makeDelivery('A', 1, 1), makeDelivery('B', 0.1, 0.1)];

    const result = await optimizeRoute(driver, deliveries, {
      googleMapsApiKey: 'key',
      preferGoogle: false,
    });

    expect(result.mode).toBe('local');
    expect(result.orderedDeliveries.map((d) => d.id)).toEqual(['B', 'A']);
  });
});
