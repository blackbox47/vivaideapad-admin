import type { AuthUser, UserAccessStatus } from '@/models/auth/auth-model';
import { useGetCurrentAdminQuery } from '@/services/auth/auth-service';
import { parsePlatformRole } from '@/utils/helpers/platform-role';

interface UseAdminUserResult {
  user: AuthUser | null;
  isLoading: boolean;
}

/**
 * Maps incoming profile data to the slim `AuthUser` consumed by the sidebar/header.
 * Handles both the live NestJS backend response (`SerializedProfile`) and the
 * mock `ProfileOverview` shape safely, returning `null` when unauthenticated or malformed.
 */
function normalizeAuthUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  // 1. Mock ProfileOverview shape: { profile: { id, name, email }, ... }
  if (
    record.profile &&
    typeof record.profile === 'object' &&
    'id' in (record.profile as Record<string, unknown>)
  ) {
    const p = record.profile as Record<string, unknown>;
    return {
      id: String(p.id ?? ''),
      email: String(p.email ?? ''),
      display_name:
        typeof p.name === 'string'
          ? p.name
          : typeof p.display_name === 'string'
            ? p.display_name
            : null,
      role: parsePlatformRole(p.role),
      access_status: (typeof p.access_status === 'string'
        ? p.access_status.toLowerCase()
        : 'active') as UserAccessStatus,
    };
  }

  // 2. Wire SerializedProfile shape from GET /admin/profile: { id, email, display_name, role, access_status }
  if ('id' in record && typeof record.id === 'string') {
    return {
      id: record.id,
      email: typeof record.email === 'string' ? record.email : '',
      display_name:
        typeof record.display_name === 'string'
          ? record.display_name
          : typeof record.name === 'string'
            ? record.name
            : null,
      role: parsePlatformRole(record.role),
      access_status: (typeof record.access_status === 'string'
        ? record.access_status.toLowerCase()
        : 'active') as UserAccessStatus,
    };
  }

  return null;
}

export default function useAdminUser(): UseAdminUserResult {
  const { data, isLoading } = useGetCurrentAdminQuery();
  const user = normalizeAuthUser(data);
  return { user, isLoading };
}
