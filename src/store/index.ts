import {
  combineReducers,
  configureStore,
  type Action,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer, {
  sessionCleared,
  sessionExpired,
} from '@/reducers/auth-slice';
import uiReducer from '@/reducers/ui-slice';
import { baseService } from '@/services/core/base-service';

const appReducer = combineReducers({
  [baseService.reducerPath]: baseService.reducer,
  auth: authReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const LOGGED_OUT_AUTH: RootState['auth'] = {
  isAuthenticated: false,
  role: null,
  userId: null,
};

/**
 * Sign-out and session expiry discard the whole store, including every RTK
 * Query cache, so the previous user's profile/dashboard data cannot leak into
 * the next session.
 *
 * Auth must be forced to a logged-out shape: the slice module `initialState`
 * is captured once at boot from the session cookie, so resetting with
 * `appReducer(undefined, …)` alone can briefly rehydrate the previous user.
 */
function rootReducer(state: RootState | undefined, action: Action): RootState {
  if (
    action.type === sessionExpired.type ||
    action.type === sessionCleared.type
  ) {
    const resetState = appReducer(undefined, { type: '@@INIT' });
    return {
      ...resetState,
      auth: LOGGED_OUT_AUTH,
    };
  }
  return appReducer(state, action);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseService.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
