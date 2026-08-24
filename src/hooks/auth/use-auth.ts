import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { LoginRequest, LoginResponse } from '@/models/auth/auth-model';
import { logout as logoutAction, setCredentials } from '@/reducers/auth-slice';
import { useLoginMutation } from '@/services/auth/auth-service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES } from '@/utils/constants/routes';
import {
  AUTH_TOKEN_STORAGE_KEY,
  SIGNED_OUT_STORAGE_KEY,
} from '@/utils/constants/storage-keys';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseAuthResult {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  resetLoginError: () => void;
}

export default function useAuth(): UseAuthResult {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const [requestLogin, { isLoading, error }] = useLoginMutation();

  // RTK Query only exposes the latest server-reported error; keep a local
  // copy so the form can clear it as soon as the user edits an input.
  const [localError, setLocalError] = useState<string | null>(null);
  const serverError = getApiErrorMessage(error);
  const loginError = localError ?? serverError;

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLocalError(null);

      try {
        const session = await requestLogin(credentials).unwrap();

        localStorage.removeItem(SIGNED_OUT_STORAGE_KEY);
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);
        dispatch(setCredentials(session.token));

        return session;
      } catch (err) {
        const message = getApiErrorMessage(err);
        setLocalError(message);
        throw err;
      }
    },
    [dispatch, requestLogin],
  );

  const logout = useCallback(() => {
    // Storage is cleared before the action so the reset store cannot re-seed a
    // session from a stale token.
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.setItem(SIGNED_OUT_STORAGE_KEY, 'true');
    dispatch(logoutAction());
    navigate(ADMIN_ROUTES.login, { replace: true });
  }, [dispatch, navigate]);

  const resetLoginError = useCallback(() => {
    setLocalError(null);
  }, []);

  return {
    isAuthenticated: Boolean(token),
    isLoggingIn: isLoading,
    loginError,
    login,
    logout,
    resetLoginError,
  };
}
