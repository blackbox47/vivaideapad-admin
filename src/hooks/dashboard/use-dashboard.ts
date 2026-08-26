import type { DashboardOverview } from '@/models/dashboard/dashboard-model';
import { useGetDashboardOverviewQuery } from '@/services/dashboard/dashboard-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseDashboardResult {
  data: DashboardOverview | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export default function useDashboard(): UseDashboardResult {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardOverviewQuery();

  return {
    data: data ?? null,
    isLoading: isLoading || isFetching,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
