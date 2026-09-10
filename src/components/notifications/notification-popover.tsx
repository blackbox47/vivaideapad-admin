import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Megaphone,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminNotifications from '@/hooks/notifications/use-admin-notifications';
import useCreatorNotifications from '@/hooks/creator/use-creator-notifications';
import type { AdminNotification } from '@/models/notifications/admin-notifications-model';
import type { CreatorNotification } from '@/models/creator/creator-notifications-model';
import { cn } from '@/lib/utils';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';
import {
  getAdminNotificationLink,
  getCreatorNotificationLink,
} from '@/utils/notification-link';

interface NotificationPopoverProps {
  role?: 'admin' | 'creator';
  className?: string;
}

function getNotificationIcon(type: string, customIcon?: string) {
  if (customIcon && customIcon !== 'bell' && customIcon.length <= 2) {
    return <span className="text-base">{customIcon}</span>;
  }

  const normalizedType = type.toLowerCase();
  switch (normalizedType) {
    case 'review':
    case 'campaign':
      return <Megaphone className="size-4.5" />;
    case 'applicants':
      return <Users className="size-4.5" />;
    case 'payouts':
      return <CreditCard className="size-4.5" />;
    case 'decisions':
      return <CheckCircle2 className="size-4.5" />;
    case 'feedback':
      return <MessageSquare className="size-4.5" />;
    case 'opportunities':
      return <Sparkles className="size-4.5" />;
    case 'system':
      return <Settings className="size-4.5" />;
    default:
      return <Bell className="size-4.5" />;
  }
}

function formatNotificationTime(timeStr?: string, occurredAt?: string): string {
  if (timeStr && timeStr.trim().length > 0 && !timeStr.includes(':')) {
    return timeStr;
  }
  if (occurredAt) {
    try {
      const date = new Date(occurredAt);
      if (!Number.isNaN(date.getTime())) {
        return formatDistanceToNow(date, { addSuffix: true })
          .replace(/^about\s+/, '')
          .replace('less than a minute ago', 'just now');
      }
    } catch {
      // ignore parsing error
    }
  }
  return timeStr || 'Just now';
}

function AdminNotificationContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, toggleRead, markAllRead, isMarkingAll } =
    useAdminNotifications('All');

  const handleViewAll = () => {
    onClose();
    void navigate({ to: ADMIN_ROUTES.notifications });
  };

  /**
   * Single click action for a notification row:
   * 1. Resolve the target route from the cached link fields.
   * 2. If a route exists, navigate to it (after closing the popover so the
   *    popover animation doesn't fight the route transition).
   * 3. Mark the notification read so the unread dot clears regardless.
   *
   * Notifications without a routable target fall through to the existing
   * "mark read only" behavior.
   */
  const handleActivate = (item: AdminNotification) => {
    const target = getAdminNotificationLink({
      rawType: item.rawType,
      linkedRecordType: item.linkedRecordType,
      linkedRecordId: item.linkedRecordId,
    });

    if (target) {
      onClose();
      toggleRead(item.id);
      // `target` is a fully-qualified path built from ADMIN_ROUTES (with an
      // optional `?focus=...` query). Navigate via the string overload —
      // typing every concrete dynamic path here would couple this component
      // to the full router tree for no benefit.
      void navigate({ to: target });
      return;
    }

    toggleRead(item.id);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3.5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-brand-lime px-2 py-0.5 text-[11px] font-bold text-brand-lime-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={unreadCount === 0 || isMarkingAll}
          loading={isMarkingAll}
          onClick={markAllRead}
          className="h-auto p-0 text-xs font-semibold text-brand-forest hover:bg-transparent hover:text-foreground hover:underline dark:text-brand-lime dark:hover:text-brand-lime/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isMarkingAll ? 'Marking…' : 'Mark all as read'}
        </Button>
      </div>

      {/* Notification List */}
      <div className="flex-1 max-h-[380px] overflow-y-auto divide-y divide-border/50 bg-card">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <div className="mb-2.5 flex size-10 items-center justify-center rounded-full bg-surface-subtle text-muted-foreground">
              <Bell className="size-5 opacity-60" />
            </div>
            <p className="text-xs font-semibold text-foreground">No notifications</p>
            <p className="mt-0.5 text-[11px] text-text-subtle">
              You're all caught up! Check back later.
            </p>
          </div>
        ) : (
          notifications.map((item) => {
            const isUnread = !item.read;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleActivate(item)}
                className={cn(
                  'flex w-full items-start gap-3.5 p-4 text-left transition-colors cursor-pointer group',
                  isUnread
                    ? 'bg-brand-lime-tint hover:bg-surface-subtle'
                    : 'bg-card hover:bg-surface-subtle',
                )}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  style={item.iconBg && !item.iconBg.startsWith('bg-') ? { backgroundColor: item.iconBg } : undefined}
                >
                  {getNotificationIcon(item.type, item.icon)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-bold text-foreground sm:text-[13px]">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                      {formatNotificationTime(item.time, item.occurredAt)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
                {isUnread && (
                  <div
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-lime ring-2 ring-background"
                    aria-label="Unread notification"
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card p-3 text-center">
        <Button
          variant="outline"
          onClick={handleViewAll}
          className="w-full rounded-xl border-border bg-card py-2 text-xs font-semibold text-foreground shadow-none hover:border-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
}

function CreatorNotificationContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, toggleRead, markAllRead, isMarkingAll } =
    useCreatorNotifications('All');

  const handleViewAll = () => {
    onClose();
    void navigate({ to: CREATOR_ROUTES.notifications });
  };

  /**
   * Mirror of `handleActivate` in `AdminNotificationContent`. Routes creator
   * notifications to the contributor SPA's relevant pages — see
   * `getCreatorNotificationLink` for the routing table.
   */
  const handleActivate = (item: CreatorNotification) => {
    const target = getCreatorNotificationLink({
      rawType: item.rawType,
      linkedRecordType: item.linkedRecordType,
      linkedRecordId: item.linkedRecordId,
    });

    if (target) {
      onClose();
      toggleRead(item.id);
      void navigate({ to: target });
      return;
    }

    toggleRead(item.id);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3.5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-brand-lime px-2 py-0.5 text-[11px] font-bold text-brand-lime-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={unreadCount === 0 || isMarkingAll}
          loading={isMarkingAll}
          onClick={markAllRead}
          className="h-auto p-0 text-xs font-semibold text-brand-forest hover:bg-transparent hover:text-foreground hover:underline dark:text-brand-lime dark:hover:text-brand-lime/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isMarkingAll ? 'Marking…' : 'Mark all as read'}
        </Button>
      </div>

      {/* Notification List */}
      <div className="flex-1 max-h-[380px] overflow-y-auto divide-y divide-border/50 bg-card">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <div className="mb-2.5 flex size-10 items-center justify-center rounded-full bg-surface-subtle text-muted-foreground">
              <Bell className="size-5 opacity-60" />
            </div>
            <p className="text-xs font-semibold text-foreground">No notifications</p>
            <p className="mt-0.5 text-[11px] text-text-subtle">
              You're all caught up! Check back later.
            </p>
          </div>
        ) : (
          notifications.map((item) => {
            const isUnread = !item.read;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleActivate(item)}
                className={cn(
                  'flex w-full items-start gap-3.5 p-4 text-left transition-colors cursor-pointer group',
                  isUnread
                    ? 'bg-brand-lime-tint hover:bg-surface-subtle'
                    : 'bg-card hover:bg-surface-subtle',
                )}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  style={item.iconBg && !item.iconBg.startsWith('bg-') ? { backgroundColor: item.iconBg } : undefined}
                >
                  {getNotificationIcon(item.type, item.icon)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-bold text-foreground sm:text-[13px]">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                      {formatNotificationTime(item.time, item.occurredAt)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
                {isUnread && (
                  <div
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-lime ring-2 ring-background"
                    aria-label="Unread notification"
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card p-3 text-center">
        <Button
          variant="outline"
          onClick={handleViewAll}
          className="w-full rounded-xl border-border bg-card py-2 text-xs font-semibold text-foreground shadow-none hover:border-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
}

export default function NotificationPopover({
  role = 'admin',
  className,
}: NotificationPopoverProps) {
  const [open, setOpen] = useState(false);

  // Get unreadCount for trigger button badge
  const { unreadCount: adminUnreadCount } = useAdminNotifications('All', {
    skip: role !== 'admin',
  });
  const { unreadCount: creatorUnreadCount } = useCreatorNotifications('All', {
    skip: role !== 'creator',
  });
  const unreadCount = role === 'admin' ? adminUnreadCount : creatorUnreadCount;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'relative size-10 cursor-pointer rounded-full border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary',
              className,
            )}
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
          />
        }
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 ? (
          <span
            className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary"
            aria-hidden
          />
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-[360px] sm:w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl z-[80]"
      >
        {role === 'admin' ? (
          <AdminNotificationContent onClose={() => setOpen(false)} />
        ) : (
          <CreatorNotificationContent onClose={() => setOpen(false)} />
        )}
      </PopoverContent>
    </Popover>
  );
}
