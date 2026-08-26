import type { CreatorUser } from '@/models/creator/creator-user-model';
import { baseService } from '@/services/core/base-service';
import { CREATOR_ME_URL } from '@/utils/constants/api-end-points';

export const creatorAuthService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentCreator: builder.query<CreatorUser, void>({
      query: () => ({ url: CREATOR_ME_URL, method: 'GET' }),
      providesTags: ['creator-user'],
    }),
  }),
});

export const { useGetCurrentCreatorQuery } = creatorAuthService;
