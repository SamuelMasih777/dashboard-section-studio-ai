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
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: ApiError = {
      success: false,
      message: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
      statusCode: response.status,
    };
    throw error;
  }

  return data as T;
}
