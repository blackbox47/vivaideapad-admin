import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReviewKpi {
  id: string;
  label: string;
  value: number;
  tone?: 'default' | 'danger';
}

interface ReviewKpiCardsProps {
  items: ReviewKpi[];
  isLoading: boolean;
}

export default function ReviewKpiCards({ items, isLoading }: ReviewKpiCardsProps) {
  return (
    <div className="mb-5 grid gap-3.5 sm:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px]"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-5 h-9 w-12" />
            </div>
          ))
        : items.map((item) => (
            <article
              key={item.id}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px] shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-lime hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="text-[13px] text-muted-foreground">{item.label}</p>
              <p
                className={cn(
                  'mt-3 font-heading text-[32px] leading-none font-extrabold tracking-[-0.02em] text-foreground',
                  item.tone === 'danger' && 'text-destructive',
                )}
              >
                {item.value}
              </p>
            </article>
          ))}
    </div>
  );
}
