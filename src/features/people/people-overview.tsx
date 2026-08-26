import { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

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
import ApplicantReviewPanel from '@/features/people/applicant-review-panel';
import ApplicantsTable from '@/features/people/applicants-table';
import ContributorsTable from '@/features/people/contributors-table';
import InvitedTable from '@/features/people/invited-table';
import PeopleTabs from '@/features/people/people-tabs';
import usePeople from '@/hooks/people/use-people';
import type {
  ApplicantStatus,
  PeopleTab,
  PlatformUser,
} from '@/models/people/people-model';

const TABS: PeopleTab[] = ['applicants', 'invited', 'contributors'];

function parseTab(value: string | null): PeopleTab {
  if (value && TABS.includes(value as PeopleTab)) {
    return value as PeopleTab;
  }

  return 'applicants';
}

export default function PeopleOverview() {
  const [searchParams] = useSearchParams();
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
  const invitedUsers = useMemo(
    () => users.filter((user) => !user.hasLiveSubmission),
    [users],
  );
  const contributorUsers = useMemo(
    () => users.filter((user) => user.hasLiveSubmission),
    [users],
  );
  const reviewing = applicants.find((applicant) => applicant.id === reviewId);

  const handleToggle = (user: PlatformUser) => {
    void toggleUserStatus({
      id: user.id,
      status: user.status === 'Suspended' ? 'Active' : 'Suspended',
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
      })
      .catch(() => {
        // Error stays on the panel; the mutation hook surfaces it next fetch.
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
        title="Applicants & contributors"
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
            applicantCount={applicants.length}
            invitedCount={invitedUsers.length}
            contributorCount={contributorUsers.length}
          />

          {tab === 'invited' ? (
            <InvitedTable
              users={invitedUsers}
              onToggle={handleToggle}
              isToggling={isToggling}
            />
          ) : tab === 'contributors' ? (
            <ContributorsTable
              users={contributorUsers}
              onToggle={handleToggle}
              isToggling={isToggling}
            />
          ) : (
            <ApplicantsTable applicants={applicants} onReview={setReviewId} />
          )}
        </>
      )}

      {reviewing ? (
        <ApplicantReviewPanel
          applicant={reviewing}
          isDeciding={isDeciding}
          onClose={() => setReviewId(null)}
          onDecide={handleDecide}
        />
      ) : null}
    </div>
  );
}
