import {
  TablePagination,
  type TablePaginationProps,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AuditEvent } from '@/models/audit-log/audit-log-model';

interface AuditLogTableProps {
  events: AuditEvent[];
  isLoading: boolean;
  pagination?: TablePaginationProps;
}

const ROW_SKELETON_COUNT = 6;

type AuditActionStatus = 'approved' | 'rejected' | 'revision';

function getActionStatus(event: AuditEvent): AuditActionStatus {
  const actionLower = event.action.toLowerCase();
  const icon = event.icon;

  if (
    actionLower.includes('approve') ||
    actionLower.includes('paid') ||
    icon === '✓'
  ) {
    return 'approved';
  }

  if (
    actionLower.includes('reject') ||
    actionLower.includes('delete') ||
    actionLower.includes('remove') ||
    icon === '✕'
  ) {
    return 'rejected';
  }

  return 'revision';
}

function renderActionIcon(event: AuditEvent, status: AuditActionStatus) {
  if (status === 'approved') {
    return (
      <svg
        className="size-4 stroke-[2.5]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M5 13l4 4L19 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === 'rejected') {
    return (
      <svg
        className="size-4 stroke-[2.5]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M6 18L18 6M6 6l12 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (
    event.icon &&
    event.icon !== '✦' &&
    event.icon !== '✓' &&
    event.icon !== '✕'
  ) {
    return (
      <span className="text-xs font-bold leading-none" aria-hidden="true">
        {event.icon}
      </span>
    );
  }

  return (
    <svg
      className="size-4 fill-current"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
    </svg>
  );
}

function getActionTitle(event: AuditEvent, status: AuditActionStatus): string {
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  if (event.action.toLowerCase().includes('revision')) {
    return 'Requested revision';
  }
  return event.action || 'Requested revision';
}

export default function AuditLogTable({
  events,
  isLoading,
  pagination,
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-[20px] border border-border bg-card">
        {Array.from({ length: ROW_SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[110px_36px_1fr] items-start gap-3.5 border-t border-border-muted px-[18px] py-4 first:border-t-0"
          >
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[20px] border border-border bg-card">
      {events.map((event) => {
        const status = getActionStatus(event);
        const title = getActionTitle(event, status);

        return (
          <div
            key={event.id}
            className="grid grid-cols-[110px_36px_1fr] items-start gap-3.5 border-t border-border-muted px-[18px] py-4 first:border-t-0"
          >
            <small className="whitespace-nowrap text-text-subtle">
              {event.time}
            </small>
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs transition-colors',
                status === 'approved' &&
                  'border-green-400 bg-green-200 text-green-600',
                status === 'rejected' &&
                  'border-red-400 bg-red-200 text-red-600',
                status === 'revision' &&
                  'border-blue-400 bg-blue-200 text-blue-600',
              )}
              title={title}
            >
              {renderActionIcon(event, status)}
            </div>
            <div>
              <strong className="text-[13px] text-foreground">{event.actor}</strong>
              <span className="text-muted-foreground"> — {event.action}</span>
              <div className="mt-0.5 text-[12px] text-muted-foreground">
                {event.target}
              </div>
            </div>
          </div>
        );
      })}
      {pagination && pagination.totalItems > 0 ? (
        <TablePagination {...pagination} />
      ) : null}
    </section>
  );
}