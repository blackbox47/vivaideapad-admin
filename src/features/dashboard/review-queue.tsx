import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import EmptyState from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import ReviewTable from '@/features/content-review/review-table';
import SubmissionReviewPanel from '@/features/content-review/submission-review-panel';
import useContentReview from '@/hooks/content-review/use-content-review';
import { useGetSubmissionQuery } from '@/services/content-review/content-review-service';
import type {
  RevisionWindowDays,
  SubmissionStatus,
} from '@/models/content-review/content-review-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const DASHBOARD_REVIEW_ROWS = 6;

export default function ReviewQueue() {
  const [panelId, setPanelId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<'view' | 'review'>('review');

  const {
    submissions,
    filtered,
    isLoading,
    decideSubmission,
    isDeciding,
  } = useContentReview({ status: 'all', search: '' });

  const rows = filtered.slice(0, DASHBOARD_REVIEW_ROWS);

  const openSubmission = submissions.find((item) => item.id === panelId);
  const { data: detailData, isLoading: isLoadingDetail } =
    useGetSubmissionQuery(panelId ?? '', {
      skip: !panelId,
    });

  const activeSubmission = panelId
    ? (detailData?.submission ?? openSubmission)
    : undefined;

  const handleDecide = (
    nextStatus: SubmissionStatus,
    comment: string,
    options?: { revisionWindowDays?: RevisionWindowDays },
  ) => {
    if (!panelId) {
      return;
    }

    void decideSubmission({
      id: panelId,
      status: nextStatus,
      comment,
      ...(nextStatus === 'Revision Requested'
        ? {
            revision_window_days: options?.revisionWindowDays ?? 7,
          }
        : {}),
    })
      .unwrap()
      .then(() => {
        setPanelId(null);
        toast.success(`Submission marked as ${nextStatus.toLowerCase()}`);
      })
      .catch(() => {
        toast.error('Failed to update submission decision');
      });
  };

  return (
    <section className="rounded-[20px] border border-border bg-card p-[22px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Review queue
        </h2>
        <Button
          render={<Link to={ADMIN_ROUTES.contentReview} />}
          variant="outline"
          className="h-auto rounded-full border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors"
        >
          View all
        </Button>
      </div>

      {isLoading ? (
        <div className="overflow-hidden rounded-[18px]">
          {Array.from({ length: DASHBOARD_REVIEW_ROWS }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          card={false}
          size="sm"
          title="Queue is clear"
          description="No submissions currently require review."
        />
      ) : (
        <ReviewTable
          submissions={rows}
          className="border-0"
          pinColumns={false}
          minWidth="min-w-full"
          compact
          onView={(id) => {
            setPanelMode('view');
            setPanelId(id);
          }}
          onReview={(id) => {
            setPanelMode('review');
            setPanelId(id);
          }}
        />
      )}

      {activeSubmission ? (
        <SubmissionReviewPanel
          submission={activeSubmission}
          isDeciding={isDeciding}
          isLoadingDetails={isLoadingDetail}
          readOnly={panelMode === 'view'}
          onClose={() => setPanelId(null)}
          onDecide={handleDecide}
        />
      ) : null}
    </section>
  );
}
