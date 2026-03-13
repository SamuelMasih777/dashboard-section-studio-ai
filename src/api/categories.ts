import { API_BASE_URL } from './sections';

export interface CreateCategoryResponse {
  success: boolean;
  categoryId?: string;
  error?: string;
}

export const createCategory = async (formData: FormData): Promise<CreateCategoryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || `HTTP error! status: ${response.status}` 
      };
    }

    const data = await response.json();
    return { success: true, categoryId: data.categoryId };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message || 'Network error occurred while creating category' };
  }
};
