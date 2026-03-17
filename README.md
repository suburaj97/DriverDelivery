# Driver Delivery App

## 1. Project Overview

This repository contains a **Driver Delivery App** built with **React Native** and **Firebase**.  
The app allows delivery drivers to:

- Authenticate with email and password
- Verify their phone number via OTP
- View assigned deliveries in real time
- See an optimized route on a map
- Receive push notifications when new deliveries are assigned

The backend uses **Firebase Cloud Functions** to send push notifications when new delivery documents are created in Firestore.

---

## 2. Tech Stack

- **Mobile**
  - React Native (TypeScript)
  - React Navigation (native stack)
  - React Native Maps
  - React Native Geolocation Service

- **Backend**
  - Firebase Authentication (Email/Password)
  - Cloud Firestore
  - Firebase Cloud Messaging (FCM)
  - Firebase Cloud Functions (TypeScript, Admin SDK)

- **Utilities**
  - Environment variables via `react-native-dotenv`
  - Axios (optional for future HTTP calls)

---

## 3. Project Structure

High-level structure:

```text
src/
  components/      # Reusable UI components (Button, TextInput, DeliveryCard, etc.)
  screens/         # Screens grouped by domain (Auth, Deliveries, Route)
  navigation/      # React Navigation navigators
  services/        # Firebase and domain logic (auth, driver, deliveries, notifications, route, location)
  hooks/           # Reusable hooks over services/contexts
  context/         # React Context providers (AuthContext, DeliveryContext)
  utils/           # Helper utilities (firestore mapping, dates, location math)
  types/           # Shared TypeScript types and navigation param lists
  config/          # Environment + Firebase initialization

firebase/
  functions/       # Cloud Functions (onDeliveryCreated trigger, messaging helpers)

FIREBASE_STRUCTURE.md  # Firestore collections and example documents
TESTING.md             # Manual testing instructions
APK_BUILD.md           # Android APK build steps
```

---

## 4. Setup Instructions

### 4.1 Prerequisites

- Node.js and npm (or Yarn)
- Android SDK / Android Studio
- Java JDK (for Gradle/Android builds)
- Firebase project

### 4.2 Clone the repository

```bash
git clone <your-repo-url> driver-delivery-app
cd driver-delivery-app
```

### 4.3 Install dependencies

```bash
npm install
```

### 4.4 Configure environment variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the values from your Firebase project settings (Project settings → General → Your apps) and Google Cloud console for `GOOGLE_MAPS_API_KEY`.

### 4.5 Configure Android Firebase files

1. Download `google-services.json` from your Firebase project (Project settings → Your apps → Android).
2. Place it under:

```text
android/app/google-services.json
```

3. Ensure the Android application ID in Firebase matches the one in `android/app/build.gradle`.

### 4.6 Run the Android app (development)

Start Metro bundler and run the app on an Android device/emulator:

```bash
npx react-native start
npx react-native run-android
```

You should see the login screen; after logging in, you will proceed to phone verification (if needed) and then to the deliveries list.

---

## 5. Firebase Setup

### 5.1 Create Firebase project

1. Go to the Firebase console and create a new project.
2. Add an **Android app** and register it with the same application ID as your React Native project.
3. Download and place `google-services.json` in `android/app`.

### 5.2 Enable Authentication

1. In Firebase console → **Authentication** → **Sign-in method**.
2. Enable **Email/Password**.

### 5.3 Enable Firestore

1. In Firebase console → **Firestore Database**.
2. Create a database (start in test or production mode as needed).

The app uses the following collections (see `FIREBASE_STRUCTURE.md` for details):

- `drivers/{driverId}`
- `deliveries/{deliveryId}`
- `device_tokens/{driverId}`
- `driverOtps/{driverId}`

### 5.4 Enable Cloud Messaging

1. In Firebase console → **Cloud Messaging**.
2. Ensure the project has FCM enabled and the Android app is configured.
3. If you need to send push notifications from a server, use **FCM HTTP v1** (recommended) via the Firebase Admin SDK (or the `projects.messages.send` API with a service account). The legacy “server key” / legacy HTTP API is deprecated.

---

## 6. Cloud Functions Setup

The Cloud Functions project lives in `firebase/functions`.

### 6.1 Install and build functions

```bash
cd firebase/functions
npm install
npm run build
```

### 6.2 Deploy functions

Make sure you are authenticated with the Firebase CLI and targeting the correct project:

```bash
firebase login
firebase use <your-project-id>
firebase deploy --only functions
```

The main deployed function is:

- `onDeliveryCreated` — triggers when a new document is added to `deliveries/{deliveryId}` and sends a push notification to the assigned driver, based on their `device_tokens/{driverId}` document.

---

## 7. Triggering a Test Notification

Once your mobile app has registered a device token and written it to `device_tokens/{driverId}`, you can test notifications by manually creating a delivery document.

### 7.1 Create a test delivery document

In Firestore, create a new document in the `deliveries` collection (auto‑ID or specific ID), for example:

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

When this document is created:

1. The `onDeliveryCreated` Cloud Function will run.
2. It reads `driverId` and `orderId` from the document.
3. It fetches the FCM token from `device_tokens/{driverId}`.
4. It sends an FCM notification with:
   - title: `New Delivery Assigned`
   - body: `Order #ORDER_1001 assigned to you`
   - data: `{ "screen": "Deliveries", "deliveryId": "<deliveryId>" }`

On the device, the app handles this notification and navigates to the Deliveries screen when tapped.

---

## 8. Additional Documentation

- **`FIREBASE_STRUCTURE.md`** — Detailed Firestore schema and sample documents.
- **`TESTING.md`** — Manual testing scenarios for authentication, deliveries, routing, and notifications.
- **`APK_BUILD.md`** — Steps to generate a signed Android release APK.

# Driver Delivery App

A React Native application for delivery drivers.

## Features

Authentication with email and OTP

Delivery management

Route optimization

Real-time push notifications

Map visualization

## Setup

1 Install dependencies


npm install


2 Create `.env`


FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=


3 Run app


npx react-native run-android


## Firebase Functions

Deploy:


cd firebase/functions
npm install
firebase deploy


## Test Notification

Add delivery document:


deliveries collection


Driver receives push notification.

## Build APK


cd android
./gradlew assembleRelease


APK located at:


android/app/build/outputs/apk/release
