import type {
  Category,
  CategoryDeleteResponse,
  CategoryListParams,
  CategoryListResponse,
  CategoryMutationResponse,
  CreateCategoryBody,
  UpdateCategoryBody,
} from '@/models/categories/categories-model';
import { baseService } from '@/services/core/base-service';
import {
  CATEGORIES_URL,
  CATEGORY_DETAIL_URL,
} from '@/utils/constants/api-end-points';

export const categoriesService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryListResponse, CategoryListParams | void>({
      query: (params) => ({
        url: CATEGORIES_URL,
        method: 'GET',
        params: {
          search: params?.search,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'categories' as const, id })),
              { type: 'categories' as const, id: 'LIST' },
            ]
          : [{ type: 'categories' as const, id: 'LIST' }],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => ({ url: CATEGORY_DETAIL_URL(id), method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'categories', id }],
    }),
    createCategory: builder.mutation<CategoryMutationResponse, CreateCategoryBody>({
      query: (body) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['categories', 'concepts'],
    }),
    updateCategory: builder.mutation<
      CategoryMutationResponse,
      { id: string; body: UpdateCategoryBody }
    >({
      query: ({ id, body }) => ({
        url: CATEGORY_DETAIL_URL(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['categories', 'concepts'],
    }),
    deleteCategory: builder.mutation<CategoryDeleteResponse, string>({
      query: (id) => ({
        url: CATEGORY_DETAIL_URL(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['categories', 'concepts'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useLazyGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesService;