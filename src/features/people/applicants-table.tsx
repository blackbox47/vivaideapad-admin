import EmptyState from '@/components/shared/empty-state';
import StatusBadge from '@/components/shared/status-badge';
import {
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import PeopleTable from '@/features/people/people-table';
import type { Applicant } from '@/models/people/people-model';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';

interface ApplicantsTableProps {
  applicants: Applicant[];
  onReview: (id: string) => void;
}

const COLUMNS = [
  'Applicant',
  'Topic',
  'Submitted',
  'Status',
  { label: 'Action', align: 'right' as const },
];

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
    <PeopleTable columns={COLUMNS}>
      {applicants.map((applicant) => (
        <ProjectTableRow key={applicant.id}>
          <ProjectTableCell>
            <div className="font-bold text-foreground text-sm">
              {applicant.name}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {applicant.title}
            </div>
          </ProjectTableCell>
          <ProjectTableCell className="font-medium text-foreground/80 whitespace-nowrap">
            {applicant.topic}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
            {formatDisplayDate(applicant.submitted)}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <StatusBadge status={applicant.status} />
          </ProjectTableCell>
          <ProjectTableCell align="right" className="whitespace-nowrap">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-surface-subtle active:scale-95 transition-all cursor-pointer"
              onClick={() => onReview(applicant.id)}
            >
              Review
            </button>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </PeopleTable>
  );
}
