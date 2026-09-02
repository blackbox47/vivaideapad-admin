import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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

/**
 * Wire shape the backend encodes into the session hint cookie.
 *
 * Note: `role` is a numeric `UserRole` from
 * `vivaideapad-api/src/users/entities/user.entity.ts:11-17` —
 *   1 = SUPERADMIN, 2 = ADMINISTRATOR, 3 = CONTRIBUTOR
 * Not the string literal the SPA uses internally (`'admin' | 'creator'`).
 * `decodeSessionHint` maps the numeric value to the SPA's string form.
 */
interface SessionHintPayload {
  uid: string;
  role: UserRole;
  exp: number;
}

const SESSION_COOKIE_NAME = 'vivaideapad.session';

/**
 * Decode a base64url-encoded string. The backend uses `Buffer#toString(
 * 'base64url')` which differs from RFC 4648 base64 in two ways:
 *   - `-` / `_` instead of `+` / `/`
 *   - no `=` padding
 *
 * The browser's `atob` only handles standard base64, so any cookie whose
 * encoded form contains `-` or `_` (or is missing padding) would throw
 * `InvalidCharacterError` and force a sign-out on hard refresh.
 */
function b64UrlDecode(raw: string): string {
  const std = raw.replace(/-/g, '+').replace(/_/g, '/');
  const padded = std + '='.repeat((4 - (std.length % 4)) % 4);
  return atob(padded);
}

/**
 * Map a backend `UserRole` (numeric) to the SPA's `UserRole` (string literal).
 * SUPERADMIN and ADMINISTRATOR are both admins of the admin workspace;
 * CONTRIBUTOR is the creator workspace.
 */
function backendRoleToUiRole(role: number | string): UserRole | null {
  if (role === 'admin' || role === 'creator') {
    return role;
  }
  if (role === 1 || role === 2) return 'admin';
  if (role === 3) return 'creator';
  return null;
}

function decodeSessionHint(raw: string): SessionHintPayload | null {
  try {
    const decoded = JSON.parse(b64UrlDecode(raw)) as {
      uid?: unknown;
      role?: unknown;
      exp?: unknown;
    };
    const role =
      typeof decoded.role === 'number' || typeof decoded.role === 'string'
        ? backendRoleToUiRole(decoded.role)
        : null;
    if (
      typeof decoded.uid === 'string' &&
      role !== null &&
      typeof decoded.exp === 'number'
    ) {
      return { uid: decoded.uid, role, exp: decoded.exp };
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

const initialSession = readSessionHint();
const initial: AuthState = {
  isAuthenticated: initialSession.isAuthenticated,
  role: initialSession.role,
  userId: initialSession.userId,
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