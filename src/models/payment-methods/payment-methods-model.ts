import type { DropdownOption } from '@/utils/types/dropdown-option';
import type { Paginated } from '@/utils/helpers/api-pagination';

export interface PaymentMethod {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  accountHint: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethodOption extends DropdownOption {
  id: string;
  code: string;
  label: string;
  name: string;
  accountHint?: string | null;
  icon?: string | null;
}

export interface PaymentMethodListParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export type PaymentMethodListResponse = Paginated<PaymentMethod>;

export interface CreatePaymentMethodBody {
  code: string;
  name: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  sort_order?: number;
  account_hint?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdatePaymentMethodBody {
  code?: string;
  name?: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  sort_order?: number;
  account_hint?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentMethodDeleteResponse {
  id?: string;
  deleted?: boolean;
}
