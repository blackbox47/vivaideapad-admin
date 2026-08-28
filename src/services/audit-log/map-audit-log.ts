import type {
  AuditCategory,
  AuditEvent,
  AuditLogResponse,
} from '@/models/audit-log/audit-log-model';

const ACTION_LABELS: Record<string, string> = {
  'admin.created': 'Created admin',
  'admin.updated': 'Updated admin',
  'admin.deleted': 'Removed admin',
  'application.submitted': 'Submitted application',
  'application.approve_invite': 'Approved applicant',
  'application.reject': 'Rejected applicant',
  'application.request_more_info': 'Requested more info',
  'submission.approve': 'Approved content',
  'submission.reject': 'Rejected content',
  'submission.request_changes': 'Requested revision',
  'submission.risk_scan': 'AI risk scan',
  'payout.created': 'Created payout',
  'payout.mark_paid': 'Marked payout as Paid',
  'payout.reject': 'Rejected payout',
  'ledger.manual_adjustment': 'Balance adjustment',
  'user.profile_updated': 'Updated user profile',
  'user.access_status_updated': 'Updated access status',
  'user.role_updated': 'Updated user role',
  'user.deleted': 'Deleted user',
  'profile.self_updated': 'Updated profile',
  'profile.display_prefs_updated': 'Updated display preferences',
  'notifications.broadcast': 'Broadcast notification',
  'notification.deleted': 'Deleted notification',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
}

function toAuditCategory(raw: unknown): AuditCategory {
  if (
    raw === 'Content' ||
    raw === 'Applicants' ||
    raw === 'Payouts' ||
    raw === 'System'
  ) {
    return raw;
  }

  const value = asString(raw).toLowerCase();
  if (value === 'content' || value === 'submissions' || value === 'concepts') {
    return 'Content';
  }
  if (
    value === 'applicant' ||
    value === 'applicants' ||
    value === 'applications'
  ) {
    return 'Applicants';
  }
  if (value === 'payout' || value === 'payouts' || value === 'ledger') {
    return 'Payouts';
  }
  return 'System';
}

function formatAuditDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
}

function formatAction(action: string): string {
  if (ACTION_LABELS[action]) {
    return ACTION_LABELS[action];
  }
  return action
    .split(/[._]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function actorName(item: Record<string, unknown>): string {
  const actor = item.actor;
  if (typeof actor === 'string' && actor.trim()) {
    return actor;
  }
  if (isRecord(actor) && typeof actor.name === 'string' && actor.name.trim()) {
    return actor.name;
  }
  return 'Unknown';
}

function occurredAtOf(item: Record<string, unknown>): string {
  if (typeof item.occurredAt === 'string') {
    return item.occurredAt;
  }
  if (typeof item.occurred_at === 'string') {
    return item.occurred_at;
  }
  return new Date().toISOString();
}

function targetLabel(item: Record<string, unknown>): string {
  if (typeof item.target === 'string' && item.target.trim()) {
    return item.target;
  }

  const context = isRecord(item.context) ? item.context : null;
  if (context) {
    if (typeof context.email === 'string' && context.email.trim()) {
      return context.email;
    }
    if (typeof context.title === 'string' && context.title.trim()) {
      return context.title;
    }
    if (typeof context.description === 'string' && context.description.trim()) {
      const amount = context.amount;
      if (amount !== undefined && amount !== null) {
        return `Tk ${String(amount)} · ${context.description}`;
      }
      return context.description;
    }
    if (context.amount !== undefined && context.amount !== null) {
      return `Tk ${String(context.amount)}`;
    }
    if (typeof context.new_status === 'string' && context.new_status.trim()) {
      return `${asString(item.target_type, 'record')} → ${context.new_status}`;
    }
  }

  const type = asString(item.target_type, 'record');
  const id = asString(item.target_id);
  if (id && id !== 'batch') {
    return `${type} · ${id.slice(0, 8)}`;
  }
  return type;
}

function iconFor(category: AuditCategory, action: string): string {
  const normalized = action.toLowerCase();
  if (normalized.includes('reject') || normalized.includes('deleted')) {
    return '✕';
  }
  if (normalized.includes('approve') || normalized.includes('paid')) {
    return '✓';
  }
  if (
    category === 'Payouts' ||
    normalized.includes('payout') ||
    normalized.includes('ledger') ||
    normalized.includes('adjustment')
  ) {
    return '৳';
  }
  if (normalized.includes('risk')) {
    return '⚑';
  }
  if (normalized.includes('concept') || normalized.includes('publish')) {
    return '✎';
  }
  return '✦';
}

function isUiAuditEvent(item: Record<string, unknown>): boolean {
  return (
    typeof item.id === 'string' &&
    typeof item.actor === 'string' &&
    typeof item.action === 'string' &&
    typeof item.target === 'string' &&
    typeof item.time === 'string' &&
    typeof item.icon === 'string' &&
    typeof item.occurredAt === 'string'
  );
}

function toAuditEvent(item: unknown): AuditEvent | null {
  if (!isRecord(item) || typeof item.id !== 'string') {
    return null;
  }

  if (isUiAuditEvent(item)) {
    return {
      id: asString(item.id),
      time: asString(item.time),
      occurredAt: asString(item.occurredAt),
      actor: asString(item.actor),
      action: asString(item.action),
      target: asString(item.target),
      category: toAuditCategory(item.category),
      icon: asString(item.icon),
    };
  }

  const action = asString(item.action);
  const category = toAuditCategory(item.category);
  const occurredAt = occurredAtOf(item);

  return {
    id: item.id,
    time: typeof item.time === 'string' ? item.time : formatAuditDate(occurredAt),
    occurredAt,
    actor: actorName(item),
    action: formatAction(action),
    target: targetLabel(item),
    category,
    icon: typeof item.icon === 'string' ? item.icon : iconFor(category, action),
  };
}

function readTotal(response: Record<string, unknown>, fallback: number): number {
  if (typeof response.total === 'number') {
    return response.total;
  }
  if (isRecord(response.meta)) {
    if (typeof response.meta.total === 'number') {
      return response.meta.total;
    }
    if (typeof response.meta.total_items === 'number') {
      return response.meta.total_items;
    }
  }
  return fallback;
}

export function toAuditLogResponse(response: unknown): AuditLogResponse {
  if (!isRecord(response)) {
    return { events: [], total: 0 };
  }

  const source = Array.isArray(response.events)
    ? response.events
    : Array.isArray(response.data)
      ? response.data
      : [];

  const events = source
    .map(toAuditEvent)
    .filter((event): event is AuditEvent => event !== null);

  return {
    events,
    total: readTotal(response, events.length),
  };
}
