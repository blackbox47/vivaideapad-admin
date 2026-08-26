import type {
  DecideSubmissionBody,
  ReviewQueueResponse,
} from '@/models/content-review/content-review-model';
import { baseService } from '@/services/core/base-service';
import { REVIEW_QUEUE_URL } from '@/utils/constants/api-end-points';

export const contentReviewService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getReviewQueue: builder.query<ReviewQueueResponse, void>({
      query: () => ({
        url: REVIEW_QUEUE_URL,
        method: 'GET',
      }),
      providesTags: ['review'],
    }),
    decideSubmission: builder.mutation<
      ReviewQueueResponse,
      DecideSubmissionBody
    >({
      query: (body) => ({
        url: REVIEW_QUEUE_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['review', 'dashboard'],
    }),
  }),
});

export const { useGetReviewQueueQuery, useDecideSubmissionMutation } =
  contentReviewService;
