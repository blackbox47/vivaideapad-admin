import { Skeleton } from '@/components/ui/skeleton';
import type { ReportsCategoryPerformance } from '@/models/reports/reports-model';

interface ReportsCategoryPerformanceProps {
  rows: ReportsCategoryPerformance[];
  isLoading: boolean;
}

export default function ReportsCategoryPerformanceTable({
  rows,
  isLoading,
}: ReportsCategoryPerformanceProps) {
  return (
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <h2 className="mb-3.5 font-heading text-lg font-semibold text-foreground">
        Performance by category
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-[#687773]">
              <th className="py-2.5">Category</th>
              <th className="py-2.5">Concepts</th>
              <th className="py-2.5">Currently active</th>
              <th className="py-2.5">Reward pool</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-t border-[#eef1ef]">
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
              : rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-[#eef1ef]"
                  >
                    <td className="py-3">
                      <strong className="text-foreground">
                        {row.category}
                      </strong>
                    </td>
                    <td className="py-3 text-[#687773]">{row.total}</td>
                    <td className="py-3 text-[#687773]">{row.active}</td>
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
    </section>
  );
}