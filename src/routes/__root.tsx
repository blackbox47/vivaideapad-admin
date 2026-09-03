import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import type { RootState } from '@/store';

import { RouteProgressBar } from '@/components/shared/route-progress-bar';
import { ScreenLoader } from '@/components/shared/screen-loader';

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
  pendingComponent: () => <ScreenLoader fullScreen />,
});

function RootComponent() {
  return (
    <>
      <RouteProgressBar />
      <Outlet />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools position="bottom-right" />
      ) : null}
    </>
  );
}

// Exported for `react-refresh/only-export-components` — keeps the rule
// happy by making `RootComponent` an explicit export alongside `Route`.
export { RootComponent };