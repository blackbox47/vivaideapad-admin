import type { CreatorUser } from '@/models/creator/creator-user-model';
import { useGetCurrentCreatorQuery } from '@/services/creator/creator-auth-service';
import { deriveInitials } from '@/utils/helpers/initials';

interface UseCreatorUserResult {
  user: CreatorUser | null;
  isLoading: boolean;
}

function normalizeCreatorUser(data: unknown): CreatorUser | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (!('id' in record)) {
    return null;
  }

  const email = typeof record.email === 'string' ? record.email : '';
  const displayName =
    typeof record.display_name === 'string'
      ? record.display_name
      : typeof record.name === 'string'
        ? record.name
        : '';
  const name = displayName || email;

  return {
    id: String(record.id ?? ''),
    name,
    initials:
      typeof record.initials === 'string' && record.initials
        ? record.initials
        : deriveInitials(displayName, email),
    email,
    bio: typeof record.bio === 'string' ? record.bio : undefined,
    joined:
      typeof record.created_at === 'string' ? record.created_at : undefined,
  };
}

export default function useCreatorUser(): UseCreatorUserResult {
  const { data, isLoading } = useGetCurrentCreatorQuery();

  return { user: normalizeCreatorUser(data), isLoading };
}

