import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';
import useResetStateOnChange from '@/hooks/ui/use-reset-state-on-change';

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
import ReviewFilters, {
  parseReviewStatus,
} from '@/features/content-review/review-filters';
import ReviewKpiCards from '@/features/content-review/review-kpi-cards';
import ReviewTable from '@/features/content-review/review-table';
import SubmissionReviewPanel from '@/features/content-review/submission-review-panel';
import useContentReview from '@/hooks/content-review/use-content-review';
import type { SubmissionStatus } from '@/models/content-review/content-review-model';
import { DEFAULT_PAGE_SIZE as PAGE_SIZE } from '@/utils/constants/pagination';

export default function ContentReviewOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const status = parseReviewStatus(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useResetStateOnChange(PAGE_SIZE, [
    status,
    search,
  ]);
  const [reviewId, setReviewId] = useState<string | null>(null);

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

  const reviewing = submissions.find((item) => item.id === reviewId);
  const visible = filtered.slice(0, visibleCount);
  const remainingCount = Math.max(0, filtered.length - visibleCount);

  const handleDecide = (nextStatus: SubmissionStatus, comment: string) => {
    if (!reviewId) {
      return;
    }

    void decideSubmission({ id: reviewId, status: nextStatus, comment })
      .unwrap()
      .then(() => {
        setReviewId(null);
      })
      .catch(() => undefined);
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
    <div>
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
        <div className="rounded-[22px] border border-border bg-card px-6 py-15 text-center text-muted-foreground">
          <span className="mb-2.5 block text-[28px]">◇</span>
          <strong className="mb-1 block text-foreground">
            No submissions match
          </strong>
          <span className="text-[13px]">
            Try a different keyword or status filter.
          </span>
        </div>
      ) : (
        <>
          <ReviewTable submissions={visible} onReview={setReviewId} />
          {remainingCount > 0 ? (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="h-auto rounded-full border-border bg-card px-6.5 py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more submissions · {remainingCount} remaining
              </Button>
            </div>
          ) : null}
        </>
      )}

      {reviewing ? (
        <SubmissionReviewPanel
          submission={reviewing}
          isDeciding={isDeciding}
          onClose={() => setReviewId(null)}
          onDecide={handleDecide}
        />
      ) : null}
    </div>
  );
}
