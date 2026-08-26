import type {
  CreatorTopicsResponse,
  SubmitIdeaBody,
  SubmitIdeaResponse,
} from '@/models/creator/submit-idea-model';
import { baseService } from '@/services/core/base-service';
import {
  CREATOR_IDEAS_SUBMIT_URL,
  CREATOR_TOPICS_URL,
} from '@/utils/constants/api-end-points';

export const creatorIdeasService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    submitIdea: builder.mutation<SubmitIdeaResponse, SubmitIdeaBody>({
      query: (body) => ({
        url: CREATOR_IDEAS_SUBMIT_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['my-ideas', 'creator-dashboard'],
    }),
    getCreatorTopics: builder.query<CreatorTopicsResponse, void>({
      query: () => ({ url: CREATOR_TOPICS_URL, method: 'GET' }),
      providesTags: ['creator-topics'],
    }),
  }),
});

export const { useSubmitIdeaMutation, useGetCreatorTopicsQuery } =
  creatorIdeasService;