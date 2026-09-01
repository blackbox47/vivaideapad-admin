import type {
  CreatePaymentMethodBody,
  PaymentMethod,
  PaymentMethodDeleteResponse,
  PaymentMethodListParams,
  PaymentMethodListResponse,
  PaymentMethodOption,
  UpdatePaymentMethodBody,
} from '@/models/payment-methods/payment-methods-model';
import { baseService } from '@/services/core/base-service';
import {
  CREATOR_PAYMENT_METHODS_URL,
  PAYMENT_METHOD_DETAIL_URL,
  PAYMENT_METHODS_URL,
} from '@/utils/constants/api-end-points';

export const paymentMethodsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<
      PaymentMethodListResponse,
      PaymentMethodListParams | void
    >({
      query: (params) => ({
        url: PAYMENT_METHODS_URL,
        method: 'GET',
        params: {
          search: params?.search,
          is_active: params?.is_active,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'payment-methods' as const,
                id,
              })),
              { type: 'payment-methods' as const, id: 'LIST' },
            ]
          : [{ type: 'payment-methods' as const, id: 'LIST' }],
    }),

    getPaymentMethodOptions: builder.query<PaymentMethodOption[], void>({
      query: () => ({
        url: CREATOR_PAYMENT_METHODS_URL,
        method: 'GET',
      }),
      transformResponse: (response: unknown): PaymentMethodOption[] => {
        if (Array.isArray(response)) {
          return response.map((item: Record<string, unknown>) => ({
            id: String(item.id ?? item.code ?? ''),
            code: String(item.code ?? item.id ?? ''),
            label: String(item.label ?? item.name ?? ''),
            name: String(item.name ?? item.label ?? ''),
            accountHint: typeof item.account_hint === 'string' ? item.account_hint : null,
            icon: typeof item.icon === 'string' ? item.icon : null,
          }));
        }
        return [];
      },
      providesTags: [{ type: 'payment-methods', id: 'OPTIONS' }],
    }),

    getPaymentMethodById: builder.query<PaymentMethod, string>({
      query: (id) => ({
        url: PAYMENT_METHOD_DETAIL_URL(id),
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'payment-methods', id }],
    }),

    createPaymentMethod: builder.mutation<PaymentMethod, CreatePaymentMethodBody>({
      query: (body) => ({
        url: PAYMENT_METHODS_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'payment-methods', id: 'LIST' }, { type: 'payment-methods', id: 'OPTIONS' }],
    }),

    updatePaymentMethod: builder.mutation<
      PaymentMethod,
      { id: string; body: UpdatePaymentMethodBody }
    >({
      query: ({ id, body }) => ({
        url: PAYMENT_METHOD_DETAIL_URL(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'payment-methods', id },
        { type: 'payment-methods', id: 'LIST' },
        { type: 'payment-methods', id: 'OPTIONS' },
      ],
    }),

    deletePaymentMethod: builder.mutation<PaymentMethodDeleteResponse, string>({
      query: (id) => ({
        url: PAYMENT_METHOD_DETAIL_URL(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'payment-methods', id: 'LIST' }, { type: 'payment-methods', id: 'OPTIONS' }],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useGetPaymentMethodOptionsQuery,
  useGetPaymentMethodByIdQuery,
  useLazyGetPaymentMethodByIdQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodsService;
