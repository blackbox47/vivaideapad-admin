import {
  CREATOR_NOTIFICATION_FILTERS,
  type CreatorNotification,
  type CreatorNotificationFilter,
} from '@/models/creator/creator-notifications-model';
import { baseService } from '@/services/core/base-service';
import {
  useGetCreatorNotificationsQuery,
  useMarkAllCreatorNotificationsReadMutation,
  useToggleCreatorNotificationMutation,
} from '@/services/creator/creator-notifications-service';
import { useAppDispatch } from '@/store/hooks';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import {
  getCreatorNotificationLink,
  getCreatorNotificationPageTags,
} from '@/utils/notification-link';
import { toast } from '@/components/ui/sonner';

interface UseCreatorNotificationsResult {
  notifications: CreatorNotification[];
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
  activate: (notification: CreatorNotification) => string | null;
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

export interface UseCreatorNotificationsOptions {
  skip?: boolean;
}

export default function useCreatorNotifications(
  filter: CreatorNotificationFilter = 'All',
  options?: UseCreatorNotificationsOptions,
): UseCreatorNotificationsResult {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error, refetch } =
    useGetCreatorNotificationsQuery({ filter }, { skip: options?.skip });
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
    activate: (notification) => {
      const target = getCreatorNotificationLink({
        rawType: notification.rawType,
        linkedRecordType: notification.linkedRecordType,
        linkedRecordId: notification.linkedRecordId,
      });

      if (target && !notification.read) {
        const tags = getCreatorNotificationPageTags(
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
