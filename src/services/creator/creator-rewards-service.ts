import type {
  CreatorRewardsOverview,
  WithdrawRequestBody,
  WithdrawRequestResponse,
} from '@/models/creator/creator-rewards-model';
import { baseService } from '@/services/core/base-service';
import {
  CREATOR_REWARDS_URL,
  CREATOR_REWARDS_WITHDRAW_URL,
} from '@/utils/constants/api-end-points';

export const creatorRewardsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorRewards: builder.query<CreatorRewardsOverview, void>({
      query: () => ({ url: CREATOR_REWARDS_URL, method: 'GET' }),
      providesTags: ['creator-rewards'],
    }),
    requestWithdrawal: builder.mutation<
      WithdrawRequestResponse,
      WithdrawRequestBody
    >({
      query: (body) => ({
        url: CREATOR_REWARDS_WITHDRAW_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['creator-rewards'],
    }),
  }),
});

export const {
  useGetCreatorRewardsQuery,
  useRequestWithdrawalMutation,
} = creatorRewardsService;
