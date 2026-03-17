# FIREBASE_STRUCTURE.md

## Overview

This document describes the Firestore collections and documents used by the Driver Delivery App and the Firebase Cloud Functions.

---

## Collections

### 1. `drivers/{driverId}`

Stores driver profile information.

**Example document:**

```json
{
  "name": "Driver Name",
  "email": "driver@example.com",
  "phone": "+1 555 123 4567",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "lastLoginAt": "2024-01-15T09:30:00.000Z",
  "updatedAt": "2024-01-15T09:30:00.000Z"
}
```

**Fields:**

- `name` (string, optional) — driver display name.
- `email` (string) — driver email address used for authentication.
- `phone` (string) — verified driver phone number.
- `createdAt` (timestamp) — when the driver profile was created.
- `lastLoginAt` (timestamp) — last time the driver logged in.
- `updatedAt` (timestamp, optional) — last time the profile was updated.

---

### 2. `deliveries/{deliveryId}`

Stores individual delivery jobs assigned to drivers.

**Example document:**

```json
{
  "driverId": "driver_123",
  "orderId": "ORDER_1001",
  "customerName": "Jane Doe",
  "address": "123 Main St, Springfield",
  "lat": 37.7749,
  "lng": -122.4194,
  "status": "pending",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```

**Fields:**

- `driverId` (string) — ID of the assigned driver (`drivers/{driverId}`).
- `orderId` (string) — external order identifier.
- `customerName` (string) — name of the customer.
- `address` (string) — human‑readable delivery address.
- `lat` (number) — latitude of the delivery location.
- `lng` (number) — longitude of the delivery location.
- `status` (string) — one of `pending`, `in_progress`, `delivered`.
- `createdAt` (timestamp) — when the delivery was created.

This collection is the source for:

- Driver deliveries list in the app.
- Cloud Function `onDeliveryCreated` trigger for push notifications.

---

### 3. `device_tokens/{driverId}`

Stores the latest FCM device token for each driver.

**Example document:**

```json
{
  "token": "fcm_device_token_here",
  "platform": "android",
  "updatedAt": "2024-01-15T09:35:00.000Z"
}
```

**Fields:**

- `token` (string) — FCM device token.
- `platform` (string) — device platform, e.g. `android` or `ios`.
- `updatedAt` (timestamp) — when the token was last updated.

This collection is read by the Cloud Function to route notifications to the correct device.

---

### 4. `driverOtps/{driverId}`

Stores temporary OTP codes for phone verification.

**Example document:**

```json
{
  "code": "123456",
  "phone": "+1 555 123 4567",
  "createdAt": "2024-01-15T09:25:00.000Z"
}
```

**Fields:**

- `code` (string) — one‑time verification code.
- `phone` (string) — phone number being verified.
- `createdAt` (timestamp) — when the OTP was generated.

This collection is written by the app during OTP request and read during OTP verification.
