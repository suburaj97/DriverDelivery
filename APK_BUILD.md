# ANDROID APK BUILD GUIDE

This document describes how to generate a signed Android release APK for the Driver Delivery App.

---

## 1. Generate a Release Keystore

From your project root (or any directory where you want to store the keystore), run:

```bash
keytool -genkeypair -v -keystore release.keystore -alias deliveryapp -keyalg RSA -keysize 2048 -validity 10000
```

Notes:

- You will be prompted to set a password and some metadata.
- Keep the keystore file (`release.keystore`) and its password safe and **do not commit it to version control**.
- Move `release.keystore` into `android/app/` (or another secure location referenced by Gradle).

---

## 2. Configure `android/gradle.properties`

Open `android/gradle.properties` and add the following properties (adjust values as needed):

```properties
MYAPP_UPLOAD_STORE_FILE=release.keystore
MYAPP_UPLOAD_KEY_ALIAS=deliveryapp
MYAPP_UPLOAD_STORE_PASSWORD=your-keystore-password
MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
```

> For better security, avoid checking real passwords into version control. Use environment-specific gradle.properties or CI secrets.

---

## 3. Configure Signing in `android/app/build.gradle`

Open `android/app/build.gradle` and configure `signingConfigs` and `buildTypes`:

```groovy
android {
    ...

    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            shrinkResources false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Ensure `storeFile` path matches the location of your `release.keystore` (e.g., `file('release.keystore')` for `android/app/release.keystore`).

---

## 4. Build the Release APK

From the project root, run:

```bash
cd android
./gradlew assembleRelease
```

On Windows, use:

```bash
cd android
gradlew assembleRelease
```

Gradle will build a signed release APK using the configured keystore.

---

## 5. APK Output Location

After a successful build, the APK will be generated at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

You can distribute this APK to testers or upload it to the Play Store (after completing the necessary Play Console steps and app signing requirements).

---

## 6. Verify the APK

Install the APK on a device:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

Then:

- Launch the app.
- Verify that authentication, deliveries, map view, route optimization, and push notifications work as expected in release mode.

