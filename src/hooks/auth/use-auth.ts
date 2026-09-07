import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import type {
  LoginRequest,
  LoginResponse,
  UserRole,
} from '@/models/auth/auth-model';
import {
  sessionCleared,
  sessionEstablished,
} from '@/reducers/auth-slice';
import {
  useAdminLoginMutation,
  useLoginMutation,
  useSignOutMutation,
} from '@/services/auth/auth-service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface LoginOptions {
  /**
   * Hint for which role this login panel is for. The panel knows it was
   * mounted on `/login` (creator) or `/admin/login` (admin), so we trust the
   * caller over the server response when assigning the role claim.
   */
  asRole?: UserRole;
}

interface UseAuthResult {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isSigningOut: boolean;
  loginError: string | null;
  login: (
    credentials: LoginRequest,
    options?: LoginOptions,
  ) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  resetLoginError: () => void;
}

export default function useAuth(): UseAuthResult {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.role);
  const [requestLogin, { isLoading, error }] = useLoginMutation();
  const [requestAdminLogin] = useAdminLoginMutation();
  const [requestSignOut, { isLoading: isSigningOut }] = useSignOutMutation();

  // RTK Query only exposes the latest server-reported error; keep a local
  // copy so the form can clear it as soon as the user edits an input.
  const [localError, setLocalError] = useState<string | null>(null);
  const serverError = getApiErrorMessage(error);
  const loginError = localError ?? serverError;

  const login = useCallback(
    async (credentials: LoginRequest, options?: LoginOptions) => {
      setLocalError(null);

      try {
        const intendedRole: UserRole = options?.asRole ?? 'admin';
        // The admin portal calls a dedicated endpoint that rejects
        // non-admin users (e.g. contributors) server-side, so we branch
        // here rather than relying on the response to filter them out.
        const request = intendedRole === 'admin' ? requestAdminLogin : requestLogin;
        const session = await request(credentials).unwrap();

        dispatch(
          sessionEstablished({
            role: intendedRole,
            userId: session.user.id,
          }),
        );

        return session;
      } catch (err) {
        const message = getApiErrorMessage(err);
        setLocalError(message);
        throw err;
      }
    },
    [dispatch, requestAdminLogin, requestLogin],
  );

  const logout = useCallback(async () => {
    try {
      await requestSignOut().unwrap();
    } catch {
      // Network or 4xx — we still clear local state and route to login; the
      // server's HttpOnly cookies either expired or never existed, and the
      // SPA cannot read them to clear them itself.
    }
    dispatch(sessionCleared());
    const dest = role === 'creator' ? CREATOR_ROUTES.login : ADMIN_ROUTES.login;
    navigate({ to: dest, replace: true });
  }, [dispatch, navigate, requestSignOut, role]);

  const resetLoginError = useCallback(() => {
    setLocalError(null);
  }, []);

  return {
    isAuthenticated,
    isLoggingIn: isLoading,
    isSigningOut,
    loginError,
    login,
    logout,
    resetLoginError,
  };
}