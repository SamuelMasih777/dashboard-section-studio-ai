import { apiRequest, API_BASE_URL } from './client';
import type { Section } from '../lib/types';

// Re-export so existing imports of API_BASE_URL keep working
export { API_BASE_URL };

// ─── Types ───────────────────────────────────────────────

export interface SectionsListResponse {
  success: boolean;
  data: Section[];
  total?: number;
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

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/sections/ — Retrieve all sections (supports search/filtering). Requires Auth.
 */
export const getSections = async (
  filters: SectionFilters = {}
): Promise<SectionsListResponse> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const query = params.toString();
    const endpoint = `/sections${query ? `?${query}` : ''}`;
    return await apiRequest<SectionsListResponse>(endpoint);
  } catch (error: any) {
    return { success: false, data: [], error: error.message || 'Failed to fetch sections' };
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
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/sections`, {
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

    return await response.json();
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
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/sections/${id}`, {
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

    return await response.json();
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
    return await apiRequest<{ success: boolean }>(`/sections/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete section' };
  }
};
