import { createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from '@react-native-firebase/auth';

import { firebaseAuth } from '@/config/firebaseConfig';
import type { Driver } from '@/types/Driver';
import {
  createDriver,
  getDriver,
  updateDriverOnLogin,
} from '@/services/driverService';
import {
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signOut as signOutService,
} from '@/services/authService';
import {
  getFirebaseAuthErrorCode,
  mapFirebaseAuthErrorCodeToI18nKey,
} from '@/utils/firebaseAuthError';
import {
  clearAuthError,
  logout,
  setAuthError,
  setAuthLoading,
  setAuthUser,
  setDriver,
} from '@/store/slices/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import i18n from '@/i18n';

let authUnsubscribe: (() => void) | null = null;

export const startAuthListener = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>('auth/startAuthListener', async (_arg, thunkApi) => {
  if (authUnsubscribe) {
    return;
  }

  const { dispatch } = thunkApi;
  dispatch(setAuthLoading(true));

  authUnsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
    dispatch(setAuthLoading(true));
    dispatch(clearAuthError());
    dispatch(
      setAuthUser(
        firebaseUser
          ? { uid: firebaseUser.uid, email: firebaseUser.email }
          : null,
      ),
    );

    try {
      if (!firebaseUser) {
        dispatch(setDriver(null));
        dispatch(logout());
        return;
      }

      await dispatch(
        loadDriverProfile({ uid: firebaseUser.uid, email: firebaseUser.email }),
      ).unwrap();
    } catch {
      dispatch(setAuthError(i18n.t('errors.auth.loadAuthStateFailed')));
    } finally {
      dispatch(setAuthLoading(false));
    }
  });
});

export const stopAuthListener = createAsyncThunk<void, void>(
  'auth/stopAuthListener',
  async () => {
    if (authUnsubscribe) {
      authUnsubscribe();
      authUnsubscribe = null;
    }
  },
);

export const loginDriver = createAsyncThunk<
  void,
  { email: string; password: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('auth/loginDriver', async ({ email, password }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(clearAuthError());
  try {
    await signInWithEmailPassword(email, password);
  } catch (err) {
    const code = getFirebaseAuthErrorCode(err);
    const key = mapFirebaseAuthErrorCodeToI18nKey(
      code,
      'errors.auth.signInFailed',
    );
    const msg = i18n.t(key);
    dispatch(setAuthError(msg));
    return rejectWithValue(msg);
  }
});

export const registerDriver = createAsyncThunk<
  void,
  { email: string; password: string; name: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('auth/registerDriver', async ({ email, password, name }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(clearAuthError());
  try {
    const user = await signUpWithEmailPassword(email, password);

    const trimmedName = name.trim();
    if (trimmedName) {
      // Best-effort persistence of name across Auth + Firestore profile.
      // This avoids a race where the auth listener creates the driver profile
      // before displayName is set.
      updateDriverOnLogin(user.uid, { email, name: trimmedName }).catch(() => {});
      user.updateProfile({ displayName: trimmedName }).catch(() => {});
    }
  } catch (err) {
    const code = getFirebaseAuthErrorCode(err);
    const key = mapFirebaseAuthErrorCodeToI18nKey(code, 'errors.auth.signUpFailed');
    const msg = i18n.t(key);
    dispatch(setAuthError(msg));
    return rejectWithValue(msg);
  }
});

export const logoutDriver = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('auth/logoutDriver', async (_arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(clearAuthError());
  try {
    await signOutService();
  } catch {
    dispatch(setAuthError(i18n.t('errors.auth.signOutFailed')));
    return rejectWithValue(i18n.t('errors.auth.signOutFailed'));
  } finally {
    dispatch(logout());
  }
});

export const loadDriverProfile = createAsyncThunk<
  Driver,
  { uid: string; email: string | null },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('auth/loadDriverProfile', async ({ uid, email }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  try {
    const authUser = firebaseAuth.currentUser;
    const authName = authUser?.displayName ?? '';
    const authPhone = authUser?.phoneNumber ?? '';

    const existing = await getDriver(uid);
    if (existing) {
      dispatch(setDriver(existing));
      await updateDriverOnLogin(uid, {
        email: email ?? existing.email,
        name: authName || existing.name,
        phone: existing.phone ? undefined : authPhone,
      });
      return existing;
    }

    const newDriver: Driver = {
      id: uid,
      email: email ?? '',
      name: authName,
      phone: '',
      createdAt: new Date().toISOString(),
    };
    await createDriver(newDriver);
    dispatch(setDriver(newDriver));
    return newDriver;
  } catch {
    dispatch(setAuthError(i18n.t('errors.auth.loadDriverProfileFailed')));
    return rejectWithValue(i18n.t('errors.auth.loadDriverProfileFailed'));
  }
});
