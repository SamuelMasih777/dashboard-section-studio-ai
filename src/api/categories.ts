import { apiRequest } from './client';
import type { Category, PaginationInfo } from '../lib/types';

// ─── Types ───────────────────────────────────────────────

export interface CategoriesListResponse {
  success: boolean;
  data: Category[];
  pagination: PaginationInfo;
  error?: string;
}

export interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CategoryDetailResponse {
  success: boolean;
  data?: Category;
  error?: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  categoryId?: string;
  error?: string;
}

// ─── Cache ────────────────────────────────────────────────
let categoriesCache: CategoriesListResponse | null = null;
export const clearCategoriesCache = () => { categoriesCache = null; };

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/categories/ — Retrieve all categories. Requires Auth.
 */
export const getCategories = async (
  filters: CategoryFilters = {}
): Promise<CategoriesListResponse> => {
  // Simple cache for default listing (unfiltered)
  const isDefaultFetch = !filters.search && !filters.page && (!filters.limit || filters.limit === 1000);
  if (isDefaultFetch && categoriesCache) {
    return categoriesCache;
  }

  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const query = params.toString();
    const endpoint = `/categories${query ? `?${query}` : ''}`;
    const res = await apiRequest<CategoriesListResponse>(endpoint);
    
    if (res.success && isDefaultFetch) {
      categoriesCache = res;
    }
    
    return res;
  } catch (error: any) {
    return { 
      success: false, 
      data: [], 
      pagination: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
      }, 
      error: error.message || 'Failed to fetch categories' 
    };
  }
};

/**
 * GET /api/categories/:handle — Retrieve a specific category. Requires Auth.
 */
export const getCategoryByHandle = async (
  handle: string
): Promise<CategoryDetailResponse> => {
  try {
    return await apiRequest<CategoryDetailResponse>(`/categories/${handle}`);
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch category' };
  }
};

/**
 * POST /api/categories/ — Create a new category. Admin Only.
 * Uses FormData for optional image uploads.
 */
export const createCategory = async (
  formData: FormData
): Promise<CreateCategoryResponse> => {
  try {
    const res = await apiRequest<CreateCategoryResponse>('/categories', {
      method: 'POST',
      body: formData,
    });
    if (res.success) clearCategoriesCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create category' };
  }
};

/**
 * PUT /api/categories/:handle — Update an existing category. Admin Only.
 */
export const updateCategory = async (
  handle: string,
  formData: FormData
): Promise<CreateCategoryResponse> => {
  try {
    const res = await apiRequest<CreateCategoryResponse>(`/categories/${handle}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.success) clearCategoriesCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update category' };
  }
};

/**
 * DELETE /api/categories/:handle — Delete a category. Admin Only.
 */
export const deleteCategory = async (
  handle: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await apiRequest<{ success: boolean }>(`/categories/${handle}`, {
      method: 'DELETE',
    });
    if (res.success) clearCategoriesCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete category' };
  }
};
