import { useMemo } from 'react';
import type { DropdownOption } from '@/utils/types/dropdown-option';
import {
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useGetPaymentMethodOptionsQuery,
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
} from '@/services/payment-methods/payment-methods-service';

const FALLBACK_OPTIONS: DropdownOption[] = [
  { id: 'bKash', label: 'bKash · 018•••42' },
  { id: 'Nagad', label: 'Nagad' },
  { id: 'Rocket', label: 'Rocket' },
  { id: 'Bank', label: 'Bank transfer' },
];

export function usePaymentMethodOptions() {
  const { data, isLoading, isError, refetch } = useGetPaymentMethodOptionsQuery();

  const options = useMemo<DropdownOption[]>(() => {
    if (!data || data.length === 0) {
      return FALLBACK_OPTIONS;
    }
    return data.map((opt) => ({
      id: opt.code || opt.id,
      label: opt.label || opt.name,
      disabled: opt.disabled,
    }));
  }, [data]);

  return {
    options,
    rawOptions: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}

export function usePaymentMethodsAdmin(params?: {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}) {
  const { data, isLoading, isError, refetch } = useGetPaymentMethodsQuery(params);
  const [createMethod, { isLoading: isCreating }] = useCreatePaymentMethodMutation();
  const [updateMethod, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();
  const [deleteMethod, { isLoading: isDeleting }] = useDeletePaymentMethodMutation();

  return {
    data: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError,
    refetch,
    createMethod,
    isCreating,
    updateMethod,
    isUpdating,
    deleteMethod,
    isDeleting,
  };
}

export default usePaymentMethodOptions;
