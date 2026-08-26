import type {
  DecidePayoutBody,
  PayoutListParams,
  PayoutListResponse,
} from '@/models/payouts/payouts-model';
import { baseService } from '@/services/core/base-service';
import { PAYOUTS_URL } from '@/utils/constants/api-end-points';

export const payoutsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getPayouts: builder.query<PayoutListResponse, PayoutListParams | void>({
      query: (params) => ({
        url: PAYOUTS_URL,
        method: 'GET',
        params: {
          status: params?.status,
          search: params?.search,
        },
      }),
      providesTags: ['payouts'],
    }),
    decidePayout: builder.mutation<PayoutListResponse, DecidePayoutBody>({
      query: (body) => ({
        url: PAYOUTS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['payouts', 'dashboard', 'rewards'],
    }),
  }),
});

export const { useGetPayoutsQuery, useDecidePayoutMutation } = payoutsService;
