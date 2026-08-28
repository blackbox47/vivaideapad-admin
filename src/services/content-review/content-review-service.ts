import type {
  ContentSubmission,
  DecideSubmissionBody,
  PublishResponse,
  RiskScanResponse,
  ReviewQueueResponse,
  SubmissionDecisionBody,
  SubmissionDecisionResponse,
  SubmissionDetail,
} from '@/models/content-review/content-review-model';
import { baseService } from '@/services/core/base-service';
import {
  REVIEW_QUEUE_URL,
  SUBMISSION_DECISION_URL,
  SUBMISSION_DETAIL_URL,
  SUBMISSION_PUBLISH_URL,
  SUBMISSION_RISK_SCAN_URL,
  SUBMISSIONS_URL,
} from '@/utils/constants/api-end-points';

export interface SubmissionsListParams {
  status?: string;
  conceptId?: string;
  contributorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const contentReviewService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    /** Legacy endpoint — kept for the live UI. */
    getReviewQueue: builder.query<ReviewQueueResponse, void>({
      query: () => ({
        url: REVIEW_QUEUE_URL,
        method: 'GET',
      }),
      providesTags: ['review'],
    }),
    /** Spec §5.5 — GET /admin/submissions */
    getSubmissions: builder.query<
      { data: ContentSubmission[]; total: number },
      SubmissionsListParams | void
    >({
      query: (params) => ({
        url: SUBMISSIONS_URL,
        method: 'GET',
        params: {
          status: params?.status,
          concept_id: params?.conceptId,
          contributor_id: params?.contributorId,
          search: params?.search,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: ['submissions', 'review'],
    }),
    /** Spec §5.5 — GET /admin/submissions/:id */
    getSubmission: builder.query<{ submission: SubmissionDetail }, string>({
      query: (id) => ({ url: SUBMISSION_DETAIL_URL(id), method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'submissions', id }],
    }),
    /** Legacy mutation — kept for the live UI. */
    decideSubmission: builder.mutation<ReviewQueueResponse, DecideSubmissionBody>({
      query: (body) => ({
        url: REVIEW_QUEUE_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['review', 'dashboard'],
    }),
    /** Spec §5.5 — POST /admin/submissions/:id/decision */
    decideSubmissionSpec: builder.mutation<
      SubmissionDecisionResponse,
      { id: string; body: SubmissionDecisionBody }
    >({
      query: ({ id, body }) => ({
        url: SUBMISSION_DECISION_URL(id),
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'submissions',
        'review',
        'rewards',
        'leaderboard',
        'audit-log',
        'audit-events',
        'admin-notifications',
      ],
    }),
    /** Spec §5.5 — POST /admin/submissions/:id/publish */
    publishSubmission: builder.mutation<PublishResponse, string>({
      query: (id) => ({
        url: SUBMISSION_PUBLISH_URL(id),
        method: 'POST',
      }),
      invalidatesTags: ['submissions', 'review', 'audit-log', 'audit-events'],
    }),
    /** Spec §5.5 — POST /admin/submissions/:id/risk-scan */
    riskScanSubmission: builder.mutation<RiskScanResponse, string>({
      query: (id) => ({
        url: SUBMISSION_RISK_SCAN_URL(id),
        method: 'POST',
      }),
      invalidatesTags: ['submissions', 'review'],
    }),
  }),
});

export const {
  useGetReviewQueueQuery,
  useGetSubmissionsQuery,
  useLazyGetSubmissionQuery,
  useGetSubmissionQuery,
  useDecideSubmissionMutation,
  useDecideSubmissionSpecMutation,
  usePublishSubmissionMutation,
  useRiskScanSubmissionMutation,
} = contentReviewService;
