# TESTING GUIDE

This document describes how to manually test the main flows of the Driver Delivery App.

---

## 1. Authentication Flow

### 1.1 Email/Password Login

1. Launch the app on an Android device or emulator.
2. On the **Login** screen, enter a test email and password that exist in Firebase Authentication.
3. Tap **Login**.

**Expected behavior:**

- If credentials are valid, the app authenticates the user.
- If the driver profile does not exist yet, it is created in `drivers/{driverId}`.
- If authentication fails, an error is shown in the `ErrorBanner`.

---

## 2. Phone Verification

> Note: OTP is mocked and stored in Firestore (no real SMS integration).

1. After login, navigate to **Phone Verification** (if not automatically routed).
2. Enter a test phone number.
3. Tap **Send OTP**.
4. Check Firestore collection `driverOtps/{driverId}` for the generated `code` (or rely on success flow).
5. Enter the OTP code in the app.
6. Tap **Verify**.

**Expected behavior:**

- An OTP document is written to `driverOtps/{driverId}`.
- When the correct code is submitted, verification succeeds.
- The driver’s `phone` field is updated in `drivers/{driverId}`.
- The screen navigates back to the login (or into the main app depending on flow).

---

## 3. Deliveries List and Real-Time Updates

1. Ensure you are logged in as a driver and have a valid driver profile.
2. Navigate to the **Deliveries** screen (main screen after auth).
3. In Firestore, create or update documents in `deliveries` with `driverId` equal to the current user’s ID.

**Expected behavior:**

- The list of deliveries displays all documents where `driverId` equals the current driver.
- Changes to delivery documents (e.g., status updates) appear in real time without reloading the screen.
- Pull‑to‑refresh triggers a fresh fetch of deliveries from Firestore.

---

## 4. Mark Delivery as Delivered

1. On the **Deliveries** screen, locate a delivery with status `pending` or `in_progress`.
2. Tap **Mark Delivered** on its card.

**Expected behavior:**

- The app calls `updateDeliveryStatus(deliveryId, delivered)`.
- The corresponding Firestore document’s `status` field becomes `delivered`.
- The UI updates to show the new status.
- On the **Optimized Route** screen, delivered stops are excluded from the active route.

---

## 5. Route Optimization

1. Ensure there are multiple active deliveries (status not `delivered`) assigned to the logged‑in driver.
2. From the **Deliveries** screen, tap **View Optimized Route**.

**Expected behavior:**

- The app obtains the driver’s current location (prompting for location permission if necessary).
- The app computes an optimized route using a nearest‑neighbour algorithm.
- The **Optimized Route** screen shows:
  - A map with:
    - A marker for the driver’s current location.
    - Markers for each active delivery stop.
    - A polyline connecting the driver and stops in optimized order.
  - A list of deliveries below the map in optimized order.

3. Mark a delivery as delivered from the **Optimized Route** screen.

**Expected behavior:**

- The delivery’s status becomes `delivered`.
- The route is recomputed, excluding delivered stops.

---

## 6. Push Notifications

### 6.1 Token Registration

1. Install and open the app on a physical Android device (FCM is most reliable on-device).
2. Grant notification permission when prompted.
3. Ensure you are logged in as a driver.

**Expected behavior:**

- The app requests notification permission.
- The device obtains an FCM token.
- A document is written/updated in `device_tokens/{driverId}` containing `token`, `platform`, and `updatedAt`.

### 6.2 Notification Trigger

1. In Firestore, create a document in `deliveries` with:

```json
{
  "driverId": "<driverId>",
  "orderId": "ORDER_1001",
  "customerName": "Test Customer",
  "address": "Test Address",
  "lat": 37.7749,
  "lng": -122.4194,
  "status": "pending"
}
```

2. Ensure Cloud Functions are deployed.

**Expected behavior:**

- The `onDeliveryCreated` function is triggered.
- It reads the new delivery document and the driver’s token from `device_tokens/{driverId}`.
- A push notification is sent to the device.

### 6.3 Notification Handling

Test in three app states:

1. **Foreground** (app open)
2. **Background** (app in background)
3. **Killed** (app fully closed)

**Expected behavior:**

- The notification appears with:
  - Title: `New Delivery Assigned`
  - Body: `Order #ORDER_1001 assigned to you`
- When the notification is tapped:
  - The app opens and navigates to the **Deliveries** screen.

---

## 7. Regression Checklist

- [ ] Login succeeds with valid credentials and shows an error for invalid ones.
- [ ] Phone verification flow updates `drivers/{driverId}.phone`.
- [ ] Deliveries list loads and updates in real time.
- [ ] Marking a delivery as delivered updates Firestore and UI.
- [ ] Optimized route shows markers, polyline, and ordered list.
- [ ] Device token is stored in `device_tokens/{driverId}`.
- [ ] Creating a delivery triggers a push notification.
- [ ] Tapping the notification navigates to **Deliveries**.

