import { Skeleton } from '@/components/ui/skeleton';
import type { ReportsFunnelStep } from '@/models/reports/reports-model';

interface ReportsFunnelProps {
  steps: ReportsFunnelStep[];
  isLoading: boolean;
}

export default function ReportsFunnel({ steps, isLoading }: ReportsFunnelProps) {
  return (
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Applicant → contributor funnel
      </h2>

      <div className="mt-3 flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-1.5 flex justify-between">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))
          : steps.map((step) => (
              <div key={step.id}>
                <div className="mb-1.5 flex justify-between text-[13px]">
                  <span className="text-[#687773]">{step.label}</span>
                  <strong className="text-foreground">{step.count}</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eef1ef]">
                  <span
                    className="block h-full rounded-full bg-[#173f33]"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}