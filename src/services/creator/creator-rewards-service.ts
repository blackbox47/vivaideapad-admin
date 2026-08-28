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
      transformResponse: (response: unknown): CreatorRewardsOverview => {
        if (!response || typeof response !== 'object') {
          return {
            available: 'Tk 0',
            pending: 'Tk 0',
            paidToDate: 'Tk 0',
            payoutMethod: 'bKash',
            entries: [],
          };
        }
        const res = response as Record<string, unknown>;
        const entries = Array.isArray(res.entries)
          ? (res.entries as CreatorRewardsOverview['entries'])
          : [];
        return {
          available: String(res.available ?? (res.balance ? `Tk ${res.balance}` : 'Tk 0')),
          pending: String(res.pending ? (String(res.pending).startsWith('Tk') ? res.pending : `Tk ${res.pending}`) : 'Tk 0'),
          paidToDate: String(res.paidToDate ?? (res.lifetime_debits ? `Tk ${res.lifetime_debits}` : 'Tk 0')),
          payoutMethod: String(res.payoutMethod ?? 'bKash'),
          entries,
        };
      },
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
