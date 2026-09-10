import EmptyState from '@/components/shared/empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatLeaderboardPoints } from '@/hooks/creator/use-creator-leaderboard';
import { cn } from '@/lib/utils';
import type { CreatorLeaderboardPerson } from '@/models/creator/creator-leaderboard-model';

interface CreatorLeaderboardStandingsProps {
  entries: CreatorLeaderboardPerson[];
  visibility: string;
  isLoading: boolean;
}

export default function CreatorLeaderboardStandings({
  entries,
  visibility,
  isLoading,
}: CreatorLeaderboardStandingsProps) {
  return (
    <section className="rounded-[22px] border border-border bg-card p-6 text-foreground shadow-xs">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold">Full standings</h2>
        <span className="text-xs text-muted-foreground">
          Points reset monthly · Visibility: {visibility}
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[60px] rounded-[14px]"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          card={false}
          size="sm"
          title="No standings yet"
          description="Standings will appear once contributors earn points."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <div key={entry.id}>
              {entry.showGap ? (
                <div className="py-1 text-center text-xs tracking-[0.1em] text-muted-foreground">
                  ···
                </div>
              ) : null}
              <div
                className={cn(
                  'grid grid-cols-[36px_40px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] px-4 py-3 sm:grid-cols-[36px_40px_minmax(0,1fr)_auto_auto]',
                  entry.isYou
                    ? 'border border-primary/20 bg-primary/5'
                    : 'bg-surface-subtle',
                )}
              >
                <strong>{entry.rankLabel}</strong>
                <Avatar className="size-9 after:border-transparent">
                  <AvatarFallback
                    className="text-xs font-bold text-foreground"
                    style={{ backgroundColor: entry.avatarBg }}
                  >
                    {entry.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <strong className="block truncate">{entry.name}</strong>
                  <div className="text-[11px] text-muted-foreground">
                    {entry.approved} approved ideas · {entry.streak} streak
                  </div>
                </div>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {entry.visibility}
                </span>
                <strong className="text-primary">
                  {formatLeaderboardPoints(entry.points)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
