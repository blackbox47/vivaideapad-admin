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

/**
 * Sign-out and session expiry discard the whole store, including every RTK
 * Query cache, so the previous user's profile/dashboard data cannot leak into
 * the next session (until a hard reload).
 */
function rootReducer(state: RootState | undefined, action: Action): RootState {
  if (
    action.type === sessionExpired.type ||
    action.type === sessionCleared.type
  ) {
    return appReducer(undefined, action);
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
