import type {
  LedgerListParams,
  LedgerListResponse,
} from '@/models/rewards/rewards-model';
import { baseService } from '@/services/core/base-service';
import { REWARDS_LEDGER_URL } from '@/utils/constants/api-end-points';

export const rewardsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLedger: builder.query<LedgerListResponse, LedgerListParams | void>({
      query: (params) => ({
        url: REWARDS_LEDGER_URL,
        method: 'GET',
        params: {
          type: params?.type,
          search: params?.search,
        },
      }),
      providesTags: ['rewards'],
    }),
  }),
});

export const { useGetLedgerQuery } = rewardsService;
