import { Input } from '@/components/ui/input';

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
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search contributor"
        aria-label="Search contributors"
        className="min-w-65 rounded-full px-4.5 py-2.5 text-[13px] placeholder:text-text-subtle"
      />
    </div>
  );
}