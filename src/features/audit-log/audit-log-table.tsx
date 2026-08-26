import { Skeleton } from '@/components/ui/skeleton';
import type { AuditEvent } from '@/models/audit-log/audit-log-model';

interface AuditLogTableProps {
  events: AuditEvent[];
  isLoading: boolean;
}

const ROW_SKELETON_COUNT = 6;

export default function AuditLogTable({
  events,
  isLoading,
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-[20px] border border-border bg-card">
        {Array.from({ length: ROW_SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[110px_34px_1fr] items-start gap-3.5 border-t border-border-muted px-[18px] py-4 first:border-t-0"
          >
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="size-8.5 rounded-[10px]" />
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
      {events.map((event) => (
        <div
          key={event.id}
          className="grid grid-cols-[110px_34px_1fr] items-start gap-3.5 border-t border-border-muted px-[18px] py-4 first:border-t-0"
        >
          <small className="whitespace-nowrap text-text-subtle">
            {event.time}
          </small>
          <span className="grid size-[34px] place-items-center rounded-[10px] bg-surface-subdued text-sm text-foreground">
            {event.icon}
          </span>
          <div>
            <strong className="text-[13px] text-foreground">{event.actor}</strong>
            <span className="text-muted-foreground"> — {event.action}</span>
            <div className="mt-0.5 text-[12px] text-muted-foreground">
              {event.target}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}