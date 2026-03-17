import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginDriver,
  logoutDriver,
  registerDriver,
} from '@/store/thunks/authThunks';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { uid, email, driver, loading, error } = useAppSelector(
    (state) => state.auth,
  );

  const signIn = useCallback(
    async (inputEmail: string, password: string) => {
      await dispatch(
        loginDriver({ email: inputEmail.trim(), password }),
      ).unwrap();
    },
    [dispatch],
  );

  const signOut = useCallback(async () => {
    await dispatch(logoutDriver()).unwrap();
  }, [dispatch]);

  const signUp = useCallback(
    async (inputEmail: string, password: string) => {
      await dispatch(
        registerDriver({ email: inputEmail.trim(), password }),
      ).unwrap();
    },
    [dispatch],
  );

  return {
    uid,
    email,
    driver,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
};
