import { useCallback } from 'react';

import type {
  Category,
  CreateCategoryBody,
  UpdateCategoryBody,
} from '@/models/categories/categories-model';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '@/services/categories/categories-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface UseCategoriesResult {
  categories: Category[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  createCategory: (
    body: CreateCategoryBody,
  ) => Promise<Category | null>;
  updateCategory: (
    id: string,
    body: UpdateCategoryBody,
  ) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function useCategories(
  params: UseCategoriesParams = {},
): UseCategoriesResult {
  const { data, isLoading, isError, error, refetch } = useGetCategoriesQuery({
    search: params.search,
    page: params.page,
    limit: params.limit,
  });
  const [createTrigger, createState] = useCreateCategoryMutation();
  const [updateTrigger, updateState] = useUpdateCategoryMutation();
  const [deleteTrigger, deleteState] = useDeleteCategoryMutation();

  const createCategory = useCallback(
    async (body: CreateCategoryBody) => {
      try {
        const result = await createTrigger(body).unwrap();
        return result.category;
      } catch {
        return null;
      }
    },
    [createTrigger],
  );

  const updateCategory = useCallback(
    async (id: string, body: UpdateCategoryBody) => {
      try {
        const result = await updateTrigger({ id, body }).unwrap();
        return result.category;
      } catch {
        return null;
      }
    },
    [updateTrigger],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteTrigger(id).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [deleteTrigger],
  );

  return {
    categories: data?.data ?? [],
    total: data?.meta.totalItems ?? 0,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
  };
}
