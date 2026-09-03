import { useRouterState } from '@tanstack/react-router';

export default function RouteProgressBar() {
  const isPending = useRouterState({
    select: (state) => state.status === 'pending',
  });

  if (!isPending) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      className="fixed top-0 left-0 right-0 z-[9999] h-1 w-full overflow-hidden bg-brand-forest/20 pointer-events-none"
    >
      <div className="h-full w-full bg-gradient-to-r from-brand-forest via-brand-lime to-brand-forest animate-pulse" />
    </div>
  );
}

export { RouteProgressBar };
