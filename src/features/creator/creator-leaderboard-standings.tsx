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
    <section className="rounded-[22px] bg-[#173f33] p-6 text-white">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold">Full standings</h2>
        <span className="text-xs text-[#a9bbb4]">
          Points reset monthly · Visibility: {visibility}
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[60px] rounded-[14px] bg-white/10"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#a9bbb4]">
          No standings yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <div key={entry.id}>
              {entry.showGap ? (
                <div className="py-1 text-center text-xs tracking-[0.1em] text-[#a9bbb4]">
                  ···
                </div>
              ) : null}
              <div
                className={cn(
                  'grid grid-cols-[36px_40px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] px-4 py-3 sm:grid-cols-[36px_40px_minmax(0,1fr)_auto_auto]',
                  entry.isYou
                    ? 'bg-[rgba(201,243,109,0.14)]'
                    : 'bg-[rgba(255,255,255,0.06)]',
                )}
              >
                <strong>{entry.rankLabel}</strong>
                <Avatar className="size-9 after:border-transparent">
                  <AvatarFallback
                    className="text-xs font-bold text-[#12231f]"
                    style={{ backgroundColor: entry.avatarBg }}
                  >
                    {entry.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <strong className="block truncate">{entry.name}</strong>
                  <div className="text-[11px] text-[#a9bbb4]">
                    {entry.approved} approved ideas · {entry.streak} streak
                  </div>
                </div>
                <span className="hidden text-xs text-[#a9bbb4] sm:inline">
                  {entry.visibility}
                </span>
                <strong className="text-[#c9f36d]">
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
