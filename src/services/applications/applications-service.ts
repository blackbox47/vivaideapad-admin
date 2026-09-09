import type { Applicant } from '@/models/people/people-model';
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
      providesTags: (_r, _e, id) => [{ type: 'applications', id }],
    }),
    decideApplication: builder.mutation<
      ApplicationDetailResponse,
      { id: string; body: ApplicationDecisionBody }
    >({
      query: ({ id, body }) => ({
        url: APPLICATION_DECISION_URL(id),
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'applications',
        'people',
        'users',
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