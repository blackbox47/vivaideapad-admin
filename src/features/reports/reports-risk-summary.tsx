import { Skeleton } from '@/components/ui/skeleton';
import type { ReportsRiskCounts } from '@/models/reports/reports-model';

interface ReportsRiskSummaryProps {
  counts: ReportsRiskCounts;
  isLoading: boolean;
}

export default function ReportsRiskSummary({
  counts,
  isLoading,
}: ReportsRiskSummaryProps) {
  return (
    <div className="mt-[18px] flex justify-between gap-2.5 border-t border-[#eef1ef] pt-3.5 text-xs text-[#687773]">
      {isLoading ? (
        <>
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-20" />
        </>
      ) : (
        <>
          <span>
            Low risk:{' '}
            <strong className="text-foreground">{counts.Low}</strong>
          </span>
          <span>
            Medium risk:{' '}
            <strong className="text-foreground">{counts.Medium}</strong>
          </span>
          <span>
            High risk:{' '}
            <strong className="text-[#b3401f]">{counts.High}</strong>
          </span>
        </>
      )}
    </div>
  );
}