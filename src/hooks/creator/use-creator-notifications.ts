import {
  CREATOR_NOTIFICATION_FILTERS,
  type CreatorNotification,
  type CreatorNotificationFilter,
} from '@/models/creator/creator-notifications-model';
import {
  useGetCreatorNotificationsQuery,
  useMarkAllCreatorNotificationsReadMutation,
  useToggleCreatorNotificationMutation,
} from '@/services/creator/creator-notifications-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseCreatorNotificationsResult {
  notifications: CreatorNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  toggleRead: (id: string) => void;
  markAllRead: () => void;
  isMarkingAll: boolean;
}

function isNotificationFilter(
  value: string,
): value is CreatorNotificationFilter {
  return (CREATOR_NOTIFICATION_FILTERS as readonly string[]).includes(value);
}

export function parseCreatorNotificationFilter(
  value: string | null,
): CreatorNotificationFilter {
  if (!value) {
    return 'All';
  }
  return isNotificationFilter(value) ? value : 'All';
}

export default function useCreatorNotifications(
  filter: CreatorNotificationFilter = 'All',
): UseCreatorNotificationsResult {
  const { data, isLoading, isError, error, refetch } =
    useGetCreatorNotificationsQuery({ filter });
  const [toggleNotification] = useToggleCreatorNotificationMutation();
  const [markAll, { isLoading: isMarkingAll }] =
    useMarkAllCreatorNotificationsReadMutation();

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
