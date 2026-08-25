import {
  useGetCreatorRewardsQuery,
  useRequestWithdrawalMutation,
} from '@/services/creator/creator-rewards-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

export default function useCreatorRewards() {
  const { data, isLoading, isError, error, refetch } =
    useGetCreatorRewardsQuery();
  const [requestWithdrawal, withdrawState] = useRequestWithdrawalMutation();

  return {
    data: data ?? null,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    requestWithdrawal,
    resetWithdraw: withdrawState.reset,
    isWithdrawing: withdrawState.isLoading,
    withdrawError: getApiErrorMessage(withdrawState.error),
  };
}
