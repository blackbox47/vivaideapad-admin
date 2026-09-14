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
  PUBLIC_APPLICATIONS_URL,
  PUBLIC_CONCEPTS_URL,
  PUBLIC_VERIFY_EMAIL_APPLICATION_URL,
  PUBLIC_VERIFY_EMAIL_URL,
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

export interface VerifyEmailTokenResponse {
  email: string;
  display_name: string | null;
  access_status: string;
  application_status: string | null;
}

export interface VerifyEmailApplicationBody {
  token: string;
  concept_id: string;
  idea_title: string;
  idea_summary?: string;
  idea_description: string;
  consent: boolean;
}

export interface VerifyEmailApplicationResponse {
  reference_number: string;
  application: unknown;
}

export interface PublicConceptItem {
  id: string;
  title: string;
  category_id: string;
  brief?: string;
  reward_budget?: string;
  close_date?: string | null;
  is_onboarding?: boolean;
}

export interface PublicConceptsParams {
  isOnboarding?: boolean;
  page?: number;
  limit?: number;
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
  const raw =
    asRecord(envelope.application) ?? asRecord(envelope.data) ?? envelope;
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

function mapVerifyEmailToken(response: unknown): VerifyEmailTokenResponse {
  const raw = asRecord(response) ?? {};
  return {
    email: String(raw.email ?? ''),
    display_name:
      raw.display_name == null && raw.displayName == null
        ? null
        : String(raw.display_name ?? raw.displayName),
    access_status: String(raw.access_status ?? raw.accessStatus ?? ''),
    application_status:
      raw.application_status == null && raw.applicationStatus == null
        ? null
        : String(raw.application_status ?? raw.applicationStatus),
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
        url: PUBLIC_APPLICATIONS_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['applications'],
    }),
    validateVerifyEmailToken: builder.query<VerifyEmailTokenResponse, string>({
      query: (token) => ({
        url: PUBLIC_VERIFY_EMAIL_URL,
        method: 'GET',
        params: { token },
      }),
      transformResponse: mapVerifyEmailToken,
    }),
    submitVerifyEmailApplication: builder.mutation<
      VerifyEmailApplicationResponse,
      VerifyEmailApplicationBody
    >({
      query: (body) => ({
        url: PUBLIC_VERIFY_EMAIL_APPLICATION_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['applications'],
    }),
    getPublicConcepts: builder.query<
      { data: PublicConceptItem[] },
      PublicConceptsParams | void
    >({
      query: (params) => ({
        url: PUBLIC_CONCEPTS_URL,
        method: 'GET',
        params: {
          is_onboarding:
            params?.isOnboarding === undefined
              ? undefined
              : params.isOnboarding
                ? 'true'
                : 'false',
          page: params?.page,
          limit: params?.limit ?? 50,
        },
      }),
      transformResponse: (response: unknown): { data: PublicConceptItem[] } => {
        const envelope = asRecord(response) ?? {};
        const rows = Array.isArray(envelope.data) ? envelope.data : [];
        const data: PublicConceptItem[] = [];
        for (const item of rows) {
          const row = asRecord(item);
          if (!row) continue;
          const categoryId = String(row.category_id ?? row.categoryId ?? '');
          const id = String(row.id ?? '');
          if (!id || !categoryId) continue;
          data.push({
            id,
            title: String(row.title ?? 'Untitled topic'),
            category_id: categoryId,
            brief: row.brief != null ? String(row.brief) : undefined,
            reward_budget:
              row.reward_budget != null
                ? String(row.reward_budget)
                : row.rewardBudget != null
                  ? String(row.rewardBudget)
                  : undefined,
            close_date:
              row.close_date != null
                ? String(row.close_date)
                : row.closeDate != null
                  ? String(row.closeDate)
                  : null,
            is_onboarding: Boolean(
              row.is_onboarding ?? row.isOnboarding ?? false,
            ),
          });
        }
        return { data };
      },
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
  useValidateVerifyEmailTokenQuery,
  useSubmitVerifyEmailApplicationMutation,
  useGetPublicConceptsQuery,
} = applicationsService;
