import { useCallback } from 'react';

import type { ApplicationDecisionBody } from '@/models/users/users-model';
import {
  useDecideApplicationMutation,
  useGetApplicationsQuery,
} from '@/services/applications/applications-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseApplicationsParams {
  status?: 'all' | 'Submitted' | 'Under Review' | 'Revision Requested' | 'Approved' | 'Rejected';
  search?: string;
  page?: number;
  limit?: number;
}

interface UseApplicationsResult {
  applications: ReturnType<typeof useGetApplicationsQuery>['data'] extends infer T
    ? T extends { data: infer D }
      ? D
      : never
    : never;
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  decideApplication: (
    id: string,
    body: ApplicationDecisionBody,
  ) => Promise<unknown>;
  isDeciding: boolean;
}

export default function useApplications(
  params: UseApplicationsParams = {},
): UseApplicationsResult {
  const { data, isLoading, isError, error, refetch } = useGetApplicationsQuery({
    status: params.status,
    search: params.search,
    page: params.page,
    limit: params.limit,
  });
  const [decide, { isLoading: isDeciding }] = useDecideApplicationMutation();

  const decideApplication = useCallback(
    async (id: string, body: ApplicationDecisionBody) => {
      try {
        return await decide({ id, body }).unwrap();
      } catch {
        return null;
      }
    },
    [decide],
  );

  return {
    applications: (data?.data ?? []) as UseApplicationsResult['applications'],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    decideApplication,
    isDeciding,
  };
}