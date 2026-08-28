import type { Paginated } from '@/utils/helpers/api-pagination';

export interface Category {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type CategoryListResponse = Paginated<Category>;

export interface CreateCategoryBody {
  name: string;
  icon: string;
  isActive?: boolean;
}

export interface UpdateCategoryBody {
  name?: string;
  icon?: string;
  isActive?: boolean;
}

export interface CategoryMutationResponse {
  category: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDeleteResponse {
  id: string;
  deletedAt: string;
}

export const CATEGORY_ICON_CHOICES = [
  '✦',
  '✎',
  '⚑',
  '☾',
  '✺',
  '⚐',
  '◇',
  '★',
  '✿',
  '⬢',
] as const;
export type CategoryIcon = (typeof CATEGORY_ICON_CHOICES)[number];