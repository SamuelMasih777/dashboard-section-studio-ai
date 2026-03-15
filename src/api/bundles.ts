import { apiRequest } from './client';
import { Bundle, PaginationInfo } from '../lib/types';

// ─── Types ───────────────────────────────────────────────

export interface BundlesListResponse {
  success: boolean;
  data: Bundle[];
  pagination: PaginationInfo;
  error?: string;
}

export interface BundleFilters {
  search?: string;
  page?: number;
  limit?: number;
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

// ─── Cache ────────────────────────────────────────────────
let bundlesCache: BundlesListResponse | null = null;
export const clearBundlesCache = () => { bundlesCache = null; };

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/bundles/ — Retrieve all bundles. Requires Auth.
 */
export const getBundles = async (
  filters: BundleFilters = {}
): Promise<BundlesListResponse> => {
  // Simple cache for default listing (unfiltered)
  const isDefaultFetch = !filters.search && !filters.page && (!filters.limit || filters.limit === 1000);
  if (isDefaultFetch && bundlesCache) {
    return bundlesCache;
  }

  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const query = params.toString();
    const endpoint = `/bundles${query ? `?${query}` : ''}`;
    const res = await apiRequest<BundlesListResponse>(endpoint);

    if (res.success && isDefaultFetch) {
      bundlesCache = res;
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
      error: error.message || 'Failed to fetch bundles' 
    };
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
    const res = await apiRequest<CreateBundleResponse>('/bundles', {
      method: 'POST',
      body: formData,
    });
    if (res.success) clearBundlesCache();
    return res;
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
    const res = await apiRequest<CreateBundleResponse>(`/bundles/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.success) clearBundlesCache();
    return res;
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
    const res = await apiRequest<{ success: boolean }>(`/bundles/${id}`, {
      method: 'DELETE',
    });
    if (res.success) clearBundlesCache();
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete bundle' };
  }
};
