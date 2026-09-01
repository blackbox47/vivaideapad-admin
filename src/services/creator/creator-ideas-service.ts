import type {
  CreatorTopic,
  CreatorTopicsResponse,
  OpportunityCategory,
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
      query: (body) => {
        if (body.file) {
          const formData = new FormData();
          formData.append(
            'concept_id',
            body.concept_id || body.topicId || '',
          );
          formData.append('title', body.title);
          formData.append('body', body.body || body.summary || '');
          formData.append('file', body.file);
          return {
            url: CREATOR_IDEAS_SUBMIT_URL,
            method: 'POST',
            body: formData,
          };
        }

        return {
          url: CREATOR_IDEAS_SUBMIT_URL,
          method: 'POST',
          body: {
            concept_id: body.concept_id || body.topicId || '',
            title: body.title,
            body: body.body || body.summary || '',
            attachments: body.attachmentUrl
              ? { url: body.attachmentUrl }
              : undefined,
          },
        };
      },
      transformResponse: (response: unknown): SubmitIdeaResponse => {
        const res = response as Record<string, unknown>;
        if (res && 'idea' in res) {
          return response as SubmitIdeaResponse;
        }
        return {
          idea: {
            id: String(res.id ?? ''),
            title: String(res.title ?? ''),
            topic: String(res.concept_id ?? ''),
            submitted: String(res.created_at ?? new Date().toISOString()).slice(
              0,
              10,
            ),
            status: 'Draft',
            reward: res.reward_amount ? `$${res.reward_amount}` : '$0',
            comments: 0,
            body: String(res.body ?? ''),
            feedback: (res.decision_notes as string) ?? undefined,
          },
          createdAt: String(res.created_at ?? new Date().toISOString()),
        };
      },
      invalidatesTags: ['my-ideas', 'creator-dashboard'],
    }),
    getCreatorTopics: builder.query<CreatorTopicsResponse, void>({
      query: () => ({ url: CREATOR_TOPICS_URL, method: 'GET' }),
      transformResponse: (response: unknown): CreatorTopicsResponse => {
        if (!response || typeof response !== 'object') {
          return { topics: [] };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { topics: [...] }
        if (Array.isArray(res.topics)) {
          return response as CreatorTopicsResponse;
        }

        // 2. Live API paginated format: { data: [...] }
        if (Array.isArray(res.data)) {
          const topics: CreatorTopic[] = res.data.map((item: Record<string, unknown>) => {
            const metadata = (item.metadata as Record<string, unknown>) ?? {};
            return {
              id: String(item.id ?? ''),
              title: String(item.title ?? ''),
              description: String(item.brief ?? item.description ?? ''),
              reward: item.reward_budget ? `$${item.reward_budget}` : String(item.reward ?? '$0'),
              closesOn: item.close_date ? String(item.close_date).slice(0, 10) : String(item.closesOn ?? ''),
              category: String(
                metadata.category_name ?? item.category_name ?? item.category ?? 'Family occasions',
              ) as Exclude<OpportunityCategory, 'All'>,
              icon: String(metadata.icon ?? item.icon ?? '✦'),
              deadline: String(item.deadline ?? 'Active'),
            };
          });

          return { topics };
        }

        return { topics: [] };
      },
      providesTags: ['creator-topics'],
    }),
  }),
});

export const { useSubmitIdeaMutation, useGetCreatorTopicsQuery } =
  creatorIdeasService;