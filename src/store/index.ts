import {
  combineReducers,
  configureStore,
  type Action,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer, { sessionExpired } from '@/reducers/auth-slice';
import uiReducer from '@/reducers/ui-slice';
import { baseService } from '@/services/core/base-service';

const appReducer = combineReducers({
  [baseService.reducerPath]: baseService.reducer,
  auth: authReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof appReducer>;

/**
 * Session expiry discards the whole store, including every RTK Query cache,
 * so no previous user's data can leak into the next session.
 */
function rootReducer(state: RootState | undefined, action: Action): RootState {
  if (action.type === sessionExpired.type) {
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