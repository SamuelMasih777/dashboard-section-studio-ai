import { apiRequest } from './client';

// ─── Types ───────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role?: string;
  isSuperAdmin?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Normalise the raw backend response into our AuthResponse shape.
 *
 * Backend shape:
 * { status: 200, data: { token: "...", user: { id, email, role, display_name, isSuperAdmin } }, message: "" }
 */
function normalizeAuthResponse(raw: any): AuthResponse {
  const userData = raw.data?.user || raw.user || null;
  const token: string | undefined =
    raw.data?.token || raw.token || raw.accessToken;

  let user: User | undefined;
  if (userData) {
    const displayName: string = userData.display_name || userData.displayName || userData.name || '';
    user = {
      id: userData.id,
      email: userData.email,
      name: displayName,
      role: userData.role,
      isSuperAdmin: userData.isSuperAdmin || false,
      initials: displayName
        .split(' ')
        .map((w: string) => w[0])
        .filter(Boolean)
        .join('')
        .toUpperCase()
        .slice(0, 2) || userData.email?.[0]?.toUpperCase() || '?',
    };
  }

  // Persist the JWT so future requests can use it
  if (token) {
    localStorage.setItem('token', token);
  }

  return {
    success: true,
    user,
    token,
  };
}

/**
 * POST /api/auth/signup — Register a new user (Public).
 * Sends `displayName` so the backend stores the user's real name.
 */
export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const raw = await apiRequest<any>('/auth/signup', {
      method: 'POST',
      json: { displayName: name, email, password },
      auth: false,
    });
    return normalizeAuthResponse(raw);
  } catch (error: any) {
    return { success: false, error: error.message || 'Signup failed' };
  }
};

/**
 * POST /api/auth/login — Authenticate a user and receive a JWT (Public).
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const raw = await apiRequest<any>('/auth/login', {
      method: 'POST',
      json: { email, password },
      auth: false,
    });
    return normalizeAuthResponse(raw);
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

/**
 * GET /api/auth/me — Retrieve the current user's profile (Requires Auth).
 */
export const getMe = async (): Promise<AuthResponse> => {
  try {
    return await apiRequest<AuthResponse>('/auth/me');
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch profile' };
  }
};

/**
 * PATCH /api/auth/profile — Update the current user's profile (Requires Auth).
 */
export const updateProfile = async (
  payload: ProfileUpdatePayload
): Promise<AuthResponse> => {
  try {
    return await apiRequest<AuthResponse>('/auth/profile', {
      method: 'PATCH',
      json: payload,
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update profile' };
  }
};
