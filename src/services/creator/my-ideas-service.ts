import type {
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
          status: params.status,
          search: params.search,
        },
      }),
      providesTags: ['my-ideas'],
    }),
  }),
});

export const { useGetMyIdeasQuery } = myIdeasService;