import type { AdminUser } from '@/models/auth/auth-model';
import { useGetCurrentAdminQuery } from '@/services/auth/auth-service';

interface UseAdminUserResult {
  user: AdminUser | null;
  isLoading: boolean;
}

export default function useAdminUser(): UseAdminUserResult {
  const { data, isLoading } = useGetCurrentAdminQuery();

  return { user: data ?? null, isLoading };
}
