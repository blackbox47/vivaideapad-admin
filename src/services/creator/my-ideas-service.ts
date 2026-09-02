import type {
  MyIdea,
  MyIdeasQueryParams,
  MyIdeasResponse,
} from '@/models/creator/my-ideas-model';
import { baseService } from '@/services/core/base-service';
import { CREATOR_IDEAS_URL } from '@/utils/constants/api-end-points';

export const myIdeasService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getMyIdeas: builder.query<MyIdeasResponse, MyIdeasQueryParams>({
      query: (params) => ({
        url: CREATOR_IDEAS_URL,
        method: 'GET',
        params: {
          status: params.status && params.status !== 'all' ? params.status.toLowerCase().replace(/\s+/g, '_') : undefined,
          search: params.search,
        },
      }),
      transformResponse: (response: unknown): MyIdeasResponse => {
        if (!response || typeof response !== 'object') {
          return { ideas: [], total: 0 };
        }
        const res = response as Record<string, unknown>;
        if (Array.isArray(res.ideas)) {
          const ideas = (res.ideas as Array<Record<string, unknown>>).map((idea) => {
            const conceptTitle =
              (idea.concept_title as string) ||
              (idea.conceptTitle as string) ||
              (idea.topic as string) ||
              '—';
            return {
              ...idea,
              conceptTitle,
              topic: conceptTitle,
            } as MyIdea;
          });
          const total = typeof res.total === 'number' ? res.total : ideas.length;
          return { ideas, total };
        }
        if (Array.isArray(res.data)) {
          const mapStatus = (status: string): MyIdea['status'] => {
            switch (status) {
              case 'pending_review':
                return 'Under Review';
              case 'changes_requested':
                return 'Revision Requested';
              case 'approved':
                return 'Approved';
              case 'rejected':
                return 'Rejected';
              default:
                return 'Draft';
            }
          };
          const ideas = res.data.map((item: Record<string, unknown>) => {
            const conceptObj =
              item.concept && typeof item.concept === 'object'
                ? (item.concept as Record<string, unknown>)
                : null;
            const conceptTitle =
              (item.concept_title as string) ||
              (conceptObj?.title as string) ||
              (item.conceptTitle as string) ||
              '—';
            return {
              id: String(item.id ?? ''),
              title: String(item.title ?? ''),
              conceptTitle,
              topic: conceptTitle,
              submitted: String(item.created_at ?? '').slice(0, 10),
              status: mapStatus(String(item.status ?? 'draft')),
              reward: item.reward_amount ? `$${item.reward_amount}` : '$0',
              comments: 0,
              body: String(item.body ?? ''),
              feedback: (item.decision_notes as string) ?? undefined,
            };
          });
          const total = typeof (res.meta as Record<string, unknown>)?.total === 'number'
            ? ((res.meta as Record<string, unknown>).total as number)
            : ideas.length;
          return { ideas, total };
        }
        return { ideas: [], total: 0 };
      },
      providesTags: ['my-ideas'],
    }),
  }),
});

export const { useGetMyIdeasQuery } = myIdeasService;