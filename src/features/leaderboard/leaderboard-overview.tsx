import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LeaderboardFilters from '@/features/leaderboard/leaderboard-filters';
import LeaderboardKpiCards from '@/features/leaderboard/leaderboard-kpi-cards';
import LeaderboardPodium from '@/features/leaderboard/leaderboard-podium';
import LeaderboardTable from '@/features/leaderboard/leaderboard-table';
import RecalculateButton from '@/features/leaderboard/recalculate-button';
import useLeaderboard, { formatPoints } from '@/hooks/leaderboard/use-leaderboard';

export default function LeaderboardOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';

  const {
    podium,
    standings,
    topScore,
    rankedCount,
    averagePoints,
    isLoading,
    isError,
    error,
    refetch,
  } = useLeaderboard({ search });

  const setSearch = (next: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (next.trim().length === 0) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', next);
    }

    setSearchParams(nextParams, { replace: true });
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load leaderboard
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const totalEntries = podium.length + standings.length;

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Leaderboard"
        description="Configured scoring drives public rank and points."
        action={<RecalculateButton />}
      />

      <LeaderboardKpiCards
        isLoading={isLoading}
        items={[
          { id: 'ranked', label: 'Ranked contributors', value: String(rankedCount) },
          { id: 'top', label: 'Top score', value: formatPoints(topScore) },
          {
            id: 'average',
            label: 'Average points',
            value: formatPoints(averagePoints),
          },
        ]}
      />

      {isLoading ? (
        <LeaderboardPodium entries={[]} isLoading />
      ) : (
        <LeaderboardPodium entries={podium} isLoading={false} />
      )}

      {isLoading ? (
        <div className="overflow-hidden rounded-[18px] border border-[#dfe7e3] bg-white p-4">
          <Skeleton className="mb-3 h-4 w-40" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          {totalEntries > 0 ? (
            <LeaderboardFilters
              search={search}
              visibleCount={totalEntries}
              onSearchChange={setSearch}
            />
          ) : null}

          {totalEntries === 0 ? (
            <div className="rounded-[22px] border border-[#dfe7e3] bg-white px-6 py-[60px] text-center text-[#687773]">
              <span className="mb-2.5 block text-[28px]">◇</span>
              <strong className="mb-1 block text-foreground">
                No matches
              </strong>
              <span className="text-[13px]">
                Try a different keyword.
              </span>
            </div>
          ) : (
            <LeaderboardTable entries={standings} />
          )}
        </>
      )}
    </div>
  );
}