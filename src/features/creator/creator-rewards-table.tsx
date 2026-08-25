import StatusBadge from '@/components/shared/status-badge';
import type { CreatorRewardEntry } from '@/models/creator/creator-rewards-model';

interface CreatorRewardsTableProps {
  entries: CreatorRewardEntry[];
  isLoading: boolean;
}

const columns = ['Date', 'Description', 'Type', 'Status', 'Amount'] as const;

export default function CreatorRewardsTable({
  entries,
  isLoading,
}: CreatorRewardsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 py-2" aria-hidden>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-md bg-[#f6f8f5]"
          />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="py-6 text-sm text-[#687773]">No transactions yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr>
            {columns.map((label) => (
              <th
                key={label}
                className="py-2.5 text-xs font-medium text-[#687773]"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-[#eef1ef]">
              <td className="py-3 text-[#687773]">{entry.date}</td>
              <td className="py-3 font-medium text-foreground">
                {entry.description}
              </td>
              <td className="py-3 text-[#687773]">{entry.type}</td>
              <td className="py-3">
                <StatusBadge status={entry.status} />
              </td>
              <td className="py-3 font-bold text-foreground">{entry.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
