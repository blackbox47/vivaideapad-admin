import StatusBadge from '@/components/shared/status-badge';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import type { ContentSubmission } from '@/models/content-review/content-review-model';

interface ReviewTableProps {
  submissions: ContentSubmission[];
  onReview: (id: string) => void;
}

export default function ReviewTable({ submissions, onReview }: ReviewTableProps) {
  return (
    <ProjectTable
      columns={[
        { label: 'Submission' },
        { label: 'Topic' },
        { label: 'Submitted' },
        { label: 'AI risk' },
        { label: 'Status' },
        { isAction: true },
      ]}
    >
      {submissions.map((submission) => (
        <ProjectTableRow key={submission.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">
              {submission.title}
            </strong>
            <div className="text-[11px] text-[#687773]">
              {submission.contributor}
            </div>
          </ProjectTableCell>
          <ProjectTableCell className="text-[#687773]">
            {submission.topic}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-[#687773]">
            {submission.submitted}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <StatusBadge status={submission.risk} />
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <StatusBadge status={submission.status} />
          </ProjectTableCell>
          <ProjectTableCell>
            <button
              type="button"
              className="rounded-full bg-[#12231f] px-3.5 py-2 text-xs font-bold whitespace-nowrap text-white hover:bg-[#254b40]"
              onClick={() => onReview(submission.id)}
            >
              Review
            </button>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}