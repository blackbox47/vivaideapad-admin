import type {
  CreateAdjustmentBody,
  CreateAdjustmentResponse,
  LedgerEntry,
  LedgerListParams,
  LedgerListResponse,
} from '@/models/rewards/rewards-model';
import { baseService } from '@/services/core/base-service';
import {
  LEDGER_MANUAL_ADJUSTMENT_URL,
  LEDGER_URL,
} from '@/utils/constants/api-end-points';

export interface LedgerListParamsSpec extends LedgerListParams {
  userId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * Spec §5.6 — global ledger search.
 *
 * Legacy GET `/admin/rewards-ledger` continues to live in
 * `services/rewards/rewards-service.ts` for the live UI.
 */
export const ledgerService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLedger: builder.query<LedgerListResponse, LedgerListParamsSpec | void>({
      query: (params) => ({
        url: LEDGER_URL,
        method: 'GET',
        params: {
          type: params?.type,
          search: params?.search,
          user_id: params?.userId,
          status: params?.status,
          date_from: params?.dateFrom,
          date_to: params?.dateTo,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: ['ledger'],
    }),
    manualAdjustment: builder.mutation<
      CreateAdjustmentResponse,
      CreateAdjustmentBody
    >({
      query: (body) => ({
        url: LEDGER_MANUAL_ADJUSTMENT_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ledger', 'rewards', 'audit-log', 'audit-events'],
    }),
  }),
});

export const {
  useGetLedgerQuery,
  useLazyGetLedgerQuery,
  useManualAdjustmentMutation,
} = ledgerService;

// Re-export for callers that want the canonical shape.
export type { LedgerEntry };
