import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { env } from '@/config/env';
import type { UserRole } from '@/models/auth/auth-model';
import { MOCK_SESSION_TOKEN } from '@/services/mock/mock-handlers';
import {
  AUTH_TOKEN_STORAGE_KEY,
  CREATOR_AUTH_TOKEN_STORAGE_KEY,
  SIGNED_OUT_STORAGE_KEY,
} from '@/utils/constants/storage-keys';

interface AuthState {
  token: string | null;
  role: UserRole | null;
}

interface InitialAuth {
  token: string | null;
  role: UserRole | null;
}

function readInitialToken(): InitialAuth {
  // Creator session wins if both exist (last-tab-to-focus heuristic — when a
  // user is signed in as both, the more recent creator session is preferred).
  const creatorStored = localStorage.getItem(CREATOR_AUTH_TOKEN_STORAGE_KEY);
  if (creatorStored) {
    return { token: creatorStored, role: 'creator' };
  }

  const adminStored = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (adminStored) {
    return { token: adminStored, role: 'admin' };
  }

  // Mock mode ships a pre-authenticated admin session so the dashboard opens
  // directly, unless an admin explicitly signed out.
  if (env.useMockApi && !localStorage.getItem(SIGNED_OUT_STORAGE_KEY)) {
    return { token: MOCK_SESSION_TOKEN, role: 'admin' };
  }

  return { token: null, role: null };
}

const initial = readInitialToken();

const initialState: AuthState = { token: initial.token, role: initial.role };

interface SetCredentialsPayload {
  token: string;
  role: UserRole;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
