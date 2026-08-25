import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  LoginRequest,
  LoginResponse,
  UserRole,
} from '@/models/auth/auth-model';
import { logout as logoutAction, setCredentials } from '@/reducers/auth-slice';
import { useLoginMutation } from '@/services/auth/auth-service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES } from '@/utils/constants/routes';
import {
  AUTH_TOKEN_STORAGE_KEY,
  CREATOR_AUTH_TOKEN_STORAGE_KEY,
  CREATOR_SIGNED_OUT_STORAGE_KEY,
  SIGNED_OUT_STORAGE_KEY,
} from '@/utils/constants/storage-keys';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface LoginOptions {
  /**
   * Hint for which role this login panel is for. The panel knows it was
   * mounted on `/login` (creator) or `/admin/login` (admin), so we trust the
   * caller over the server response when assigning the role claim.
   *
   * When the real backend returns a role claim, this can be dropped.
   */
  asRole?: UserRole;
}

interface UseAuthResult {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  login: (
    credentials: LoginRequest,
    options?: LoginOptions,
  ) => Promise<LoginResponse>;
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
    async (credentials: LoginRequest, options?: LoginOptions) => {
      setLocalError(null);

      try {
        const session = await requestLogin(credentials).unwrap();
        const intendedRole: UserRole = options?.asRole ?? session.role;

        // Persist to the role-appropriate storage key so admin + creator
        // sessions can coexist in different tabs without colliding.
        if (intendedRole === 'creator') {
          localStorage.setItem(
            CREATOR_AUTH_TOKEN_STORAGE_KEY,
            session.token,
          );
          localStorage.removeItem(CREATOR_SIGNED_OUT_STORAGE_KEY);
        } else {
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);
          localStorage.removeItem(SIGNED_OUT_STORAGE_KEY);
        }

        dispatch(
          setCredentials({ token: session.token, role: intendedRole }),
        );

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
    // Clear BOTH storage keys so a future re-login as the other role cannot
    // accidentally pick up a stale token. The full store reset (below) also
    // flushes every RTK Query cache.
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(CREATOR_AUTH_TOKEN_STORAGE_KEY);
    localStorage.setItem(SIGNED_OUT_STORAGE_KEY, 'true');
    localStorage.setItem(CREATOR_SIGNED_OUT_STORAGE_KEY, 'true');
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