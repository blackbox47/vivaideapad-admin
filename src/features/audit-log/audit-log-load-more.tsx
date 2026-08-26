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
      <button
        type="button"
        onClick={onLoadMore}
        className="rounded-full border border-border bg-card px-[26px] py-3 text-[13px] font-bold text-foreground transition-colors hover:bg-surface-subtle cursor-pointer"
      >
        Show more events · {remainingCount} remaining
      </button>
    </div>
  );
}