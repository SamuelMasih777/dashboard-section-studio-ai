import { apiRequest, API_BASE_URL } from './client';
import type { Category } from '../lib/types';

// ─── Types ───────────────────────────────────────────────

export interface CategoriesListResponse {
  success: boolean;
  data: Category[];
  error?: string;
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

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/categories/ — Retrieve all categories. Requires Auth.
 */
export const getCategories = async (): Promise<CategoriesListResponse> => {
  try {
    return await apiRequest<CategoriesListResponse>('/categories');
  } catch (error: any) {
    return { success: false, data: [], error: error.message || 'Failed to fetch categories' };
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
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, categoryId: data.categoryId };
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
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/categories/${handle}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, categoryId: data.categoryId };
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
    return await apiRequest<{ success: boolean }>(`/categories/${handle}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete category' };
  }
};
