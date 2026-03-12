/// <reference types="vite/client" />

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CreateSectionResponse {
  success: boolean;
  sectionId?: string;
  error?: string;
}

export const createSection = async (formData: FormData): Promise<CreateSectionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sections`, {
      method: 'POST',
      body: formData, // the browser automatically sets the correct multipart/form-data headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create section:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
