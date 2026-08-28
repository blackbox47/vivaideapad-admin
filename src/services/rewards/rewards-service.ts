import type {
  CreateAdjustmentBody,
  CreateAdjustmentResponse,
  LedgerEntry,
  LedgerEntryStatus,
  LedgerEntryType,
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
      transformResponse: (response: unknown): LedgerListResponse => {
        if (!response || typeof response !== 'object') {
          return { entries: [], total: 0 };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { entries: [...], total }
        if (Array.isArray(res.entries)) {
          return {
            entries: res.entries as LedgerEntry[],
            total: typeof res.total === 'number' ? res.total : res.entries.length,
          };
        }

        // 2. Live backend format: { data: [...], meta: { total, ... } }
        if (Array.isArray(res.data)) {
          const entries: LedgerEntry[] = res.data.map((item: Record<string, unknown>) => {
            const numAmount = Math.abs(Number(item.amount ?? 0));
            const rawType = String(item.type ?? '').toLowerCase();
            let type: LedgerEntryType = 'Reward';
            if (rawType.includes('payout') || rawType.includes('withdrawal')) {
              type = 'Withdrawal';
            } else if (rawType.includes('adjust') || rawType.includes('manual')) {
              type = 'Adjustment';
            }

            const rawStatus = String(item.status ?? '').toLowerCase();
            let status: LedgerEntryStatus = 'Available';
            if (rawStatus.includes('paid') || rawStatus === 'posted') {
              status = 'Available';
            } else if (rawStatus.includes('pend')) {
              status = 'Pending';
            } else if (rawStatus.includes('reject')) {
              status = 'Rejected';
            } else if (rawStatus.includes('hold')) {
              status = 'On hold';
            }

            const dateStr = item.created_at || item.posted_at
              ? new Date(String(item.created_at || item.posted_at)).toLocaleDateString()
              : '';
            const metadata = (item.metadata as Record<string, unknown>) ?? {};

            return {
              id: String(item.id ?? ''),
              contributor: String(
                metadata.user_name ?? metadata.contributor ?? item.user_id ?? 'Contributor',
              ),
              description: String(
                metadata.description ?? item.reference ?? `${type} entry`,
              ),
              date: dateStr,
              occurredAt: String(item.created_at || item.posted_at || new Date().toISOString()),
              type,
              amount: type === 'Withdrawal' ? `−Tk ${numAmount}` : `+Tk ${numAmount}`,
              amountValue: numAmount,
              status,
            };
          });

          const meta = res.meta as Record<string, unknown> | undefined;
          const total = typeof meta?.total === 'number' ? meta.total : entries.length;

          return { entries, total };
        }

        return { entries: [], total: 0 };
      },
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
