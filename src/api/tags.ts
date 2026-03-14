import { apiRequest, API_BASE_URL } from './client';
import type { Tag } from '../lib/types';

// ─── Types ───────────────────────────────────────────────

export interface TagsListResponse {
  success: boolean;
  data: Tag[];
  error?: string;
}

export interface TagDetailResponse {
  success: boolean;
  data?: Tag;
  error?: string;
}

export interface CreateTagResponse {
  success: boolean;
  tagId?: string;
  error?: string;
}

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/tags/ — Retrieve all tags. Requires Auth.
 */
export const getTags = async (): Promise<TagsListResponse> => {
  try {
    return await apiRequest<TagsListResponse>('/tags');
  } catch (error: any) {
    return { success: false, data: [], error: error.message || 'Failed to fetch tags' };
  }
};

/**
 * GET /api/tags/:handle — Retrieve a specific tag. Requires Auth.
 */
export const getTagByHandle = async (
  handle: string
): Promise<TagDetailResponse> => {
  try {
    return await apiRequest<TagDetailResponse>(`/tags/${handle}`);
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch tag' };
  }
};

/**
 * POST /api/tags/ — Create a new tag. Admin Only.
 * Uses FormData for optional image uploads.
 */
export const createTag = async (
  formData: FormData
): Promise<CreateTagResponse> => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/tags`, {
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
    return { success: true, tagId: data.tagId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create tag' };
  }
};

/**
 * PUT /api/tags/:handle — Update an existing tag. Admin Only.
 */
export const updateTag = async (
  handle: string,
  formData: FormData
): Promise<CreateTagResponse> => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/tags/${handle}`, {
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
    return { success: true, tagId: data.tagId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update tag' };
  }
};

/**
 * DELETE /api/tags/:handle — Delete a tag. Admin Only.
 */
export const deleteTag = async (
  handle: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    return await apiRequest<{ success: boolean }>(`/tags/${handle}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete tag' };
  }
};
