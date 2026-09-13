import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AuditLogEmptyState from '@/features/audit-log/audit-log-empty-state';
import AuditLogFilters from '@/features/audit-log/audit-log-filters';
import AuditLogTable from '@/features/audit-log/audit-log-table';
import useAuditLog, {
  parseAuditCategory,
} from '@/hooks/audit-log/use-audit-log';
import usePagination from '@/hooks/ui/use-pagination';

export default function AuditLogOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const category = parseAuditCategory(searchParams.get('category'));
  const search = searchParams.get('q') ?? '';

  const {
    events,
    categoryCounts,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuditLog({ category, search });

  const { paginatedItems, paginationProps } = usePagination({
    items: events,
    initialPageSize: 6,
  });

  const setSearch = (next: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (next.trim().length === 0) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', next);
    }

    setSearchParams(nextParams, { replace: true });
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load audit log
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !isLoading && events.length === 0;

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="A traceable record of sensitive platform actions."
      />

      <AuditLogFilters
        category={category}
        search={search}
        categoryCounts={categoryCounts}
        onSearchChange={setSearch}
      />

      {isEmpty ? (
        <AuditLogEmptyState />
      ) : (
        <AuditLogTable
          events={paginatedItems}
          isLoading={isLoading}
          pagination={paginationProps}
        />
      )}
    </div>
  );
}