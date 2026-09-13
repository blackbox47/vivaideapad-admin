import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';
import usePagination from '@/hooks/ui/use-pagination';
import ReviewFilters, {
  parseReviewStatus,
} from '@/features/content-review/review-filters';
import ReviewKpiCards from '@/features/content-review/review-kpi-cards';
import ReviewTable from '@/features/content-review/review-table';
import SubmissionReviewPanel from '@/features/content-review/submission-review-panel';
import useContentReview from '@/hooks/content-review/use-content-review';
import { useGetSubmissionQuery } from '@/services/content-review/content-review-service';
import type {
  RevisionWindowDays,
  SubmissionStatus,
} from '@/models/content-review/content-review-model';
import { toast } from '@/components/ui/sonner';
import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/empty-state';

export default function ContentReviewOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const status = parseReviewStatus(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';
  const [panelId, setPanelId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<'view' | 'review'>('review');

  const {
    submissions,
    filtered,
    totalCount,
    awaitingCount,
    highRiskCount,
    isLoading,
    isError,
    error,
    refetch,
    decideSubmission,
    isDeciding,
  } = useContentReview({ status, search });

  const setSearch = (next: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (next.trim().length === 0) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', next);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const openSubmission = submissions.find((item) => item.id === panelId);

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetSubmissionQuery(panelId ?? '', {
      skip: !panelId,
    });

  // RTK Query keeps the last `data` while a query is skipped, so the panel has
  // to key off `panelId` or it never unmounts on close.
  const activeSubmission = panelId
    ? (detailData?.submission ?? openSubmission)
    : undefined;

  const { paginatedItems, paginationProps } = usePagination({
    items: filtered,
    initialPageSize: 6,
  });

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

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load submissions
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div
        className={
          activeSubmission
            ? 'filter blur-[2px] pointer-events-none select-none transition-all duration-300'
            : 'transition-all duration-300'
        }
        aria-hidden={activeSubmission ? 'true' : undefined}
      >
        <PageHeader
          title="Content review"
          description="Evaluate live concept submissions with context, history and originality signals."
        />

        <ReviewKpiCards
          isLoading={isLoading}
          items={[
            { id: 'total', label: 'Total submissions', value: totalCount },
            { id: 'awaiting', label: 'Awaiting review', value: awaitingCount },
            {
              id: 'high-risk',
              label: 'High AI-risk flags',
              value: highRiskCount,
              tone: 'danger',
            },
          ]}
        />

        {isLoading ? null : (
          <ReviewFilters
            status={status}
            search={search}
            visibleCount={filtered.length}
            onSearchChange={setSearch}
          />
        )}

        {isLoading ? (
          <div className="overflow-hidden rounded-[18px] border border-border bg-card p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="mb-2 h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No submissions match"
            description="Try a different keyword or status filter."
          />
        ) : (
          <ReviewTable
            submissions={paginatedItems}
            pagination={paginationProps}
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
      </div>

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
    </div>
  );
}
