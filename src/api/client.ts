/// <reference types="vite/client" />

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
console.log(API_BASE_URL);

/**
 * Returns the stored JWT token from localStorage.
 */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Standard shape for all API error responses.
 */
export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}

/**
 * A thin wrapper around fetch that:
 *  1. Prepends the API_BASE_URL.
 *  2. Attaches the JWT `Authorization` header when a token exists.
 *  3. Normalises error responses into a consistent shape.
 *
 * For requests that send JSON, pass `json` instead of `body`.
 * For multipart requests (FormData), pass `body` directly — the
 * browser will set the correct Content-Type automatically.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    json?: unknown;       // will be JSON.stringified
    body?: BodyInit;      // raw body (FormData, etc.)
    headers?: Record<string, string>;
    auth?: boolean;       // default true — set false for public routes
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    json,
    body,
    headers: extraHeaders = {},
    auth = true,
  } = options;

  const headers: Record<string, string> = { ...extraHeaders };

  // Attach JWT when available and auth is requested
  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // If we're sending JSON, set the content-type and serialise
  let requestBody: BodyInit | undefined = body;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(json);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: requestBody,
  });

  // Try to parse body as JSON regardless of status
  let data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: ApiError = {
      success: false,
      message: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
      statusCode: response.status,
    };
    throw error;
  }

  // Normalize backend response structure
  // If backend returns { status: 200, data: ... } we ensure success: true is present
  if (typeof data === 'object' && data !== null) {
    if (data.status >= 200 && data.status < 300 && data.success === undefined) {
      data.success = true;
    } else if (data.success === undefined) {
      // Fallback for responses that don't have success but were response.ok
      data.success = true;
    }

    // Helper to recursively normalize data (e.g., convert numeric strings to numbers)
    const normalizeData = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(normalizeData);
      } else if (obj !== null && typeof obj === 'object') {
        const normalized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          // Convert 'price' and 'compareAtPrice' strings to numbers
          if ((key === 'price' || key === 'compareAtPrice' || key === 'discount') && typeof value === 'string') {
            const num = parseFloat(value);
            normalized[key] = isNaN(num) ? value : num;
            // If it was meant to be cents but backend sent decimal string (e.g. "900.00"), 
            // and frontend logic expects cents (e.g. bundle.price / 100), 
            // we might need to adjust. If "900.00" is actually $900, but code does /100, 
            // it becomes 9. 
            // Looking at the JSON: "price": "900.00". 
            // The code does: ${(bundle.price / 100).toFixed(2)}. 
            // If price 900.00 means $9, then 900.00/100 = 9 (correct).
            // If price 900.00 means $900, then 900.00/100 = 9 ($9) which is wrong.
            // Usually price in DB is stored in cents as integer. 
          } else {
            normalized[key] = normalizeData(value);
          }
        }
        return normalized;
      }
      return obj;
    };

    if (data.data) {
      data.data = normalizeData(data.data);
    }
  }

  return data as T;
}
