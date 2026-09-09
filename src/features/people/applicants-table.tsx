import EmptyState from '@/components/shared/empty-state';
import StatusBadge from '@/components/shared/status-badge';
import TableActions from '@/components/shared/table-actions';
import {
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import PeopleTable from '@/features/people/people-table';
import type { Applicant } from '@/models/people/people-model';

interface ApplicantsTableProps {
  applicants: Applicant[];
  onReview: (id: string) => void;
}

export default function ApplicantsTable({
  applicants,
  onReview,
}: ApplicantsTableProps) {
  if (applicants.length === 0) {
    return (
      <EmptyState
        title="No applicants yet"
        description="New contributor applications will appear here."
      />
    );
  }

  return (
    <PeopleTable columns={['Applicant', 'Topic', 'Submitted', 'Status', '']}>
      {applicants.map((applicant) => (
        <ProjectTableRow key={applicant.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">
              {applicant.name}
            </strong>
            <div className="text-[11px] text-muted-foreground">
              {applicant.title}
            </div>
          </ProjectTableCell>
          <ProjectTableCell className="text-muted-foreground">
            {applicant.topic}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {applicant.submitted}
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={applicant.status} />
          </ProjectTableCell>
          <ProjectTableCell>
            <TableActions>
              <button
                type="button"
                className="rounded-full border border-border bg-card px-[13px] py-[7px] text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                onClick={() => onReview(applicant.id)}
              >
                Review
              </button>
            </TableActions>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </PeopleTable>
  );
}
