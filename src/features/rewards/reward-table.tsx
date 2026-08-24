import StatusBadge from '@/components/shared/status-badge';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import { cn } from '@/lib/utils';
import type { LedgerEntry } from '@/models/rewards/rewards-model';

interface RewardTableProps {
  entries: LedgerEntry[];
}

export default function RewardTable({ entries }: RewardTableProps) {
  return (
    <ProjectTable
      columns={[
        { label: 'Contributor' },
        { label: 'Date' },
        { label: 'Type' },
        { label: 'Amount' },
        { label: 'Status' },
      ]}
    >
      {entries.map((entry) => {
        const isCredit = entry.amount.trim().startsWith('+');

        return (
          <ProjectTableRow key={entry.id}>
            <ProjectTableCell>
              <strong className="font-semibold text-foreground">
                {entry.contributor}
              </strong>
              <div className="text-[11px] text-[#687773]">
                {entry.description}
              </div>
            </ProjectTableCell>
            <ProjectTableCell className="whitespace-nowrap text-[#687773]">
              {entry.date}
            </ProjectTableCell>
            <ProjectTableCell className="whitespace-nowrap text-[#687773]">
              {entry.type}
            </ProjectTableCell>
            <ProjectTableCell
              className={cn(
                'whitespace-nowrap font-semibold',
                isCredit ? 'text-[#16805e]' : 'text-[#b3401f]',
              )}
            >
              {entry.amount}
            </ProjectTableCell>
            <ProjectTableCell className="whitespace-nowrap">
              <StatusBadge status={entry.status} />
            </ProjectTableCell>
          </ProjectTableRow>
        );
      })}
    </ProjectTable>
  );
}