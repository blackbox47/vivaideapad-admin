import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { env } from '@/config/env';
import type { UserRole } from '@/models/auth/auth-model';

/**
 * Authentication state shape.
 *
 * Tokens live in HttpOnly cookies set by the backend — the SPA can never read
 * them. The non-HttpOnly `vivaideapad.session` hint cookie carries
 * `{ uid, role, exp }` so we can render role-aware UI on bootstrap without a
 * network round-trip. The hint is non-authoritative: every protected call is
 * still gated by the HttpOnly pair.
 */
interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
}

interface SessionHintPayload {
  uid: string;
  role: UserRole;
  exp: number;
}

const SESSION_COOKIE_NAME = 'vivaideapad.session';

function decodeSessionHint(raw: string): SessionHintPayload | null {
  try {
    const decoded = JSON.parse(atob(raw)) as Partial<SessionHintPayload>;
    if (
      typeof decoded.uid === 'string' &&
      (decoded.role === 'admin' || decoded.role === 'creator') &&
      typeof decoded.exp === 'number'
    ) {
      return { uid: decoded.uid, role: decoded.role, exp: decoded.exp };
    }
    return null;
  } catch {
    return null;
  }
}

function readSessionHint(): Pick<AuthState, 'isAuthenticated' | 'role' | 'userId'> {
  if (typeof document === 'undefined') {
    return { isAuthenticated: false, role: null, userId: null };
  }
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (!match) {
    return { isAuthenticated: false, role: null, userId: null };
  }
  const value = match.slice(SESSION_COOKIE_NAME.length + 1);
  const hint = decodeSessionHint(value);
  if (!hint || hint.exp < Date.now()) {
    return { isAuthenticated: false, role: null, userId: null };
  }
  return {
    isAuthenticated: true,
    role: hint.role,
    userId: hint.uid,
  };
}

const initial: AuthState = env.useMockApi
  ? // Mock API never sees real cookies; the short-circuit in customFetch lets
    // every request through. Seed a fake admin session so role-aware UI works.
    { isAuthenticated: true, role: 'admin', userId: 'mock-user' }
  : {
      isAuthenticated: readSessionHint().isAuthenticated,
      role: readSessionHint().role,
      userId: readSessionHint().userId,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    sessionEstablished: (
      state,
      action: PayloadAction<{ role: UserRole; userId: string }>,
    ) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.userId = null;
    },
    sessionCleared: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.userId = null;
    },
  },
});

export const { sessionEstablished, sessionExpired, sessionCleared } =
  authSlice.actions;

export default authSlice.reducer;