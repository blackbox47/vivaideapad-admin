import { Button } from '@/components/ui/button';
import useOnScrollLoadMore from '@/hooks/ui/use-on-scroll-load-more';

interface OpportunityLoadMoreProps {
  remainingCount: number;
  isLoading?: boolean;
  onLoadMore: () => void;
}

export default function OpportunityLoadMore({
  remainingCount,
  isLoading = false,
  onLoadMore,
}: OpportunityLoadMoreProps) {
  const sentinelRef = useOnScrollLoadMore({
    enabled: !isLoading && remainingCount > 0,
    isLoading,
    onLoadMore,
  });

  return (
    <div ref={sentinelRef} className="mt-7 flex justify-center">
      <Button
        type="button"
        variant="outline"
        loading={isLoading}
        className="h-auto cursor-pointer rounded-full border border-border bg-card px-6.5 py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle"
        onClick={onLoadMore}
      >
        Show more briefs · {remainingCount} remaining
      </Button>
    </div>
  );
}
