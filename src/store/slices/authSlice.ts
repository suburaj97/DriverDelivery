import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Driver } from '@/types/Driver';

export interface AuthState {
  uid: string | null;
  email: string | null;
  driver: Driver | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  uid: null,
  email: null,
  driver: null,
  // Start in a loading state to avoid briefly showing Auth screens before the
  // Firebase `onAuthStateChanged` listener runs on app startup.
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (
      state,
      action: PayloadAction<{ uid: string; email: string | null } | null>,
    ) => {
      state.uid = action.payload?.uid ?? null;
      state.email = action.payload?.email ?? null;
    },
    setDriver: (state, action: PayloadAction<Driver | null>) => {
      state.driver = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.uid = null;
      state.email = null;
      state.driver = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAuthUser,
  setDriver,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
