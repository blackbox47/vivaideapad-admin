import { useMemo } from 'react';

import type {
  ContentSubmission,
  ReviewStatusFilter,
} from '@/models/content-review/content-review-model';
import {
  useDecideSubmissionMutation,
  useGetReviewQueueQuery,
} from '@/services/content-review/content-review-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseContentReviewParams {
  status: ReviewStatusFilter;
  search: string;
}

interface UseContentReviewResult {
  submissions: ContentSubmission[];
  filtered: ContentSubmission[];
  totalCount: number;
  awaitingCount: number;
  highRiskCount: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  decideSubmission: ReturnType<typeof useDecideSubmissionMutation>[0];
  isDeciding: boolean;
}

function matchesFilter(
  submission: ContentSubmission,
  status: ReviewStatusFilter,
  search: string,
): boolean {
  const matchesStatus = status === 'all' || submission.status === status;
  const query = search.trim().toLowerCase();
  const matchesSearch =
    query.length === 0 ||
    submission.title.toLowerCase().includes(query) ||
    submission.contributor.toLowerCase().includes(query) ||
    submission.topic.toLowerCase().includes(query);

  return matchesStatus && matchesSearch;
}

export default function useContentReview({
  status,
  search,
}: UseContentReviewParams): UseContentReviewResult {
  const { data, isLoading, isError, error, refetch } = useGetReviewQueueQuery();
  const [decideSubmission, { isLoading: isDeciding }] =
    useDecideSubmissionMutation();

  const submissions = data?.submissions ?? [];

  const filtered = useMemo(
    () =>
      submissions.filter((submission) =>
        matchesFilter(submission, status, search),
      ),
    [submissions, status, search],
  );

  return {
    submissions,
    filtered,
    totalCount: submissions.length,
    awaitingCount: submissions.filter((item) => item.status === 'Under Review')
      .length,
    highRiskCount: submissions.filter((item) => item.risk === 'High').length,
    isLoading: isLoading && !data,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    decideSubmission,
    isDeciding,
  };
}
