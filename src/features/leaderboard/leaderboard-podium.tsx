import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPoints } from '@/hooks/leaderboard/use-leaderboard';
import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard-model';

const PODIUM_AVATAR_BG = ['#dff8eb', '#e7e3ff', '#ffe6d5'];
const PODIUM_MEDAL = ['🥇', '🥈', '🥉'];

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

export default function LeaderboardPodium({
  entries,
  isLoading,
}: LeaderboardPodiumProps) {
  if (isLoading) {
    return (
      <div className="mb-5 grid gap-3.5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-[24px] bg-[#173f33] p-7 text-white"
          >
            <Skeleton className="mb-4 size-9 rounded-full bg-white/20" />
            <Skeleton className="size-16 rounded-full bg-white/20" />
            <Skeleton className="mt-4 h-4 w-28 bg-white/20" />
            <Skeleton className="mt-3 h-7 w-16 bg-white/20" />
            <Skeleton className="mt-2 h-3 w-24 bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mb-5 grid gap-3.5 sm:grid-cols-3">
      {entries.map((entry, index) => (
        <article
          key={entry.id}
          className="flex flex-col items-center rounded-[24px] bg-[#173f33] p-7 text-white"
        >
          <span className="mb-3 text-3xl leading-none" aria-hidden>
            {PODIUM_MEDAL[index] ?? '🏅'}
          </span>
          <Avatar className="size-16 after:border-transparent">
            <AvatarFallback
              className="text-base font-bold text-[#12231f]"
              style={{ backgroundColor: PODIUM_AVATAR_BG[index] ?? '#dff8eb' }}
            >
              {entry.initials}
            </AvatarFallback>
          </Avatar>
          <p className="mt-4 text-[15px] font-semibold">{entry.name}</p>
          <p className="mt-2 font-heading text-[28px] font-extrabold leading-none tracking-[-0.02em] text-[#c9f36d]">
            {formatPoints(entry.points)}
          </p>
          <p className="mt-3 text-[12px] text-[#9bb3ac]">
            {entry.approvedIdeas} approved · {entry.visibility}
          </p>
        </article>
      ))}
    </div>
  );
}