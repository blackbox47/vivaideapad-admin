import { useState } from 'react';

import {
  AUDIT_CATEGORIES,
  AUDIT_CATEGORY_FILTERS,
  type AuditCategoryFilter,
  type AuditEvent,
} from '@/models/audit-log/audit-log-model';
import { useGetAuditLogQuery } from '@/services/audit-log/audit-log-service';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants/pagination';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseAuditLogParams {
  category: AuditCategoryFilter;
  search: string;
  /** Initial page size; further events load on demand. */
  pageSize?: number;
}

interface UseAuditLogResult {
  events: AuditEvent[];
  visibleEvents: AuditEvent[];
  totalCount: number;
  categoryCounts: Record<AuditCategoryFilter, number>;
  visibleCount: number;
  hasMore: boolean;
  remainingCount: number;
  loadMore: () => void;
  resetVisibleCount: () => void;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

function isAuditCategoryFilter(value: string): value is AuditCategoryFilter {
  return (AUDIT_CATEGORY_FILTERS as readonly string[]).includes(value);
}

export function parseAuditCategory(value: string | null): AuditCategoryFilter {
  if (!value) {
    return 'All';
  }
  return isAuditCategoryFilter(value) ? value : 'All';
}

export default function useAuditLog({
  category,
  search,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseAuditLogParams): UseAuditLogResult {
  const { data, isLoading, isError, error, refetch } = useGetAuditLogQuery({
    search: search.trim() || undefined,
  });

  const allEvents = data?.events ?? [];
  const events =
    category === 'All'
      ? allEvents
      : allEvents.filter((event) => event.category === category);

  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = events.length > visibleCount;
  const remainingCount = Math.max(0, events.length - visibleCount);

  const categoryCounts: Record<AuditCategoryFilter, number> = {
    All: allEvents.length,
    Content: 0,
    Applicants: 0,
    Payouts: 0,
    System: 0,
  };

  for (const item of AUDIT_CATEGORIES) {
    categoryCounts[item] = allEvents.filter(
      (event) => event.category === item,
    ).length;
  }

  return {
    events,
    visibleEvents,
    totalCount: data?.total ?? 0,
    categoryCounts,
    visibleCount,
    hasMore,
    remainingCount,
    loadMore: () => setVisibleCount((count) => count + pageSize),
    resetVisibleCount: () => setVisibleCount(pageSize),
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}