import { apiRequest, API_BASE_URL } from './client';
import type { Section, PaginationInfo } from '../lib/types';

// Re-export so existing imports of API_BASE_URL keep working
export { API_BASE_URL };

// ─── Types ───────────────────────────────────────────────

export interface SectionsListResponse {
  success: boolean;
  data: Section[];
  pagination: PaginationInfo;
  error?: string;
}

export interface SectionDetailResponse {
  success: boolean;
  data?: Section;
  error?: string;
}

export interface CreateSectionResponse {
  success: boolean;
  sectionId?: string;
  error?: string;
}

export interface SectionFilters {
  search?: string;
  category?: string;
  tag?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

// ─── Cache ────────────────────────────────────────────────
let sectionsMetadataCache: SectionsListResponse | null = null;
export const clearSectionsCache = () => { sectionsMetadataCache = null; };

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/sections/ — Retrieve all sections (supports search/filtering). Requires Auth.
 */
export const getSections = async (
  filters: SectionFilters = {}
): Promise<SectionsListResponse> => {
  // Simple cache for metadata fetch (all sections for counts/selection)
  const isMetadataFetch = !filters.search && !filters.page && filters.limit === 1000;
  if (isMetadataFetch && sectionsMetadataCache) {
    return sectionsMetadataCache;
  }

  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const query = params.toString();
    const endpoint = `/sections${query ? `?${query}` : ''}`;
    const res = await apiRequest<SectionsListResponse>(endpoint);

    if (res.success && isMetadataFetch) {
      sectionsMetadataCache = res;
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
      error: error.message || 'Failed to fetch sections' 
    };
  }
};

/**
 * GET /api/sections/:id — Retrieve a specific section by UUID. Requires Auth.
 */
export const getSectionById = async (
  id: string
): Promise<SectionDetailResponse> => {
  try {
    return await apiRequest<SectionDetailResponse>(`/sections/${id}`);
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch section' };
  }
};

/**
 * POST /api/sections/ — Create a new section. Admin Only.
 * Sends multipart/form-data (files + fields).
 */
export const createSection = async (
  formData: FormData
): Promise<CreateSectionResponse> => {
  try {
    const res = await apiRequest<CreateSectionResponse>('/sections', {
      method: 'POST',
      body: formData,
    });
    if (res.success) clearSectionsCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create section' };
  }
};

/**
 * PUT /api/sections/:id — Update an existing section. Admin Only.
 * Sends multipart/form-data (files + fields).
 */
export const updateSection = async (
  id: string,
  formData: FormData
): Promise<CreateSectionResponse> => {
  try {
    const res = await apiRequest<CreateSectionResponse>(`/sections/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.success) clearSectionsCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update section' };
  }
};

/**
 * DELETE /api/sections/:id — Delete a section. Admin Only.
 */
export const deleteSection = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await apiRequest<{ success: boolean }>(`/sections/${id}`, {
      method: 'DELETE',
    });
    if (res.success) clearSectionsCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete section' };
  }
};
