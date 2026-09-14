import {
  ADMIN_NOTIFICATION_FILTERS,
  type AdminNotification,
  type AdminNotificationFilter,
} from '@/models/notifications/admin-notifications-model';
import { baseService } from '@/services/core/base-service';
import {
  useGetAdminNotificationsQuery,
  useMarkAllAdminNotificationsReadMutation,
  useToggleAdminNotificationMutation,
} from '@/services/notifications/admin-notifications-service';
import { useAppDispatch } from '@/store/hooks';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import {
  getAdminNotificationLink,
  getAdminNotificationPageTags,
} from '@/utils/notification-link';
import { toast } from '@/components/ui/sonner';

interface UseAdminNotificationsResult {
  notifications: AdminNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  toggleRead: (id: string) => void;
  /**
   * Mark unread, invalidate the destination page cache, and return the
   * route to navigate to (or `null` when the row has no target).
   */
  activate: (notification: AdminNotification) => string | null;
  markAllRead: () => void;
  isMarkingAll: boolean;
}

function isNotificationFilter(value: string): value is AdminNotificationFilter {
  return (ADMIN_NOTIFICATION_FILTERS as readonly string[]).includes(value);
}

export function parseNotificationFilter(
  value: string | null,
): AdminNotificationFilter {
  if (!value) {
    return 'All';
  }
  return isNotificationFilter(value) ? value : 'All';
}

export interface UseAdminNotificationsOptions {
  skip?: boolean;
}

export default function useAdminNotifications(
  filter: AdminNotificationFilter = 'All',
  options?: UseAdminNotificationsOptions,
): UseAdminNotificationsResult {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error, refetch } =
    useGetAdminNotificationsQuery({ filter }, { skip: options?.skip });
  const [toggleNotification] = useToggleAdminNotificationMutation();
  const [markAll, { isLoading: isMarkingAll }] =
    useMarkAllAdminNotificationsReadMutation();

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    toggleRead: (id) => {
      void toggleNotification({ id });
    },
    activate: (notification) => {
      const target = getAdminNotificationLink({
        rawType: notification.rawType,
        linkedRecordType: notification.linkedRecordType,
        linkedRecordId: notification.linkedRecordId,
      });

      if (target && !notification.read) {
        const tags = getAdminNotificationPageTags(
          notification.linkedRecordType,
        );
        if (tags.length > 0) {
          dispatch(baseService.util.invalidateTags(tags));
        }
      }

      if (!notification.read) {
        void toggleNotification({ id: notification.id });
      }

      return target;
    },
    markAllRead: () => {
      void markAll()
        .unwrap()
        .then(() => {
          toast.success('All notifications marked as read');
        })
        .catch(() => {
          toast.error('Failed to mark notifications as read');
        });
    },
    isMarkingAll,
  };
}
