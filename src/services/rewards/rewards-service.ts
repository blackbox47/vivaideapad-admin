import type {
  CreateAdjustmentBody,
  CreateAdjustmentResponse,
  LedgerListParams,
  LedgerListResponse,
} from '@/models/rewards/rewards-model';
import { baseService } from '@/services/core/base-service';
import {
  REWARDS_LEDGER_ADJUST_URL,
  REWARDS_LEDGER_URL,
} from '@/utils/constants/api-end-points';

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
    createAdjustment: builder.mutation<
      CreateAdjustmentResponse,
      CreateAdjustmentBody
    >({
      query: (body) => ({
        url: REWARDS_LEDGER_ADJUST_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['rewards', 'audit-log'],
    }),
  }),
});

export const { useGetLedgerQuery, useCreateAdjustmentMutation } = rewardsService;
