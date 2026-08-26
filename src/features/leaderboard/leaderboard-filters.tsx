interface LeaderboardFiltersProps {
  search: string;
  visibleCount: number;
  onSearchChange: (search: string) => void;
}

export default function LeaderboardFilters({
  search,
  visibleCount,
  onSearchChange,
}: LeaderboardFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <span className="whitespace-nowrap text-[13px] text-muted-foreground">
        {visibleCount} {visibleCount === 1 ? 'contributor' : 'contributors'}
      </span>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search contributor"
        aria-label="Search contributors"
        className="min-w-[260px] rounded-full border border-border bg-card px-[18px] py-2.5 text-[13px] text-foreground outline-none placeholder:text-text-subtle focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted"
      />
    </div>
  );
}