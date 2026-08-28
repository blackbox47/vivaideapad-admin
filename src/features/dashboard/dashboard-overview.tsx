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
import ApprovalTrend from '@/features/dashboard/approval-trend';
import DashboardQuickLinks from '@/features/dashboard/dashboard-quick-links';
import PlatformHealthCards from '@/features/dashboard/platform-health-cards';
import ReviewQueue from '@/features/dashboard/review-queue';
import useAdminUser from '@/hooks/auth/use-admin-user';
import useDashboard from '@/hooks/dashboard/use-dashboard';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

export default function DashboardOverview() {
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const { user } = useAdminUser();
  const firstName = user?.display_name?.split(' ')[0] ?? 'Admin';

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
          <Button onClick={refetch}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow="Platform health"
        title={`Good morning, ${firstName}.`}
        description="Here is what needs attention across IdeaPad today."
        action={
          <Button
            render={<Link to={ADMIN_ROUTES.topics} />}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
            + Create concept
          </Button>
        }
      />

      <PlatformHealthCards stats={data?.stats ?? []} isLoading={isLoading} />

      <DashboardQuickLinks />

      <div className="mt-[18px] grid gap-[18px] lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)]">
        <ReviewQueue
          items={data?.reviewQueue ?? []}
          isLoading={isLoading}
        />
        <ApprovalTrend
          items={data?.approvalTrend ?? []}
          total={data?.approvalTotal ?? 0}
          dailyAverage={data?.approvalDailyAverage ?? 0}
          bestDay={data?.approvalBestDay ?? '—'}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
