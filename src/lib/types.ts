export interface Category {
  handle: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Tag {
  handle: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Section {
  id: string;
  handle: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  previewImages: string[];
  previewVideoUrl?: string;
  demoUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  compareAtPrice?: number;
  presetsCount: number;
}

export interface SectionFile {
  id: string;
  sectionId: string;
  filename: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number;
  sortOrder: number;
}

export interface Bundle {
  id: string;
  handle: string;
  title: string;
  description?: string;
  price: number;
  discount: number;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sectionIds: string[];
}