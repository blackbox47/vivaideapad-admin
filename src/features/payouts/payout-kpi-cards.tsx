import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PayoutKpi {
  id: string;
  label: string;
  value: string;
  helper?: string;
  tone?: 'default' | 'success';
}

interface PayoutKpiCardsProps {
  items: PayoutKpi[];
  isLoading: boolean;
}

export default function PayoutKpiCards({ items, isLoading }: PayoutKpiCardsProps) {
  return (
    <div className="mb-5 grid gap-3.5 sm:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-[#e3e9e6] bg-white p-[22px]"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-5 h-9 w-12" />
            </div>
          ))
        : items.map((item) => (
            <article
              key={item.id}
              className="rounded-[20px] border border-[#e3e9e6] bg-white p-[22px] shadow-[0_1px_3px_rgba(18,35,31,0.05)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#c9f36d] hover:shadow-[0_16px_32px_rgba(18,35,31,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="text-[13px] text-[#687773]">{item.label}</p>
              <p
                className={cn(
                  'mt-3 font-heading text-[32px] leading-none font-extrabold tracking-[-0.02em]',
                  item.tone === 'success' ? 'text-[#16805e]' : 'text-foreground',
                )}
              >
                {item.value}
              </p>
              {item.helper ? (
                <p className="mt-2 text-xs text-[#687773]">{item.helper}</p>
              ) : null}
            </article>
          ))}
    </div>
  );
}