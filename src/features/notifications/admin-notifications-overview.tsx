import { AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';

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
import AdminNotificationFilters from '@/features/notifications/admin-notification-filters';
import AdminNotificationList from '@/features/notifications/admin-notification-list';
import useAdminNotifications, {
  parseNotificationFilter,
} from '@/hooks/notifications/use-admin-notifications';
import type { AdminNotification } from '@/models/notifications/admin-notifications-model';
import { getAdminNotificationLink } from '@/utils/notification-link';

export default function AdminNotificationsOverview() {
  const [searchParams] = useTanstackSearchParams();
  const filter = parseNotificationFilter(searchParams.get('filter'));
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    error,
    refetch,
    toggleRead,
    markAllRead,
    isMarkingAll,
  } = useAdminNotifications(filter);

  /**
   * Centralised row-activation logic for the full notifications page.
   * Mirrors the popover's behavior: route when possible, otherwise
   * just mark read.
   */
  const handleActivate = (notification: AdminNotification) => {
    const target = getAdminNotificationLink({
      rawType: notification.rawType,
      linkedRecordType: notification.linkedRecordType,
      linkedRecordId: notification.linkedRecordId,
    });

    toggleRead(notification.id);

    if (target) {
      void navigate({ to: target });
    }
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load notifications
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
    <div>
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description={`Review queue, applicants and payouts in one place. ${unreadCount} unread.`}
        action={
          <Button
            type="button"
            variant="outline"
            disabled={isMarkingAll || unreadCount === 0}
            loading={isMarkingAll}
            onClick={markAllRead}
            className="h-auto rounded-full border-border bg-card px-[18px] py-[11px] font-bold text-foreground hover:border-foreground transition-colors"
          >
            {isMarkingAll ? 'Marking…' : 'Mark all as read'}
          </Button>
        }
      />

      <AdminNotificationFilters filter={filter} />

      {isLoading ? (
        <div className="overflow-hidden rounded-[20px] border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-16 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
          <span className="mb-2.5 block text-[28px]" aria-hidden>
            ◇
          </span>
          <strong className="mb-1 block text-foreground">Nothing here</strong>
          <span className="text-[13px]">
            Try a different filter, or check back after new activity.
          </span>
        </div>
      ) : (
        <AdminNotificationList
          notifications={notifications}
          onActivate={handleActivate}
        />
      )}
    </div>
  );
}
