import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CreatorLeaderboardPodium from '@/features/creator/creator-leaderboard-podium';
import CreatorLeaderboardStandings from '@/features/creator/creator-leaderboard-standings';
import CreatorStatsCards from '@/features/creator/creator-stats-cards';
import useCreatorLeaderboard from '@/hooks/creator/use-creator-leaderboard';

export default function CreatorLeaderboardOverview() {
  const { data, isLoading, isError, error, refetch } = useCreatorLeaderboard();

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

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow={data?.eyebrow ?? 'Community'}
        title={data?.title ?? 'Leaderboard'}
        description={
          data?.description ??
          'Celebrating original thinking and consistent positive contribution.'
        }
      />

      <CreatorStatsCards stats={data?.stats ?? []} isLoading={isLoading} />

      <CreatorLeaderboardPodium
        entries={data?.podium ?? []}
        isLoading={isLoading}
      />

      <CreatorLeaderboardStandings
        entries={data?.standings ?? []}
        visibility={data?.visibility ?? 'Public'}
        isLoading={isLoading}
      />
    </div>
  );
}
