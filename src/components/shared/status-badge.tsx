import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<string, string> = {
  Approved: 'bg-[#dff8eb] text-[#16805e]',
  Active: 'bg-[#dff8eb] text-[#16805e]',
  Rejected: 'bg-[#ffe6d5] text-[#b3401f]',
  Suspended: 'bg-[#ffe6d5] text-[#b3401f]',
  Draft: 'bg-[#e7e3ff] text-[#5b4fc4]',
  Submitted: 'bg-[#e7e3ff] text-[#5b4fc4]',
  Scheduled: 'bg-[#e7e3ff] text-[#5b4fc4]',
  'Revision Requested': 'bg-[#fff5d7] text-[#8a6d00]',
  Invited: 'bg-[#fff5d7] text-[#8a6d00]',
  'Under Review': 'bg-[#fff5d7] text-[#8a6d00]',
  Requested: 'bg-[#fff5d7] text-[#8a6d00]',
  Pending: 'bg-[#fff5d7] text-[#8a6d00]',
  'On hold': 'bg-[#fff5d7] text-[#8a6d00]',
  Recorded: 'bg-[#eef1ef] text-[#687773]',
  Archived: 'bg-[#eef1ef] text-[#687773]',
  Published: 'bg-[#dff8eb] text-[#16805e]',
  Available: 'bg-[#dff8eb] text-[#16805e]',
  Paid: 'bg-[#dff8eb] text-[#16805e]',
  Owner: 'bg-[#dff8eb] text-[#16805e]',
  'Platform owner': 'bg-[#dff8eb] text-[#16805e]',
  Admin: 'bg-[#e7e3ff] text-[#5b4fc4]',
  Low: 'bg-[#dff8eb] text-[#16805e]',
  Medium: 'bg-[#fff5d7] text-[#8a6d00]',
  High: 'bg-[#ffe6d5] text-[#b3401f]',
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
        STATUS_CLASS[status] ?? 'bg-[#eef1ef] text-[#687773]',
        className,
      )}
    >
      {status}
    </span>
  );
}
