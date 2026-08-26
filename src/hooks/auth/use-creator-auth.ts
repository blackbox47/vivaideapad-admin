/**
 * Creator-specific auth hook.
 *
 * Reuses `useAuth.login` / `useAuth.logout` so the same token, storage keys,
 * and store-reset behavior apply. Exists as a separate hook so a creator-only
 * consumer (e.g. CreatorHeader) reads cleanly and can be evolved independently
 * from the admin path.
 */

import useAuth from '@/hooks/auth/use-auth';

export default function useCreatorAuth() {
  return useAuth();
}
