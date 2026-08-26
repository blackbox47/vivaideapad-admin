import { cn } from '@/lib/utils';
import type { AdminNotification } from '@/models/notifications/admin-notifications-model';

interface AdminNotificationListProps {
  notifications: AdminNotification[];
  onToggle: (id: string) => void;
}

export default function AdminNotificationList({
  notifications,
  onToggle,
}: AdminNotificationListProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-[#dfe7e3] bg-white">
      {notifications.map((notification) => {
        const isUnread = !notification.read;

        return (
          <button
            key={notification.id}
            type="button"
            onClick={() => onToggle(notification.id)}
            className={cn(
              'flex w-full items-start gap-3.5 border-t border-[#eef1ef] px-[18px] py-[18px] text-left first:border-t-0 hover:bg-[#f6f8f5]',
              isUnread ? 'bg-[#f9fdf4]' : 'bg-white',
            )}
          >
            <span
              className="grid size-[42px] shrink-0 place-items-center rounded-[12px] text-base"
              style={{ background: notification.iconBg }}
              aria-hidden
            >
              {notification.icon}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="font-semibold text-foreground">
                {notification.title}
              </strong>
              <p className="mt-1.5 mb-0 text-[14px] text-[#687773]">
                {notification.body}
              </p>
              <small className="mt-1 block text-[12px] text-[#9aa8a3]">
                {notification.time} · {notification.type}
              </small>
            </div>
            {isUnread ? (
              <span
                className="mt-1.5 size-[9px] shrink-0 rounded-full bg-[#c9f36d]"
                aria-label="Unread"
              />
            ) : (
              <span className="shrink-0 pt-0.5 text-[11px] whitespace-nowrap text-[#9aa8a3]">
                Read
              </span>
            )}
          </button>
        );
      })}
    </section>
  );
}
