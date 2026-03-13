import { API_BASE_URL } from './sections';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'Connection failed' };
  }
};

export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, error: error.message || 'Connection failed' };
  }
};
