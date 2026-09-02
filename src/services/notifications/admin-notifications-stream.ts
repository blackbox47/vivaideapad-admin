import { env } from '@/config/env';
import type {
  AdminNotification,
  AdminNotificationsResponse,
} from '@/models/notifications/admin-notifications-model';
import { baseService } from '@/services/core/base-service';
import { adminNotificationsService } from '@/services/notifications/admin-notifications-service';
import { ADMIN_NOTIFICATIONS_STREAM_URL } from '@/utils/constants/api-end-points';

/**
 * Wire shape emitted by the backend on `GET /admin/notifications/stream`.
 * Mirrors the columns the contributor endpoint serializes.
 */
interface AdminWireNotification {
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
  | { type: 'created'; notification: AdminWireNotification }
  | { type: 'updated'; notification: AdminWireNotification }
  | { type: 'deleted'; notification: { id: string } };

/**
 * Convert a wire notification from the SSE envelope into the cached
 * `AdminNotification` shape used by the rest of the SPA. Mirrors the
 * mapping in `admin-notifications-service.ts` so cache mutations look
 * identical to refetched entries.
 */
function wireToAdminNotification(
  wire: AdminWireNotification,
): AdminNotification {
  return {
    id: wire.id,
    title: wire.title,
    body: wire.body ?? '',
    time: new Date(wire.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    type: 'System',
    icon: 'bell',
    iconBg: 'bg-primary/10',
    read: wire.read_state === 'read',
    occurredAt: wire.created_at,
  };
}

/**
 * Open the admin notification SSE stream and mutate the existing RTK Query
 * cache as events arrive. Returns a teardown function that closes the
 * `EventSource`.
 *
 * Mock mode short-circuits — `env.useMockApi` makes `customFetch` mock
 * every fetch, but `EventSource` would still hit the network. We avoid the
 * pointless network connection by not opening a stream at all in mock mode.
 */
export function startAdminNotificationsStream(store: {
  dispatch: (action: unknown) => unknown;
}): () => void {
  const url = `${env.apiBaseUrl.replace(/\/+$/, '')}${ADMIN_NOTIFICATIONS_STREAM_URL}`;
  const es = new EventSource(url, { withCredentials: true });

  const handle = (raw: MessageEvent<string>): void => {
    let envelope: StreamEnvelope;
    try {
      envelope = JSON.parse(raw.data) as StreamEnvelope;
    } catch {
      // Malformed frame — swallow so a single bad message can't kill the
      // stream. The native EventSource will keep delivering subsequent
      // frames.
      return;
    }

    if (envelope.type === 'created') {
      // Invalidate so the next getAdminNotifications call refetches and
      // the new row lands in the cache. One line, idempotent, correct for
      // pagination state.
      store.dispatch(
        baseService.util.invalidateTags(['admin-notifications']),
      );
      return;
    }

    if (envelope.type === 'updated') {
      const incoming = wireToAdminNotification(envelope.notification);
      store.dispatch(
        adminNotificationsService.util.updateQueryData(
          'getAdminNotifications',
          undefined,
          (draft: AdminNotificationsResponse) => {
            const target = draft.notifications.find(
              (n) => n.id === incoming.id,
            );
            if (target) {
              target.read = incoming.read;
            }
          },
        ),
      );
      return;
    }

    if (envelope.type === 'deleted') {
      const id = envelope.notification.id;
      store.dispatch(
        adminNotificationsService.util.updateQueryData(
          'getAdminNotifications',
          undefined,
          (draft: AdminNotificationsResponse) => {
            draft.notifications = draft.notifications.filter(
              (n) => n.id !== id,
            );
            draft.total = Math.max(0, draft.total - 1);
            if (draft.unreadCount > 0) draft.unreadCount -= 1;
          },
        ),
      );
      // Belt-and-braces: if the cached page doesn't contain the deleted
      // id (different filter, different page), invalidate so a future
      // refetch reconciles state.
      store.dispatch(
        baseService.util.invalidateTags(['admin-notifications']),
      );
    }
  };

  es.addEventListener('created', handle as unknown as EventListener);
  es.addEventListener('updated', handle as unknown as EventListener);
  es.addEventListener('deleted', handle as unknown as EventListener);
  // Native EventSource auto-reconnects on network errors; nothing else to do.
  es.addEventListener('error', () => {
    /* swallow */
  });

  return () => es.close();
}