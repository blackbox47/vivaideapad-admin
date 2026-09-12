import type {
  AiRisk,
  ContentSubmission,
  DecideSubmissionBody,
  PublishResponse,
  RiskScanResponse,
  RiskSignal,
  ReviewQueueResponse,
  SubmissionAttachmentFile,
  SubmissionDecisionBody,
  SubmissionDecisionResponse,
  SubmissionDetail,
  SubmissionStatus,
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
      transformResponse: (response: unknown): { submission: SubmissionDetail } => {
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid submission response');
        }
        const res = response as Record<string, unknown>;
        const raw = ((res.submission ?? res.data ?? res) || {}) as Record<string, unknown>;

        const conceptObj = (raw.concept && typeof raw.concept === 'object'
          ? raw.concept
          : null) as Record<string, unknown> | null;
        const contributorObj = (raw.contributor && typeof raw.contributor === 'object'
          ? raw.contributor
          : null) as Record<string, unknown> | null;
        const riskSignalObj = (raw.risk_signal && typeof raw.risk_signal === 'object'
          ? raw.risk_signal
          : null) as Record<string, unknown> | null;

        let attachments: SubmissionAttachmentFile[] = [];
        if (Array.isArray(raw.attachments)) {
          attachments = raw.attachments as SubmissionAttachmentFile[];
        } else if (raw.attachments && typeof raw.attachments === 'object') {
          const att = raw.attachments as Record<string, unknown>;
          if (att.url) {
            attachments = [
              {
                name: String(att.original_name ?? att.name ?? 'attachment'),
                url: String(att.url),
                size: att.size ? String(att.size) : undefined,
                type: att.mime_type ? String(att.mime_type) : undefined,
              },
            ];
          }
        } else if (raw.attachment_url) {
          attachments = [
            {
              name: 'supporting-evidence',
              url: String(raw.attachment_url),
            },
          ];
        }

        const mapRisk = (r: unknown): AiRisk => {
          if (r === 'High' || r === 'Medium' || r === 'Low') return r;
          if (r === 'high') return 'High';
          if (r === 'medium') return 'Medium';
          if (r === 'low') return 'Low';
          return 'Medium';
        };

        const mapStatus = (s: unknown): SubmissionStatus => {
          if (
            s === 'Under Review' ||
            s === 'Revision Requested' ||
            s === 'Approved' ||
            s === 'Published' ||
            s === 'Rejected'
          ) {
            return s;
          }
          if (s === 'pending_review') return 'Under Review';
          if (s === 'changes_requested') return 'Revision Requested';
          if (s === 'approved') return 'Approved';
          if (s === 'rejected') return 'Rejected';
          if (s === 'published') return 'Published';
          return 'Under Review';
        };

        const submission: SubmissionDetail = {
          id: String(raw.id ?? ''),
          title: String(raw.title ?? ''),
          contributor: String(
            contributorObj?.name ??
              raw.contributor_name ??
              raw.contributor ??
              'Anonymous',
          ),
          topic: String(
            conceptObj?.title ??
              raw.topic_title ??
              raw.topic ??
              'Untitled Concept',
          ),
          submitted: String(
            raw.created_at ??
              raw.submittedDate ??
              raw.submitted ??
              new Date().toISOString(),
          ),
          risk: mapRisk(raw.risk ?? riskSignalObj?.risk ?? riskSignalObj?.level),
          status: mapStatus(raw.status),
          body: String(raw.body ?? ''),
          approvedCount: Number(
            contributorObj?.approved_count ??
              raw.approved_count ??
              raw.approvedCount ??
              0,
          ),
          approvalRate: String(
            contributorObj?.approval_rate ??
              raw.approval_rate ??
              raw.approvalRate ??
              '0%',
          ),
          summary: String(raw.summary ?? ''),
          version: typeof raw.version === 'number' ? raw.version : 1,
          feedback: raw.decision_notes
            ? String(raw.decision_notes)
            : raw.feedback
              ? String(raw.feedback)
              : undefined,
          risk_signal: (riskSignalObj as unknown as RiskSignal) || undefined,
          attachment_url: raw.attachment_url
            ? String(raw.attachment_url)
            : (attachments[0]?.url ?? undefined),
          attachments,
          concept: conceptObj
            ? {
                id: String(conceptObj.id ?? ''),
                title: String(conceptObj.title ?? ''),
                brief: String(conceptObj.brief ?? ''),
                rewardBudget:
                  conceptObj.reward_budget != null
                    ? String(conceptObj.reward_budget)
                    : conceptObj.rewardBudget != null
                      ? String(conceptObj.rewardBudget)
                      : undefined,
                status: String(conceptObj.status ?? 'active'),
                closeDate: conceptObj.close_date
                  ? String(conceptObj.close_date)
                  : conceptObj.closeDate
                    ? String(conceptObj.closeDate)
                    : null,
              }
            : null,
          topicDetail: conceptObj
            ? {
                id: String(conceptObj.id ?? ''),
                title: String(conceptObj.title ?? ''),
                brief: String(conceptObj.brief ?? ''),
                rewardBudget:
                  conceptObj.reward_budget != null
                    ? String(conceptObj.reward_budget)
                    : conceptObj.rewardBudget != null
                      ? String(conceptObj.rewardBudget)
                      : undefined,
                status: String(conceptObj.status ?? 'active'),
                closeDate: conceptObj.close_date
                  ? String(conceptObj.close_date)
                  : conceptObj.closeDate
                    ? String(conceptObj.closeDate)
                    : null,
              }
            : null,
          contributorDetail: contributorObj
            ? {
                id: String(contributorObj.id ?? ''),
                name: String(contributorObj.name ?? ''),
                email: String(contributorObj.email ?? ''),
                avatarUrl: contributorObj.avatar_url
                  ? String(contributorObj.avatar_url)
                  : null,
                approvedCount: Number(contributorObj.approved_count ?? 0),
                approvalRate: String(contributorObj.approval_rate ?? '0%'),
              }
            : null,
          contributorName: String(
            contributorObj?.name ??
              raw.contributor_name ??
              raw.contributor ??
              '',
          ),
          contributorAvatar: contributorObj?.avatar_url
            ? String(contributorObj.avatar_url)
            : null,
        };

        return { submission };
      },
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
