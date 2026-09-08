import { Button } from '@/components/ui/button';

interface AuditLogLoadMoreProps {
  remainingCount: number;
  onLoadMore: () => void;
}

export default function AuditLogLoadMore({
  remainingCount,
  onLoadMore,
}: AuditLogLoadMoreProps) {
  return (
    <div className="mt-6 flex justify-center">
      <Button
        type="button"
        variant="outline"
        onClick={onLoadMore}
        className="h-auto rounded-full border-border bg-card px-[26px] py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle"
      >
        Show more events · {remainingCount} remaining
      </Button>
    </div>
  );
}