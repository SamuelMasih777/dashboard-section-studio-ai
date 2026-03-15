import { apiRequest } from './client';

// ─── Types ───────────────────────────────────────────────

export interface StatsSummary {
  totalSections: number;
  totalCategories: number;
  totalTags: number;
  totalBundles: number;
}

export interface RecentSection {
  id: string;
  title: string;
  thumbnailUrl?: string;
  category: string;
  price: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface TopCategory {
  handle: string;
  name: string;
  emoji: string;
  sectionCount: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  totalPurchases: number;
  monthlyPurchases: number;
}

export interface TopPurchasedItem {
  id: string;
  title: string;
  type: 'section' | 'bundle';
  revenue: number;
  quantity: number;
}

export interface ContentGrowthPoint {
  date: string;
  count: number;
}

export interface PopularTag {
  handle: string;
  name: string;
  emoji: string;
  associationCount: number;
}

export interface PurchasePayload {
  shopifyOrderId: string;
  items: Array<{
    itemId: string;
    itemType: 'section' | 'bundle';
    quantity: number;
    price: number;
  }>;
}

// ─── Generic response wrappers ──────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Endpoints ───────────────────────────────────────────

/**
 * GET /api/stats/summary — Total counts for Sections, Categories, Tags, Bundles. Admin Only.
 */
export const getStatsSummary = async (): Promise<ApiResponse<StatsSummary>> => {
  try {
    return await apiRequest<ApiResponse<StatsSummary>>('/stats/summary');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch stats summary' };
  }
};

/**
 * GET /api/stats/recent-sections — 5 most recently updated sections. Admin Only.
 */
export const getRecentSections = async (): Promise<ApiResponse<RecentSection[]>> => {
  try {
    return await apiRequest<ApiResponse<RecentSection[]>>('/stats/recent-sections');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch recent sections' };
  }
};

/**
 * GET /api/stats/top-categories — Categories ranked by section count. Admin Only.
 */
export const getTopCategories = async (): Promise<ApiResponse<TopCategory[]>> => {
  try {
    return await apiRequest<ApiResponse<TopCategory[]>>('/stats/top-categories');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch top categories' };
  }
};

/**
 * GET /api/stats/revenue-summary — Total/monthly revenue and purchase counts. Admin Only.
 */
export const getRevenueSummary = async (): Promise<ApiResponse<RevenueSummary>> => {
  try {
    return await apiRequest<ApiResponse<RevenueSummary>>('/stats/revenue-summary');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch revenue summary' };
  }
};

/**
 * GET /api/stats/top-purchased — Sections/bundles ranked by revenue/quantity. Admin Only.
 */
export const getTopPurchased = async (): Promise<ApiResponse<TopPurchasedItem[]>> => {
  try {
    return await apiRequest<ApiResponse<TopPurchasedItem[]>>('/stats/top-purchased');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch top purchased' };
  }
};

/**
 * GET /api/stats/content-growth — Historical section count over last 30 days. Admin Only.
 */
export const getContentGrowth = async (): Promise<ApiResponse<ContentGrowthPoint[]>> => {
  try {
    return await apiRequest<ApiResponse<ContentGrowthPoint[]>>('/stats/content-growth');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch content growth' };
  }
};

/**
 * GET /api/stats/popular-tags — Tags ranked by association count. Admin Only.
 */
export const getPopularTags = async (): Promise<ApiResponse<PopularTag[]>> => {
  try {
    return await apiRequest<ApiResponse<PopularTag[]>>('/stats/popular-tags');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch popular tags' };
  }
};

/**
 * POST /api/stats/purchase — Record a new verified Shopify purchase. Requires Auth.
 */
export const recordPurchase = async (
  payload: PurchasePayload
): Promise<ApiResponse<{ purchaseId: string }>> => {
  try {
    return await apiRequest<ApiResponse<{ purchaseId: string }>>('/stats/purchase', {
      method: 'POST',
      json: payload,
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record purchase' };
  }
};
