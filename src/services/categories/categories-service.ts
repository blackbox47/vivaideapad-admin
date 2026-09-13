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
      transformResponse: (response: unknown): CategoryListResponse => {
        if (!response || typeof response !== 'object') {
          return { data: [], meta: { page: 1, limit: 20, totalItems: 0, totalPages: 1 } };
        }
        const res = response as Record<string, unknown>;
        const rawList = Array.isArray(res.data)
          ? (res.data as Record<string, unknown>[])
          : Array.isArray(res.categories)
            ? (res.categories as Record<string, unknown>[])
            : [];

        const data: Category[] = rawList.map((item) => ({
          id: String(item.id),
          name: String(item.name ?? ''),
          icon: String(item.icon || '✦'),
          isActive:
            item.isActive !== undefined
              ? Boolean(item.isActive)
              : item.is_active === 'active',
          slug: item.slug ? String(item.slug) : undefined,
          createdAt: typeof item.created_at === 'string' ? item.created_at : typeof item.createdAt === 'string' ? item.createdAt : undefined,
          updatedAt: typeof item.updated_at === 'string' ? item.updated_at : typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        }));

        const metaRaw = (res.meta ?? {}) as Record<string, unknown>;
        const totalItems =
          typeof metaRaw.totalItems === 'number'
            ? metaRaw.totalItems
            : typeof metaRaw.total === 'number'
              ? metaRaw.total
              : typeof res.total === 'number'
                ? res.total
                : data.length;
        const page = typeof metaRaw.page === 'number' ? metaRaw.page : 1;
        const limit = typeof metaRaw.limit === 'number' ? metaRaw.limit : 20;
        const totalPages =
          typeof metaRaw.totalPages === 'number'
            ? metaRaw.totalPages
            : typeof metaRaw.total_pages === 'number'
              ? metaRaw.total_pages
              : Math.max(1, Math.ceil(totalItems / limit));

        return {
          data,
          meta: { page, limit, totalItems, totalPages },
        };
      },
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
      transformResponse: (response: unknown): Category => {
        const item = (
          response && typeof response === 'object' && 'category' in response
            ? (response as Record<string, unknown>).category
            : response
        ) as Record<string, unknown>;
        return {
          id: String(item.id),
          name: String(item.name ?? ''),
          icon: String(item.icon || '✦'),
          isActive:
            item.isActive !== undefined
              ? Boolean(item.isActive)
              : item.is_active === 'active',
          slug: item.slug ? String(item.slug) : undefined,
          createdAt: typeof item.created_at === 'string' ? item.created_at : typeof item.createdAt === 'string' ? item.createdAt : undefined,
          updatedAt: typeof item.updated_at === 'string' ? item.updated_at : typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        };
      },
      providesTags: (_r, _e, id) => [{ type: 'categories', id }],
    }),
    createCategory: builder.mutation<CategoryMutationResponse, CreateCategoryBody>({
      query: (body) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): CategoryMutationResponse => {
        const item = (
          response && typeof response === 'object' && 'category' in response
            ? (response as Record<string, unknown>).category
            : response
        ) as Record<string, unknown>;
        const category: Category = {
          id: String(item.id),
          name: String(item.name ?? ''),
          icon: String(item.icon || '✦'),
          isActive:
            item.isActive !== undefined
              ? Boolean(item.isActive)
              : item.is_active === 'active',
          slug: item.slug ? String(item.slug) : undefined,
          createdAt: typeof item.created_at === 'string' ? item.created_at : typeof item.createdAt === 'string' ? item.createdAt : undefined,
          updatedAt: typeof item.updated_at === 'string' ? item.updated_at : typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        };
        return {
          category,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        };
      },
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
      transformResponse: (response: unknown): CategoryMutationResponse => {
        const item = (
          response && typeof response === 'object' && 'category' in response
            ? (response as Record<string, unknown>).category
            : response
        ) as Record<string, unknown>;
        const category: Category = {
          id: String(item.id),
          name: String(item.name ?? ''),
          icon: String(item.icon || '✦'),
          isActive:
            item.isActive !== undefined
              ? Boolean(item.isActive)
              : item.is_active === 'active',
          slug: item.slug ? String(item.slug) : undefined,
          createdAt: typeof item.created_at === 'string' ? item.created_at : typeof item.createdAt === 'string' ? item.createdAt : undefined,
          updatedAt: typeof item.updated_at === 'string' ? item.updated_at : typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        };
        return {
          category,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        };
      },
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