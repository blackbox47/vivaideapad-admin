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
      <span className="whitespace-nowrap text-[13px] text-[#687773]">
        {visibleCount} {visibleCount === 1 ? 'contributor' : 'contributors'}
      </span>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search contributor"
        aria-label="Search contributors"
        className="min-w-[260px] rounded-full border border-[#dfe7e3] bg-white px-[18px] py-2.5 text-[13px] text-foreground outline-none placeholder:text-[#9aa8a3] focus-visible:border-[#70a28d] focus-visible:shadow-[0_0_0_3px_#e2f1ea]"
      />
    </div>
  );
}