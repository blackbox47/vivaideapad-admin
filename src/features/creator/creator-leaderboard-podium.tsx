import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatLeaderboardPoints } from '@/hooks/creator/use-creator-leaderboard';
import type { CreatorLeaderboardPerson } from '@/models/creator/creator-leaderboard-model';

interface CreatorLeaderboardPodiumProps {
  entries: CreatorLeaderboardPerson[];
  isLoading: boolean;
}

export default function CreatorLeaderboardPodium({
  entries,
  isLoading,
}: CreatorLeaderboardPodiumProps) {
  if (isLoading) {
    return (
      <div className="mt-5 mb-5 grid gap-3.5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-[20px] border border-border bg-card p-[22px]"
          >
            <Skeleton className="mb-2.5 size-7 rounded-full" />
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="mt-2 h-4 w-28" />
            <Skeleton className="mt-2 h-5 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 mb-5 grid gap-3.5 sm:grid-cols-3">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="rounded-[20px] border border-border bg-card p-[22px] text-center text-foreground shadow-xs"
        >
          <span className="block text-[28px] leading-none" aria-hidden>
            {entry.medal ?? '🏅'}
          </span>
          <Avatar className="mx-auto mt-2.5 size-12 after:border-transparent">
            <AvatarFallback
              className="text-sm font-bold text-foreground"
              style={{ backgroundColor: entry.avatarBg }}
            >
              {entry.initials}
            </AvatarFallback>
          </Avatar>
          <strong className="mt-2 block text-[15px] font-semibold">
            {entry.name}
          </strong>
          <span className="mt-1 block font-heading text-xl text-primary">
            {formatLeaderboardPoints(entry.points)}
          </span>
          <span className="block text-xs text-muted-foreground">
            {entry.approved} approved · {entry.streak} streak
          </span>
        </article>
      ))}
    </div>
  );
}
