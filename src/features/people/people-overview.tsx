import { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';

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
import { toast } from '@/components/ui/sonner';
import ApplicantReviewPanel from '@/features/people/applicant-review-panel';
import ApplicantsTable from '@/features/people/applicants-table';
import ContributorsTable from '@/features/people/contributors-table';
import PeopleTabs from '@/features/people/people-tabs';
import usePeople from '@/hooks/people/use-people';
import type {
  Applicant,
  ApplicantStatus,
  PeopleTab,
  PlatformUser,
} from '@/models/people/people-model';
import { useGetApplicationQuery } from '@/services/applications/applications-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

const TABS: PeopleTab[] = [
  'applicants',
  'invited',
  'rejected',
  'contributors',
];

const PENDING_APPLICANT_STATUSES = new Set<ApplicantStatus>([
  'Submitted',
  'Under Review',
]);

function parseTab(value: string | null): PeopleTab {
  if (value && TABS.includes(value as PeopleTab)) {
    return value as PeopleTab;
  }

  return 'applicants';
}

function mergeApplicant(
  listRow: Applicant | undefined,
  detail: Applicant,
): Applicant {
  if (!listRow) {
    return detail;
  }

  return {
    ...listRow,
    ...detail,
    name: detail.name.trim() || listRow.name,
    email: detail.email.trim() || listRow.email,
    topic:
      detail.topic && detail.topic !== 'Uncategorized'
        ? detail.topic
        : listRow.topic,
    title: detail.title.trim() || listRow.title,
    body: detail.body.trim() || listRow.body,
    source: detail.source || listRow.source,
    consent: detail.consent ?? listRow.consent,
    decisionNotes: detail.decisionNotes ?? listRow.decisionNotes,
    referenceNumber: detail.referenceNumber || listRow.referenceNumber,
  };
}

export default function PeopleOverview() {
  const [searchParams] = useTanstackSearchParams();
  const tab = parseTab(searchParams.get('tab'));
  const [reviewId, setReviewId] = useState<string | null>(null);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    decideApplicant,
    toggleUserStatus,
    isDeciding,
    isToggling,
  } = usePeople();

  const applicants = data?.applicants ?? [];
  const users = data?.users ?? [];
  const pendingApplicants = useMemo(
    () =>
      applicants.filter((applicant) =>
        PENDING_APPLICANT_STATUSES.has(applicant.status),
      ),
    [applicants],
  );
  const rejectedApplicants = useMemo(
    () => applicants.filter((applicant) => applicant.status === 'Rejected'),
    [applicants],
  );
  const contributorUsers = useMemo(
    () =>
      users.filter(
        (user) => user.status === 'Active' || user.status === 'Suspended',
      ),
    [users],
  );
  const contributorEmails = useMemo(
    () =>
      new Set(
        contributorUsers.map((user) => user.email.trim().toLowerCase()),
      ),
    [contributorUsers],
  );
  const invitedApplicants = useMemo(
    () =>
      applicants.filter(
        (applicant) =>
          applicant.status === 'Approved' &&
          !contributorEmails.has(applicant.email.trim().toLowerCase()),
      ),
    [applicants, contributorEmails],
  );
  const reviewingListRow = applicants.find(
    (applicant) => applicant.id === reviewId,
  );
  const { data: detailData, isLoading: isLoadingDetail } =
    useGetApplicationQuery(reviewId ?? '', {
      skip: !reviewId,
    });
  const reviewing: Applicant | undefined = reviewId
    ? detailData?.application?.id === reviewId
      ? mergeApplicant(reviewingListRow, detailData.application)
      : reviewingListRow
    : undefined;
  const isPendingReview =
    reviewing != null && PENDING_APPLICANT_STATUSES.has(reviewing.status);

  const handleToggle = (user: PlatformUser) => {
    const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    void toggleUserStatus({
      id: user.id,
      status: nextStatus,
    })
      .unwrap()
      .then(() => {
        toast.success(`User marked as ${nextStatus.toLowerCase()}`);
      })
      .catch(() => {
        toast.error('Failed to update user status');
      });
  };

  const handleDecide = (status: ApplicantStatus, comment: string) => {
    if (!reviewId) {
      return;
    }

    void decideApplicant({ id: reviewId, status, comment })
      .unwrap()
      .then(() => {
        setReviewId(null);
        toast.success(`Application marked as ${status.toLowerCase()}`);
      })
      .catch((err: unknown) => {
        toast.error(
          getApiErrorMessage(err) ?? 'Failed to record application decision',
        );
      });
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load people
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
        title="Applicants & users"
        description="Review new applicants and manage contributor access."
      />

      {isLoading ? (
        <div className="overflow-hidden rounded-[18px] border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <PeopleTabs
            tab={tab}
            applicantCount={pendingApplicants.length}
            invitedCount={invitedApplicants.length}
            rejectedCount={rejectedApplicants.length}
            contributorCount={contributorUsers.length}
          />

          {tab === 'invited' ? (
            <ApplicantsTable
              applicants={invitedApplicants}
              onReview={setReviewId}
              actionLabel="View"
              emptyTitle="No invited applicants"
              emptyDescription="Approved applicants appear here until they become active contributors."
            />
          ) : tab === 'rejected' ? (
            <ApplicantsTable
              applicants={rejectedApplicants}
              onReview={setReviewId}
              actionLabel="View"
              emptyTitle="No rejected applicants"
              emptyDescription="Rejected applications will appear here."
            />
          ) : tab === 'contributors' ? (
            <ContributorsTable
              users={contributorUsers}
              onToggle={handleToggle}
              isToggling={isToggling}
            />
          ) : (
            <ApplicantsTable
              applicants={pendingApplicants}
              onReview={setReviewId}
              emptyTitle="No applicants in review"
              emptyDescription="Applications that are under review appear here."
            />
          )}
        </>
      )}

      {reviewing ? (
        <ApplicantReviewPanel
          key={reviewing.id}
          applicant={reviewing}
          isDeciding={isDeciding}
          isLoadingDetails={Boolean(reviewId) && isLoadingDetail}
          readOnly={!isPendingReview}
          onClose={() => setReviewId(null)}
          onDecide={handleDecide}
        />
      ) : null}
    </div>
  );
}
