import { Skeleton } from '@/components/ui/skeleton';

interface ReportsKpi {
  id: string;
  label: string;
  value: string;
}

interface ReportsKpiCardsProps {
  items: ReportsKpi[];
  isLoading: boolean;
}

export default function ReportsKpiCards({
  items,
  isLoading,
}: ReportsKpiCardsProps) {
  return (
    <div className="mb-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px]"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-5 h-9 w-20" />
            </div>
          ))
        : items.map((item) => (
            <article
              key={item.id}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px] shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-lime hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="text-[13px] text-muted-foreground">{item.label}</p>
              <p className="mt-3 font-heading text-[32px] leading-none font-extrabold tracking-[-0.02em] text-foreground">
                {item.value}
              </p>
            </article>
          ))}
    </div>
  );
}