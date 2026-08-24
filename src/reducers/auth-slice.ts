import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { env } from '@/config/env';
import { MOCK_SESSION_TOKEN } from '@/services/mock/mock-handlers';
import {
  AUTH_TOKEN_STORAGE_KEY,
  SIGNED_OUT_STORAGE_KEY,
} from '@/utils/constants/storage-keys';

interface AuthState {
  token: string | null;
}

function readInitialToken(): string | null {
  const stored = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (stored) {
    return stored;
  }

  // Mock mode ships a pre-authenticated session so the dashboard opens
  // directly, unless the admin explicitly signed out.
  if (env.useMockApi && !localStorage.getItem(SIGNED_OUT_STORAGE_KEY)) {
    return MOCK_SESSION_TOKEN;
  }

  return null;
}

const initialState: AuthState = {
  token: readInitialToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
