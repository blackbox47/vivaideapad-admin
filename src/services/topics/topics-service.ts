import type { ConceptListParams, ConceptListResponse } from '@/models/topics/topics-model';
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
  }),
});

export const { useGetConceptsQuery } = topicsService;
