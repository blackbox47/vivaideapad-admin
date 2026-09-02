import type {
  CreatorTopic,
  CreatorTopicsResponse,
  OpportunityCategory,
  SubmissionDetail,
  SubmitIdeaBody,
  SubmitIdeaResponse,
} from '@/models/creator/submit-idea-model';
import { baseService } from '@/services/core/base-service';
import {
  CREATOR_IDEA_DETAIL_URL,
  CREATOR_IDEA_SUBMIT_FOR_REVIEW_URL,
  CREATOR_IDEAS_SUBMIT_URL,
  CREATOR_TOPICS_URL,
} from '@/utils/constants/api-end-points';

export const creatorIdeasService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getSubmissionById: builder.query<SubmissionDetail, string>({
      query: (id) => ({
        url: CREATOR_IDEA_DETAIL_URL(id),
        method: 'GET',
      }),
      transformResponse: (response: unknown): SubmissionDetail => {
        const res = (response ?? {}) as Record<string, unknown>;
        const conceptObj =
          res.concept && typeof res.concept === 'object'
            ? (res.concept as Record<string, unknown>)
            : null;
        const attachmentsObj =
          res.attachments && typeof res.attachments === 'object'
            ? (res.attachments as Record<string, unknown>)
            : null;

        return {
          id: String(res.id ?? ''),
          userId: String(res.user_id ?? ''),
          conceptId: String(res.concept_id ?? conceptObj?.id ?? ''),
          conceptTitle: String(
            res.concept_title ?? conceptObj?.title ?? '',
          ),
          title: String(res.title ?? ''),
          summary: String(res.summary ?? ''),
          body: String(res.body ?? ''),
          attachmentUrl:
            (attachmentsObj?.url as string) ||
            (res.attachmentUrl as string) ||
            '',
          attachments: attachmentsObj,
          status: String(res.status ?? 'draft'),
          rewardAmount: res.reward_amount
            ? String(res.reward_amount)
            : undefined,
          decisionNotes: (res.decision_notes as string) ?? undefined,
          createdAt: String(res.created_at ?? ''),
          updatedAt: String(res.updated_at ?? ''),
        };
      },
      providesTags: (_result, _error, id) => [
        { type: 'submissions', id },
        'my-ideas',
      ],
    }),
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
    updateSubmission: builder.mutation<
      SubmitIdeaResponse,
      { id: string; body: SubmitIdeaBody }
    >({
      query: ({ id, body }) => {
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
            url: CREATOR_IDEA_DETAIL_URL(id),
            method: 'PATCH',
            body: formData,
          };
        }

        return {
          url: CREATOR_IDEA_DETAIL_URL(id),
          method: 'PATCH',
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
      invalidatesTags: ['my-ideas', 'creator-dashboard'],
    }),
    submitExistingSubmission: builder.mutation<void, string>({
      query: (id) => ({
        url: CREATOR_IDEA_SUBMIT_FOR_REVIEW_URL(id),
        method: 'POST',
      }),
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

export const {
  useGetSubmissionByIdQuery,
  useSubmitIdeaMutation,
  useUpdateSubmissionMutation,
  useSubmitExistingSubmissionMutation,
  useGetCreatorTopicsQuery,
} = creatorIdeasService;