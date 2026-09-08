import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { startSessionExpiredListener } from '@/lib/session-expired-listener';
import { store } from '@/store';
import { routeTree } from '@/routeTree.gen';
import { ScreenLoader } from '@/components/shared/screen-loader';
import './index.css';

// One-shot migration: drop the legacy localStorage token/signed-out keys
// left over from the pre-cookie auth scheme. Idempotent and harmless once
// the deploy has propagated.
const LEGACY_AUTH_KEYS = [
  'ideapad.admin.token',
  'ideapad.admin.refresh-token',
  'ideapad.admin.signed-out',
  'ideapad.creator.token',
  'ideapad.creator.refresh-token',
  'ideapad.creator.signed-out',
];
for (const key of LEGACY_AUTH_KEYS) {
  localStorage.removeItem(key);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('[bootstrap] Missing #root element in index.html');
}

const router = createRouter({
  routeTree,
  context: { store },
  defaultPreload: 'intent',
  defaultPendingComponent: () => <ScreenLoader fullScreen />,
  defaultPendingMs: 0,
});

// Boot the session-expired listener: when `customFetch` dispatches
// `sessionExpired` (i.e. the refresh cookie also returned 401), we
// force-navigate to the role-appropriate login page immediately rather than
// waiting for the next route transition.
startSessionExpiredListener(store, router);

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);