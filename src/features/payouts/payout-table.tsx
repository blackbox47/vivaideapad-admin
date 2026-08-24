import StatusBadge from '@/components/shared/status-badge';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import type { Payout } from '@/models/payouts/payouts-model';

interface PayoutTableProps {
  payouts: Payout[];
  onProcess: (id: string) => void;
}

export default function PayoutTable({ payouts, onProcess }: PayoutTableProps) {
  return (
    <ProjectTable
      columns={[
        { label: 'Contributor' },
        { label: 'Method' },
        { label: 'Amount' },
        { label: 'Requested' },
        { label: 'Status' },
        { isAction: true },
      ]}
    >
      {payouts.map((payout) => {
        const canProcess =
          payout.status === 'Requested' ||
          payout.status === 'Under Review' ||
          payout.status === 'Approved';

        return (
          <ProjectTableRow key={payout.id}>
            <ProjectTableCell className="font-semibold text-foreground">
              {payout.contributor}
            </ProjectTableCell>
            <ProjectTableCell className="text-[#687773]">
              {payout.methodDetail}
            </ProjectTableCell>
            <ProjectTableCell className="whitespace-nowrap font-semibold text-foreground">
              {payout.amount}
            </ProjectTableCell>
            <ProjectTableCell className="whitespace-nowrap text-[#687773]">
              {payout.requested}
            </ProjectTableCell>
            <ProjectTableCell className="whitespace-nowrap">
              <StatusBadge status={payout.status} />
            </ProjectTableCell>
            <ProjectTableCell>
              {canProcess ? (
                <button
                  type="button"
                  className="rounded-full bg-[#12231f] px-3.5 py-2 text-xs font-bold whitespace-nowrap text-white hover:bg-[#254b40]"
                  onClick={() => onProcess(payout.id)}
                >
                  Process
                </button>
              ) : null}
            </ProjectTableCell>
          </ProjectTableRow>
        );
      })}
    </ProjectTable>
  );
}