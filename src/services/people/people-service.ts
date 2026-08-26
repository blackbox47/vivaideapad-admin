import type {
  DecideApplicantBody,
  PeopleResponse,
  ToggleUserBody,
} from '@/models/people/people-model';
import { baseService } from '@/services/core/base-service';
import {
  APPLICANTS_URL,
  PEOPLE_URL,
  USERS_URL,
} from '@/utils/constants/api-end-points';

export const peopleService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getPeople: builder.query<PeopleResponse, void>({
      query: () => ({
        url: PEOPLE_URL,
        method: 'GET',
      }),
      providesTags: ['people'],
    }),
    decideApplicant: builder.mutation<PeopleResponse, DecideApplicantBody>({
      query: (body) => ({
        url: APPLICANTS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['people', 'dashboard'],
    }),
    toggleUserStatus: builder.mutation<PeopleResponse, ToggleUserBody>({
      query: (body) => ({
        url: USERS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['people', 'dashboard'],
    }),
  }),
});

export const {
  useGetPeopleQuery,
  useDecideApplicantMutation,
  useToggleUserStatusMutation,
} = peopleService;
