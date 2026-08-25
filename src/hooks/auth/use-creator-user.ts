import type { CreatorUser } from '@/models/creator/creator-user-model';
import { useGetCurrentCreatorQuery } from '@/services/creator/creator-auth-service';

interface UseCreatorUserResult {
  user: CreatorUser | null;
  isLoading: boolean;
}

export default function useCreatorUser(): UseCreatorUserResult {
  const { data, isLoading } = useGetCurrentCreatorQuery();

  return { user: data ?? null, isLoading };
}
