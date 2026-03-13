import { API_BASE_URL } from './sections';

export interface CreateTagResponse {
  success: boolean;
  tagId?: string;
  error?: string;
}

export const createTag = async (formData: FormData): Promise<CreateTagResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
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
    return { success: true, tagId: data.tagId };
  } catch (error: any) {
    console.error('Error creating tag:', error);
    return { success: false, error: error.message || 'Network error occurred while creating tag' };
  }
};
