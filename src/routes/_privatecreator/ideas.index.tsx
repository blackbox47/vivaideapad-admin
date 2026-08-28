import { createFileRoute, redirect } from '@tanstack/react-router';

/**
 * `/ideas` — legacy redirect to `/submissions`. The old tree had a
 * `<Route path="ideas" element={<Navigate to=…/>}>` here; in TanStack Router
 * the same effect is a `beforeLoad` that throws a redirect.
 */
export const Route = createFileRoute('/_privatecreator/ideas/')({
  beforeLoad: () => {
    throw redirect({ to: '/submissions' });
  },
});