import type {
  ConceptListParams,
  ConceptListResponse,
  CreateConceptBody,
  CreateConceptResponse,
} from '@/models/topics/topics-model';
import { baseService } from '@/services/core/base-service';
import { CONCEPTS_URL } from '@/utils/constants/api-end-points';

export const topicsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getConcepts: builder.query<ConceptListResponse, ConceptListParams | void>({
      query: (params) => ({
        url: CONCEPTS_URL,
        method: 'GET',
        params: {
          status: params?.status,
          search: params?.search,
        },
      }),
      providesTags: ['concepts'],
    }),
    createConcept: builder.mutation<CreateConceptResponse, CreateConceptBody>({
      query: (body) => ({
        url: CONCEPTS_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['concepts'],
    }),
  }),
});

export const { useGetConceptsQuery, useCreateConceptMutation } = topicsService;
