import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { store } from '@/store';
import { routeTree } from '@/routeTree.gen';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('[bootstrap] Missing #root element in index.html');
}

const router = createRouter({
  routeTree,
  context: { store },
  defaultPreload: 'intent',
});

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