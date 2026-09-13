import EmptyState from '@/components/shared/empty-state';
import { TablePagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import usePagination from '@/hooks/ui/use-pagination';
import type { ReportsCategoryPerformance } from '@/models/reports/reports-model';

interface ReportsCategoryPerformanceProps {
  rows: ReportsCategoryPerformance[];
  isLoading: boolean;
}

export default function ReportsCategoryPerformanceTable({
  rows,
  isLoading,
}: ReportsCategoryPerformanceProps) {
  const { paginatedItems, paginationProps, totalPages } = usePagination({
    items: rows,
    initialPageSize: 6,
  });
  return (
    <section className="rounded-[20px] border border-border bg-card p-[22px]">
      <h2 className="mb-3.5 font-heading text-lg font-semibold text-foreground">
        Performance by category
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2.5">Category</th>
              <th className="py-2.5">Concepts</th>
              <th className="py-2.5">Currently active</th>
              <th className="py-2.5">Reward pool</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-t border-border-muted">
                    <td className="py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-8" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-8" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              : rows.length === 0 ? (
                  <tr className="border-t border-border-muted">
                    <td colSpan={4} className="p-0">
                      <EmptyState
                        card={false}
                        size="sm"
                        title="No category data"
                        description="Performance metrics will populate as ideas are submitted."
                      />
                    </td>
                  </tr>
                ) : paginatedItems.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border-muted"
                  >
                    <td className="py-3">
                      <strong className="text-foreground">
                        {row.category}
                      </strong>
                    </td>
                    <td className="py-3 text-muted-foreground">{row.total}</td>
                    <td className="py-3 text-muted-foreground">{row.active}</td>
                    <td className="py-3">
                      <strong className="text-foreground">
                        {row.rewardSum}
                      </strong>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {paginationProps.totalItems > 0 && totalPages > 1 ? (
        <TablePagination
          {...paginationProps}
          className="mt-4 -mx-[22px] -mb-[22px] rounded-b-[20px]"
        />
      ) : null}
    </section>
  );
}