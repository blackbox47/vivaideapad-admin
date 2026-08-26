import { useGetCreatorDashboardOverviewQuery } from '@/services/creator/creator-dashboard-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

export default function useCreatorDashboard() {
  const { data, isLoading, isError, error, refetch } =
    useGetCreatorDashboardOverviewQuery();

  return {
    data: data ?? null,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
