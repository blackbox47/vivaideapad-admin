import StatusBadge from '@/components/shared/status-badge';
import type { Applicant } from '@/models/people/people-model';
import PeopleTable from '@/features/people/people-table';

interface ApplicantsTableProps {
  applicants: Applicant[];
  onReview: (id: string) => void;
}

export default function ApplicantsTable({
  applicants,
  onReview,
}: ApplicantsTableProps) {
  return (
    <PeopleTable columns={['Applicant', 'Topic', 'Submitted', 'Status', '']}>
      {applicants.map((applicant) => (
        <tr key={applicant.id} className="border-t border-border-muted">
          <td className="px-[18px] py-3.5">
            <strong className="font-semibold text-foreground">
              {applicant.name}
            </strong>
            <div className="text-[11px] text-muted-foreground">{applicant.title}</div>
          </td>
          <td className="px-[18px] py-3.5 text-muted-foreground">{applicant.topic}</td>
          <td className="px-[18px] py-3.5 whitespace-nowrap text-muted-foreground">
            {applicant.submitted}
          </td>
          <td className="px-[18px] py-3.5">
            <StatusBadge status={applicant.status} />
          </td>
          <td className="px-[18px] py-3.5">
            <button
              type="button"
              className="rounded-full border border-border bg-card px-[13px] py-[7px] text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
              onClick={() => onReview(applicant.id)}
            >
              Review
            </button>
          </td>
        </tr>
      ))}
    </PeopleTable>
  );
}
