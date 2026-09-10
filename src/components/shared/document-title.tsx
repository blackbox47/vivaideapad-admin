import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

import { getDocumentTitle } from '@/utils/constants/nav-items';

/**
 * Keeps `document.title` in sync with the active route.
 */
export default function DocumentTitle() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    document.title = getDocumentTitle(pathname);
  }, [pathname]);

  return null;
}
