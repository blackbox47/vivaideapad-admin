import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import MyIdeasTable from '@/features/creator/my-ideas-table';
import SubmissionViewDialog from '@/features/creator/submission-view-dialog';
import useMyIdeas from '@/hooks/creator/use-my-ideas';
import type { MyIdea } from '@/models/creator/my-ideas-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

const DASHBOARD_SUBMISSION_ROWS = 3;

export default function ContinueCreating() {
  const { data, isLoading } = useMyIdeas({
    status: 'all',
    search: '',
  });
  const [viewedIdea, setViewedIdea] = useState<MyIdea | null>(null);

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-card p-5 shadow-xs sm:rounded-[20px] sm:p-5.5 dark:border-border">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <h2 className="font-heading text-sm font-semibold text-foreground sm:text-lg">
          Continue creating
        </h2>
        <Button
          render={<Link to={CREATOR_ROUTES.submissions} />}
          variant="outline"
          className="h-auto rounded-full border border-slate-200 bg-card px-3 py-1 text-xs font-medium text-foreground hover:bg-surface-subtle sm:px-3.5 sm:py-2 sm:font-bold dark:border-border"
        >
          View all
        </Button>
      </div>

      <MyIdeasTable
        items={data?.ideas ?? []}
        isLoading={isLoading}
        onView={setViewedIdea}
        pageSize={DASHBOARD_SUBMISSION_ROWS}
        showPagination={false}
        loadingRows={DASHBOARD_SUBMISSION_ROWS}
        className="border-0 shadow-none rounded-[14px]"
        pinColumns={false}
        minWidth="min-w-full table-fixed"
        compact
      />

      {viewedIdea ? (
        <SubmissionViewDialog
          idea={viewedIdea}
          onClose={() => setViewedIdea(null)}
        />
      ) : null}
    </section>
  );
}
