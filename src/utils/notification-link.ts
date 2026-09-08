import { ADMIN_ROUTES } from '@/utils/constants/routes';

/**
 * Notification click routing.
 *
 * The backend stores `type`, `linked_record_type`, and `linked_record_id` on
 * every notification row. The frontend already receives those fields on the
 * `GET /admin/notifications` and `/contributor/notifications` responses (and
 * over SSE) but currently discards them when mapping to the cached
 * notification shape. This helper is the single source of truth for turning
 * a tuple of (rawType, linkedRecordType, linkedRecordId) into a router path.
 *
 * Returns `null` when the notification has no routable target (e.g. generic
 * `broadcast` / `system` rows with no `linked_record_*`). Callers fall back
 * to a "mark as read only" no-op in that case.
 *
 * The return type is a plain `string` rather than a typed route so that it
 * can flow through `@tanstack/react-router`'s `useNavigate({ to })` API
 * without forcing the caller to import every concrete route type.
 */

export interface NotificationLinkInput {
  rawType: string | null | undefined;
  linkedRecordType: string | null | undefined;
  linkedRecordId: string | null | undefined;
}

/**
 * Admin SPA route for a notification.
 *
 * Routing table (Phase 1 of the plan):
 *
 *   application              -> /admin/applicants
 *   submission               -> /admin/content-review (list page; admin reviews submissions here)
 *   payout                   -> /admin/payouts
 *   user                     -> /admin/admins         (no per-user detail route exists today)
 *   anything else / no link  -> null
 */
export function getAdminNotificationLink(
  input: NotificationLinkInput,
): string | null {
  const { linkedRecordType, linkedRecordId } = input;

  if (!linkedRecordType || !linkedRecordId) {
    return null;
  }

  switch (linkedRecordType) {
    case 'application':
      return ADMIN_ROUTES.applicants;
    case 'submission':
      return `${ADMIN_ROUTES.contentReview}?focus=${encodeURIComponent(linkedRecordId)}`;
    case 'payout':
      return `${ADMIN_ROUTES.payouts}?focus=${encodeURIComponent(linkedRecordId)}`;
    case 'user':
      // No admin user-detail route today; route to the admin roster page.
      return ADMIN_ROUTES.admins;
    default:
      return null;
  }
}

/**
 * Creator / contributor SPA route for a notification.
 *
 * Routing table:
 *
 *   submission               -> /submissions         (list page; creator's submissions live here)
 *   payout                   -> /rewards             (creator payouts surface in rewards)
 *   concept                  -> /opportunities       (broadcasts link to specific concepts)
 *   anything else / no link  -> null
 */
export function getCreatorNotificationLink(
  input: NotificationLinkInput,
): string | null {
  const { linkedRecordType, linkedRecordId } = input;

  if (!linkedRecordType || !linkedRecordId) {
    return null;
  }

  switch (linkedRecordType) {
    case 'submission':
      return `/submissions?focus=${encodeURIComponent(linkedRecordId)}`;
    case 'payout':
      return `/rewards?focus=${encodeURIComponent(linkedRecordId)}`;
    case 'concept':
      return `/opportunities?focus=${encodeURIComponent(linkedRecordId)}`;
    default:
      return null;
  }
}
