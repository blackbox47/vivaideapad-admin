import { useCallback } from 'react';

import type {
  AuditEvent,
  AuditEventDetail,
} from '@/models/audit-log/audit-log-model';
import { useGetAuditEventsQuery } from '@/services/audit-log/audit-log-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseAuditLogSpecParams {
  actorId?: string;
  category?:
    | 'Applicants'
    | 'Content'
    | 'Payouts'
    | 'System';
  targetType?: 'application' | 'submission' | 'payout_request' | 'user';
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseAuditLogSpecResult {
  events: AuditEvent[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  fetchEvent: (id: string) => Promise<AuditEventDetail | null>;
}

export default function useAuditLogSpec(
  params: UseAuditLogSpecParams = {},
): UseAuditLogSpecResult {
  const { data, isLoading, isError, error, refetch } = useGetAuditEventsQuery({
    actorId: params.actorId,
    category: params.category,
    targetType: params.targetType,
    action: params.action,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
    page: params.page,
    limit: params.limit,
  });

  // Stub fetcher — real fetches should use `useGetAuditEventQuery(id)` from
  // the service.
  const fetchEvent = useCallback(async (_id: string) => null, []);

  return {
    events: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    fetchEvent,
  };
}