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
import { formatDisplayDate } from '@/utils/helpers/format-display-date';
import { CURRENCY_SYMBOL } from '@/utils/constants';

export const creatorRewardsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorRewards: builder.query<CreatorRewardsOverview, void>({
      query: () => ({ url: CREATOR_REWARDS_URL, method: 'GET' }),
      transformResponse: (response: unknown): CreatorRewardsOverview => {
        if (!response || typeof response !== 'object') {
          return {
            available: `${CURRENCY_SYMBOL} 0`,
            pending: `${CURRENCY_SYMBOL} 0`,
            paidToDate: `${CURRENCY_SYMBOL} 0`,
            payoutMethod: 'bKash',
            entries: [],
          };
        }
        const res = response as Record<string, unknown>;
        const entries = Array.isArray(res.entries)
          ? (res.entries as CreatorRewardsOverview['entries']).map((entry) => ({
              ...entry,
              date: formatDisplayDate(entry.date),
            }))
          : [];

        const normalizeAmount = (val: unknown, fallback: string) => {
          if (val === undefined || val === null || val === '') return fallback;
          const s = String(val).trim();
          if (s.startsWith(CURRENCY_SYMBOL)) return s;
          const stripped = s.replace(/^(Tk|৳|\$)\s*/, '');
          return `${CURRENCY_SYMBOL} ${stripped}`;
        };

        return {
          available: normalizeAmount(res.available ?? (res.balance ? `${CURRENCY_SYMBOL} ${res.balance}` : undefined), `${CURRENCY_SYMBOL} 0`),
          pending: normalizeAmount(res.pending, `${CURRENCY_SYMBOL} 0`),
          paidToDate: normalizeAmount(res.paidToDate ?? (res.lifetime_debits ? `${CURRENCY_SYMBOL} ${res.lifetime_debits}` : undefined), `${CURRENCY_SYMBOL} 0`),
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
        body: {
          amount: body.amount,
          method: body.method,
          details: {
            mobile: body.mobile,
            phone: body.mobile,
            account_number: body.mobile,
          },
          ...(body.mobile ? { mobile: body.mobile } : {}),
        },
      }),
      invalidatesTags: ['creator-rewards', 'creator-dashboard'],
    }),
  }),
});

export const {
  useGetCreatorRewardsQuery,
  useRequestWithdrawalMutation,
} = creatorRewardsService;
