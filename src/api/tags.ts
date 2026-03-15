import { apiRequest } from './client';
import type { Tag, PaginationInfo } from '../lib/types';

// ─── Types ───────────────────────────────────────────────

export interface TagsListResponse {
  success: boolean;
  data: Tag[];
  pagination: PaginationInfo;
  error?: string;
}

export interface TagFilters {
  search?: string;
  page?: number;
  limit?: number;
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

// ─── Cache ────────────────────────────────────────────────
let tagsCache: TagsListResponse | null = null;
export const clearTagsCache = () => { tagsCache = null; };

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/tags/ — Retrieve all tags. Requires Auth.
 */
export const getTags = async (
  filters: TagFilters = {}
): Promise<TagsListResponse> => {
  // Simple cache for default listing (unfiltered)
  const isDefaultFetch = !filters.search && !filters.page && (!filters.limit || filters.limit === 1000);
  if (isDefaultFetch && tagsCache) {
    return tagsCache;
  }

  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const query = params.toString();
    const endpoint = `/tags${query ? `?${query}` : ''}`;
    const res = await apiRequest<TagsListResponse>(endpoint);

    if (res.success && isDefaultFetch) {
      tagsCache = res;
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
      error: error.message || 'Failed to fetch tags' 
    };
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
    const res = await apiRequest<CreateTagResponse>('/tags', {
      method: 'POST',
      body: formData,
    });
    if (res.success) clearTagsCache();
    return res;
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
    const res = await apiRequest<CreateTagResponse>(`/tags/${handle}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.success) clearTagsCache();
    return res;
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
    const res = await apiRequest<{ success: boolean }>(`/tags/${handle}`, {
      method: 'DELETE',
    });
    if (res.success) clearTagsCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete tag' };
  }
};
