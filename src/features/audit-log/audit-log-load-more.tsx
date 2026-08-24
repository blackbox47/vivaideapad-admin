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
        className="rounded-full border border-[#dfe7e3] bg-white px-[26px] py-3 text-[13px] font-bold text-foreground transition-colors hover:bg-[#f6f8f5]"
      >
        Show more events · {remainingCount} remaining
      </button>
    </div>
  );
}