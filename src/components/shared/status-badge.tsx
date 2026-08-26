import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<string, string> = {
  Approved: 'bg-success-subtle text-success',
  Active: 'bg-success-subtle text-success',
  Rejected: 'bg-danger-subtle text-danger',
  Suspended: 'bg-danger-subtle text-danger',
  Draft: 'bg-info-subtle text-info',
  Submitted: 'bg-info-subtle text-info',
  Scheduled: 'bg-info-subtle text-info',
  'Revision Requested': 'bg-warning-subtle text-warning',
  Invited: 'bg-warning-subtle text-warning',
  'Under Review': 'bg-warning-subtle text-warning',
  Requested: 'bg-warning-subtle text-warning',
  Pending: 'bg-warning-subtle text-warning',
  'On hold': 'bg-warning-subtle text-warning',
  Recorded: 'bg-surface-muted text-muted-foreground',
  Archived: 'bg-surface-muted text-muted-foreground',
  Published: 'bg-success-subtle text-success',
  Available: 'bg-success-subtle text-success',
  Paid: 'bg-success-subtle text-success',
  Owner: 'bg-success-subtle text-success',
  'Platform owner': 'bg-success-subtle text-success',
  Admin: 'bg-info-subtle text-info',
  Low: 'bg-success-subtle text-success',
  Medium: 'bg-warning-subtle text-warning',
  High: 'bg-danger-subtle text-danger',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-[11px] py-[5px] text-[11px] font-bold whitespace-nowrap',
        STATUS_CLASS[status] ?? 'bg-surface-muted text-muted-foreground',
        className,
      )}
    >
      {status}
    </span>
  );
}
