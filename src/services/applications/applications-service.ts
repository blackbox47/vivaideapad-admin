import type {
  Applicant,
  ApplicantAiRisk,
  ApplicantStatus,
} from '@/models/people/people-model';
import type { ApplicationDecisionBody } from '@/models/users/users-model';
import { baseService } from '@/services/core/base-service';
import {
  APPLICATIONS_URL,
  APPLICATION_DECISION_URL,
  APPLICATION_DETAIL_URL,
} from '@/utils/constants/api-end-points';

export interface ApplicationsListParams {
  status?: 'all' | Applicant['status'];
  concept_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApplicationsListResponse {
  data: Applicant[];
  total: number;
}

export interface ApplicationDetailResponse {
  application: Applicant;
  auditHistory?: Array<{
    id: string;
    action: string;
    actor: string;
    at: string;
  }>;
}

function mapApplicantStatus(status: unknown): ApplicantStatus {
  if (
    status === 'Submitted' ||
    status === 'Under Review' ||
    status === 'Revision Requested' ||
    status === 'Approved' ||
    status === 'Rejected'
  ) {
    return status;
  }
  if (status === 'submitted') return 'Under Review';
  if (status === 'approved_invited') return 'Approved';
  if (status === 'rejected' || status === 'withdrawn') return 'Rejected';
  if (status === 'needs_info') return 'Revision Requested';
  return 'Under Review';
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function mapApplicantRisk(risk: unknown): ApplicantAiRisk {
  if (risk === 'Low' || risk === 'Medium' || risk === 'High') {
    return risk;
  }
  if (risk === 'low') return 'Low';
  if (risk === 'medium') return 'Medium';
  if (risk === 'high') return 'High';
  return 'Medium';
}

function mapApplicationDetail(response: unknown): ApplicationDetailResponse {
  const envelope = asRecord(response) ?? {};
  const raw = asRecord(envelope.application) ?? asRecord(envelope.data) ?? envelope;
  const user = asRecord(raw.user);
  const category = asRecord(raw.category);
  const concept = asRecord(raw.concept);

  const name = String(
    raw.name ?? user?.display_name ?? user?.name ?? raw.email ?? '',
  );
  const email = String(raw.email ?? user?.email ?? '');
  const consentValue = raw.consent;
  const topicTitle = String(
    concept?.title ?? raw.topic ?? category?.name ?? 'Uncategorized',
  );
  const topicBrief = concept?.brief
    ? String(concept.brief)
    : category?.description
      ? String(category.description)
      : undefined;
  const closeDate = concept?.close_date ?? concept?.closeDate;

  return {
    application: {
      id: String(raw.id ?? ''),
      name,
      email,
      topic: topicTitle,
      title: String(raw.title ?? raw.idea_title ?? ''),
      body: String(raw.body ?? raw.idea_description ?? ''),
      submitted: String(raw.submitted ?? raw.created_at ?? ''),
      status: mapApplicantStatus(raw.status),
      source: raw.source ? String(raw.source) : undefined,
      consent:
        typeof consentValue === 'boolean'
          ? consentValue
          : consentValue != null
            ? Number(consentValue) === 1
            : undefined,
      decisionNotes: raw.decision_notes
        ? String(raw.decision_notes)
        : raw.decisionNotes
          ? String(raw.decisionNotes)
          : null,
      referenceNumber: raw.reference_number
        ? String(raw.reference_number)
        : raw.referenceNumber
          ? String(raw.referenceNumber)
          : undefined,
      risk: mapApplicantRisk(raw.risk),
      topicDetail: {
        title: topicTitle,
        brief: topicBrief,
        rewardBudget:
          concept?.reward_budget != null
            ? String(concept.reward_budget)
            : concept?.rewardBudget != null
              ? String(concept.rewardBudget)
              : undefined,
        closeDate: closeDate ? String(closeDate) : null,
      },
    },
  };
}

export const applicationsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<
      ApplicationsListResponse,
      ApplicationsListParams | void
    >({
      query: (params) => ({
        url: APPLICATIONS_URL,
        method: 'GET',
        params: {
          status: params?.status,
          concept_id: params?.concept_id,
          search: params?.search,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: ['applications'],
    }),
    getApplication: builder.query<ApplicationDetailResponse, string>({
      query: (id) => ({ url: APPLICATION_DETAIL_URL(id), method: 'GET' }),
      transformResponse: mapApplicationDetail,
      providesTags: (_r, _e, id) => [{ type: 'applications', id }],
    }),
    decideApplication: builder.mutation<
      ApplicationDetailResponse,
      { id: string; body: ApplicationDecisionBody }
    >({
      query: ({ id, body }) => ({
        url: APPLICATION_DECISION_URL(id),
        method: 'POST',
        body: {
          decision: body.decision,
          ...(body.decision === 'approve_invite' || !body.notes
            ? {}
            : { notes: body.notes }),
        },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'applications', id },
        'applications',
        'people',
        'users',
        'dashboard',
        'audit-log',
        'audit-events',
        'admin-notifications',
      ],
    }),
    submitPublicApplication: builder.mutation<
      { reference_number: string; application: unknown },
      {
        display_name: string;
        email: string;
        category_id: string;
        idea_title: string;
        idea_description: string;
        consent: boolean;
        phone?: string;
      }
    >({
      query: (body) => ({
        url: '/public/applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['applications'],
    }),
    getPublicConcepts: builder.query<
      { data: Array<{ id: string; title: string; category_id: string }> },
      void
    >({
      query: () => ({ url: '/public/concepts', method: 'GET' }),
      providesTags: ['concepts'],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useLazyGetApplicationQuery,
  useGetApplicationQuery,
  useDecideApplicationMutation,
  useSubmitPublicApplicationMutation,
  useGetPublicConceptsQuery,
} = applicationsService;