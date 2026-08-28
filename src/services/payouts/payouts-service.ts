import type {
  DecidePayoutBody,
  Payout,
  PayoutDetail,
  PayoutListParamsSpec,
  PayoutListResponse,
  PayoutMethod,
  PayoutStatus,
  ProcessPayoutBody,
  ProcessPayoutResponse,
} from '@/models/payouts/payouts-model';
import { baseService } from '@/services/core/base-service';
import {
  PAYOUTS_URL,
  PAYOUT_DETAIL_URL,
  PAYOUT_PROCESS_URL,
} from '@/utils/constants/api-end-points';

export type PayoutsListParamsSpec = PayoutListParamsSpec;

function normalizePayoutStatusQuery(
  status?: string,
): 'pending' | 'paid' | 'rejected' | undefined {
  if (!status || status.toLowerCase() === 'all') {
    return undefined;
  }
  const s = status.toLowerCase();
  if (s === 'paid') return 'paid';
  if (s === 'rejected') return 'rejected';
  if (
    s === 'requested' ||
    s === 'under review' ||
    s === 'under_review' ||
    s === 'approved' ||
    s === 'pending'
  ) {
    return 'pending';
  }
  return undefined;
}

export const payoutsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getPayouts: builder.query<PayoutListResponse, PayoutListParamsSpec | void>({
      query: (params) => ({
        url: PAYOUTS_URL,
        method: 'GET',
        params: params
          ? {
              status: normalizePayoutStatusQuery(params.status),
              search: params.search,
              user_id: params.userId,
              date_from: params.dateFrom,
              date_to: params.dateTo,
              page: params.page,
              limit: params.limit,
            }
          : undefined,
      }),
      transformResponse: (response: unknown): PayoutListResponse => {
        if (!response || typeof response !== 'object') {
          return { payouts: [], total: 0 };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { payouts: [...], total }
        if (Array.isArray(res.payouts)) {
          return {
            payouts: res.payouts as Payout[],
            total:
              typeof res.total === 'number'
                ? res.total
                : res.payouts.length,
          };
        }

        // 2. Live backend format: { data: [...], meta: { total, ... } }
        if (Array.isArray(res.data)) {
          const payouts: Payout[] = res.data.map(
            (item: Record<string, unknown>) => {
              const numAmount = Math.abs(Number(item.amount ?? 0));
              const rawStatus = String(item.status ?? '').toLowerCase();
              let status: PayoutStatus = 'Requested';
              if (rawStatus === 'paid') {
                status = 'Paid';
              } else if (rawStatus === 'rejected') {
                status = 'Rejected';
              } else if (rawStatus === 'approved') {
                status = 'Approved';
              } else if (
                rawStatus === 'under_review' ||
                rawStatus === 'under review'
              ) {
                status = 'Under Review';
              }

              const rawMethod = String(item.method ?? '').toLowerCase();
              let method: PayoutMethod = 'bKash';
              if (rawMethod.includes('nagad')) method = 'Nagad';
              else if (rawMethod.includes('rocket')) method = 'Rocket';
              else if (rawMethod.includes('bank')) method = 'Bank';

              const details = (item.details ??
                item.accountDetails ??
                {}) as Record<string, unknown>;
              const acctNumber = String(
                details.account_number ??
                  details.phone ??
                  details.accountNumber ??
                  '',
              );
              const methodDetail = acctNumber
                ? `${method} · ${acctNumber}`
                : method;

              const dateStr =
                item.created_at ||
                item.createdAt ||
                item.requested_at ||
                item.requestedAt
                  ? new Date(
                      String(
                        item.created_at ||
                          item.createdAt ||
                          item.requested_at ||
                          item.requestedAt,
                      ),
                    ).toLocaleDateString()
                  : '';

              return {
                id: String(item.id ?? ''),
                contributor: String(
                  details.user_name ??
                    details.contributor ??
                    item.user_id ??
                    'Contributor',
                ),
                method,
                methodDetail,
                amount: `Tk ${numAmount}`,
                amountValue: numAmount,
                requested: dateStr,
                requestedAt: String(
                  item.created_at ||
                    item.createdAt ||
                    item.requested_at ||
                    item.requestedAt ||
                    new Date().toISOString(),
                ),
                status,
              };
            },
          );

          const meta = res.meta as Record<string, unknown> | undefined;
          const total =
            typeof meta?.total === 'number' ? meta.total : payouts.length;

          return { payouts, total };
        }

        return { payouts: [], total: 0 };
      },
      providesTags: ['payouts'],
    }),
    /** Spec §5.6 — GET /admin/payouts/:id */
    getPayout: builder.query<{ payout: PayoutDetail }, string>({
      query: (id) => ({ url: PAYOUT_DETAIL_URL(id), method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'payouts', id }],
    }),
    /** Legacy mutation — kept for the live UI. */
    decidePayout: builder.mutation<PayoutListResponse, DecidePayoutBody>({
      query: (body) => ({
        url: PAYOUTS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['payouts', 'dashboard', 'rewards'],
    }),
    /** Spec §5.6 — POST /admin/payouts/:id/process */
    processPayout: builder.mutation<
      ProcessPayoutResponse,
      { id: string; body: ProcessPayoutBody }
    >({
      query: ({ id, body }) => ({
        url: PAYOUT_PROCESS_URL(id),
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'payouts',
        'rewards',
        'ledger',
        'audit-log',
        'audit-events',
        'admin-notifications',
      ],
    }),
  }),
});

export const {
  useGetPayoutsQuery,
  useLazyGetPayoutQuery,
  useGetPayoutQuery,
  useDecidePayoutMutation,
  useProcessPayoutMutation,
} = payoutsService;

// Re-exported so consumers don't reach into the model directly.
export type { Payout };
