import { apiRequest, API_BASE_URL } from './client';
import type { Bundle } from '../lib/types';

// ─── Types ───────────────────────────────────────────────

export interface BundlesListResponse {
  success: boolean;
  data: Bundle[];
  error?: string;
}

export interface BundleDetailResponse {
  success: boolean;
  data?: Bundle;
  error?: string;
}

export interface CreateBundleResponse {
  success: boolean;
  bundleId?: string;
  error?: string;
}

export interface CreateBundlePayload {
  handle: string;
  title: string;
  description?: string;
  price: number;
  discount?: number;
  isActive?: boolean;
  sectionIds: string[];       // bundle items
  thumbnail?: File;
}

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/bundles/ — Retrieve all bundles. Requires Auth.
 */
export const getBundles = async (): Promise<BundlesListResponse> => {
  try {
    return await apiRequest<BundlesListResponse>('/bundles');
  } catch (error: any) {
    return { success: false, data: [], error: error.message || 'Failed to fetch bundles' };
  }
};

/**
 * GET /api/bundles/:id — Retrieve a specific bundle by UUID. Requires Auth.
 */
export const getBundleById = async (
  id: string
): Promise<BundleDetailResponse> => {
  try {
    return await apiRequest<BundleDetailResponse>(`/bundles/${id}`);
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch bundle' };
  }
};

/**
 * POST /api/bundles/ — Create a new bundle (and attach items). Admin Only.
 */
export const createBundle = async (
  formData: FormData
): Promise<CreateBundleResponse> => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/bundles`, {
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
    return { success: true, bundleId: data.bundleId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create bundle' };
  }
};

/**
 * PUT /api/bundles/:id — Update an existing bundle. Admin Only.
 */
export const updateBundle = async (
  id: string,
  formData: FormData
): Promise<CreateBundleResponse> => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/bundles/${id}`, {
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
    return { success: true, bundleId: data.bundleId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update bundle' };
  }
};

/**
 * DELETE /api/bundles/:id — Delete a bundle. Admin Only.
 */
export const deleteBundle = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    return await apiRequest<{ success: boolean }>(`/bundles/${id}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete bundle' };
  }
};
