import {
  ADMIN_NOTIFICATION_FILTERS,
  type AdminNotification,
  type AdminNotificationFilter,
} from '@/models/notifications/admin-notifications-model';
import {
  useGetAdminNotificationsQuery,
  useMarkAllAdminNotificationsReadMutation,
  useToggleAdminNotificationMutation,
} from '@/services/notifications/admin-notifications-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseAdminNotificationsResult {
  notifications: AdminNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  toggleRead: (id: string) => void;
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

export default function useAdminNotifications(
  filter: AdminNotificationFilter = 'All',
): UseAdminNotificationsResult {
  const { data, isLoading, isError, error, refetch } =
    useGetAdminNotificationsQuery({ filter });
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
    markAllRead: () => {
      void markAll();
    },
    isMarkingAll,
  };
}
