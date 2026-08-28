import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import type { RootState } from '@/store';

/**
 * Shape of the runtime context shared with every route via
 * `createRouter({ context })` in `src/main.tsx`. Routes can read this from
 * their `beforeLoad({ context })` argument.
 */
export interface RouterAppContext {
  store: { getState: () => RootState; dispatch: unknown };
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools position="bottom-right" />
      ) : null}
    </>
  );
}