import { env } from '@/config/env';
import {
  CREATOR_NOTIFICATION_FILTERS,
  type CreatorNotification,
  type CreatorNotificationsResponse,
} from '@/models/creator/creator-notifications-model';
import { baseService } from '@/services/core/base-service';
import { creatorNotificationsService } from '@/services/creator/creator-notifications-service';
import { CREATOR_NOTIFICATIONS_STREAM_URL } from '@/utils/constants/api-end-points';
import { parseApiDateTime } from '@/utils/helpers/parse-api-date-time';
import { toast } from '@/components/ui/sonner';

/** Same cache args the list hook uses — SSE must patch every filter key. */
function patchCreatorNotificationCaches(
  dispatch: (action: unknown) => unknown,
  updater: (draft: CreatorNotificationsResponse) => void,
): void {
  for (const filter of CREATOR_NOTIFICATION_FILTERS) {
    dispatch(
      creatorNotificationsService.util.updateQueryData(
        'getCreatorNotifications',
        { filter },
        updater,
      ),
    );
  }
}

/**
 * Wire shape emitted by the backend on
 * `GET /contributor/notifications/stream`.
 */
interface CreatorWireNotification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  body: string | null;
  payload: Record<string, unknown> | null;
  linked_record_type: string | null;
  linked_record_id: string | null;
  read_state: 'unread' | 'read';
  read_at: string | null;
  created_at: string;
}

type StreamEnvelope =
  | { type: 'created'; notification: CreatorWireNotification }
  | { type: 'updated'; notification: CreatorWireNotification }
  | { type: 'deleted'; notification: { id: string } };

/** Convert a wire notification to the cached `CreatorNotification` shape. */
function wireToCreatorNotification(
  wire: CreatorWireNotification,
): CreatorNotification {
  const occurredAt = parseApiDateTime(wire.created_at);
  return {
    id: wire.id,
    title: wire.title,
    body: wire.body ?? '',
    time: new Date(occurredAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    type: 'Decisions',
    icon: 'bell',
    iconBg: 'bg-primary/10',
    read: wire.read_state === 'read',
    occurredAt,
    // Carry routing inputs through so cache mutations from SSE look
    // identical to refetched entries and clicks can route.
    rawType: wire.type,
    linkedRecordType: wire.linked_record_type,
    linkedRecordId: wire.linked_record_id,
  };
}

/**
 * Open the creator notification SSE stream and mutate the existing RTK
 * Query cache. Returns a teardown that closes the `EventSource`.
 *
 * Mock mode short-circuits — see the admin stream for the rationale.
 */
export function startCreatorNotificationsStream(store: {
  dispatch: (action: unknown) => unknown;
}): () => void {
  const url = `${env.apiBaseUrl.replace(/\/+$/, '')}${CREATOR_NOTIFICATIONS_STREAM_URL}`;
  const es = new EventSource(url, { withCredentials: true });

  const handle = (raw: MessageEvent<string>): void => {
    let envelope: StreamEnvelope;
    try {
      envelope = JSON.parse(raw.data) as StreamEnvelope;
    } catch {
      return;
    }

    if (envelope.type === 'created') {
      store.dispatch(
        baseService.util.invalidateTags(['creator-notifications']),
      );
      toast.info(envelope.notification.title, {
        description: envelope.notification.body ?? undefined,
      });
      return;
    }

    if (envelope.type === 'updated') {
      const incoming = wireToCreatorNotification(envelope.notification);
      patchCreatorNotificationCaches(store.dispatch, (draft) => {
        const target = draft.notifications.find((n) => n.id === incoming.id);
        if (target && target.read !== incoming.read) {
          target.read = incoming.read;
          if (incoming.read) {
            draft.unreadCount = Math.max(0, draft.unreadCount - 1);
          } else {
            draft.unreadCount += 1;
          }
        }
      });
      return;
    }

    if (envelope.type === 'deleted') {
      const id = envelope.notification.id;
      patchCreatorNotificationCaches(store.dispatch, (draft) => {
        const existing = draft.notifications.find((n) => n.id === id);
        draft.notifications = draft.notifications.filter((n) => n.id !== id);
        draft.total = Math.max(0, draft.total - 1);
        if (existing && !existing.read) {
          draft.unreadCount = Math.max(0, draft.unreadCount - 1);
        }
      });
      store.dispatch(
        baseService.util.invalidateTags(['creator-notifications']),
      );
    }
  };

  es.addEventListener('created', handle as unknown as EventListener);
  es.addEventListener('updated', handle as unknown as EventListener);
  es.addEventListener('deleted', handle as unknown as EventListener);
  es.addEventListener('error', () => {
    /* swallow — native EventSource auto-reconnects */
  });

  return () => es.close();
}