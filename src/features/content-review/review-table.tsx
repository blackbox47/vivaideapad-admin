import StatusBadge from '@/components/shared/status-badge';
import TableActions from '@/components/shared/table-actions';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
  type TablePaginationProps,
} from '@/components/ui/project-table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ContentSubmission } from '@/models/content-review/content-review-model';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';

interface ReviewTableProps {
  submissions: ContentSubmission[];
  pagination?: TablePaginationProps;
  onView: (id: string) => void;
  onReview: (id: string) => void;
}

const TITLE_MAX_CHARS = 20;

const TITLE_COL_CLASS =
  'w-[9.5rem] max-w-[9.5rem] whitespace-normal md:w-[14rem] md:max-w-[14rem] lg:w-[18rem] lg:max-w-[18rem] xl:w-[22rem] xl:max-w-[22rem]';

function truncateWithEllipsis(value: string, maxChars: number): string {
  if (value.length <= maxChars) {
    return value;
  }
  return `${value.slice(0, maxChars)}…`;
}

function canReviewSubmission(status: ContentSubmission['status']): boolean {
  return status !== 'Approved' && status !== 'Rejected';
}

export default function ReviewTable({
  submissions,
  pagination,
  onView,
  onReview,
}: ReviewTableProps) {
  return (
    <ProjectTable
      pagination={pagination}
      columns={[
        { label: 'Title', headerClassName: TITLE_COL_CLASS },
        { label: 'Topic' },
        { label: 'Submitted' },
        { label: 'AI risk' },
        { label: 'Status' },
        { isAction: true },
      ]}
    >
      {submissions.map((submission) => (
        <ProjectTableRow key={submission.id}>
          <ProjectTableCell className={TITLE_COL_CLASS}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="block min-w-0 cursor-default outline-none" />
                }
              >
                <strong className="block font-semibold text-foreground">
                  {truncateWithEllipsis(submission.title, TITLE_MAX_CHARS)}
                </strong>
                <div className="truncate text-[11px] text-muted-foreground">
                  {submission.contributor}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs whitespace-normal text-left">
                {submission.title}
              </TooltipContent>
            </Tooltip>
          </ProjectTableCell>
          <ProjectTableCell className="text-muted-foreground">
            {submission.topic}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {formatDisplayDate(submission.submitted)}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <StatusBadge status={submission.risk} />
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <StatusBadge status={submission.status} />
          </ProjectTableCell>
          <ProjectTableCell>
            <TableActions
              items={[
                {
                  key: 'view',
                  label: 'View',
                  onClick: () => onView(submission.id),
                },
                ...(canReviewSubmission(submission.status)
                  ? [
                      {
                        key: 'review',
                        label: 'Review',
                        onClick: () => onReview(submission.id),
                      },
                    ]
                  : []),
              ]}
            />
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}