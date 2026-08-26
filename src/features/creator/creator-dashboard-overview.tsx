import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ContinueCreating from '@/features/creator/continue-creating';
import CreatorStatsCards from '@/features/creator/creator-stats-cards';
import RecentActivity from '@/features/creator/recent-activity';
import useCreatorUser from '@/hooks/auth/use-creator-user';
import useCreatorDashboard from '@/hooks/creator/use-creator-dashboard';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

export default function CreatorDashboardOverview() {
  const { data, isLoading, isError, error, refetch } = useCreatorDashboard();
  const { user } = useCreatorUser();
  const firstName = user?.name.split(' ')[0] ?? 'there';

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load dashboard
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
        eyebrow={data?.eyebrow ?? 'Contributor space'}
        title={`Keep the momentum, ${firstName}.`}
        description={
          data?.description ??
          'You have drafts to shape and live opportunities waiting.'
        }
        action={
          <Button
            render={<Link to={CREATOR_ROUTES.opportunities} />}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
            Explore opportunities ↗
          </Button>
        }
      />

      <CreatorStatsCards stats={data?.stats ?? []} isLoading={isLoading} />

      <div className="mt-[18px] grid gap-[18px] lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)]">
        <ContinueCreating
          items={data?.inProgress ?? []}
          isLoading={isLoading}
        />
        <RecentActivity items={data?.activity ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
