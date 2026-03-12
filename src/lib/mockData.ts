import { Category, Tag, Section, SectionFile, Bundle } from './types';

export const mockCategories: Category[] = [
{
  handle: 'hero-sections',
  name: 'Hero Sections',
  emoji: '🦸‍♂️',
  description: 'First impressions matter. High-converting hero sections.',
  sortOrder: 1,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'product-grids',
  name: 'Product Grids',
  emoji: '🛍️',
  description: 'Showcase your products beautifully.',
  sortOrder: 2,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'testimonials',
  name: 'Testimonials',
  emoji: '💬',
  description: 'Build trust with customer reviews.',
  sortOrder: 3,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'feature-sections',
  name: 'Feature Sections',
  emoji: '✨',
  description: 'Highlight what makes your product special.',
  sortOrder: 4,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'faq-sections',
  name: 'FAQ Sections',
  emoji: '❓',
  description: 'Answer common questions clearly.',
  sortOrder: 5,
  isActive: true,
  createdAt: new Date().toISOString()
}];


export const mockTags: Tag[] = [
{
  handle: 'new',
  name: 'New',
  emoji: '🆕',
  sortOrder: 1,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'popular',
  name: 'Popular',
  emoji: '🔥',
  sortOrder: 2,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'animated',
  name: 'Animated',
  emoji: '🎬',
  sortOrder: 3,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'responsive',
  name: 'Responsive',
  emoji: '📱',
  sortOrder: 4,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'minimal',
  name: 'Minimal',
  emoji: '⚪',
  sortOrder: 5,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'premium',
  name: 'Premium',
  emoji: '💎',
  sortOrder: 6,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'free',
  name: 'Free',
  emoji: '🆓',
  sortOrder: 7,
  isActive: true,
  createdAt: new Date().toISOString()
},
{
  handle: 'customizable',
  name: 'Customizable',
  emoji: '⚙️',
  sortOrder: 8,
  isActive: true,
  createdAt: new Date().toISOString()
}];


export const mockSections: Section[] = [
{
  id: 'sec_1',
  handle: 'split-screen-hero',
  title: 'Split Screen Hero',
  description:
  'A modern split-screen hero section with image on one side and content on the other.',
  price: 1900, // $19.00
  category: 'hero-sections',
  tags: ['new', 'responsive', 'minimal'],
  thumbnailUrl:
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  previewImages: [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'],

  isFeatured: true,
  isPublished: true,
  sortOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  presetsCount: 3
},
{
  id: 'sec_2',
  handle: 'masonry-product-grid',
  title: 'Masonry Product Grid',
  description:
  'Display products in a beautiful masonry layout that adapts to any screen size.',
  price: 2900,
  compareAtPrice: 3900,
  category: 'product-grids',
  tags: ['popular', 'responsive', 'premium'],
  thumbnailUrl:
  'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80',
  previewImages: [
  'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80'],

  isFeatured: true,
  isPublished: true,
  sortOrder: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  presetsCount: 2
},
{
  id: 'sec_3',
  handle: 'video-background-hero',
  title: 'Video Background Hero',
  description:
  'Grab attention immediately with a full-screen video background hero section.',
  price: 2400,
  category: 'hero-sections',
  tags: ['animated', 'premium'],
  thumbnailUrl:
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
  previewImages: [
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80'],

  isFeatured: false,
  isPublished: true,
  sortOrder: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  presetsCount: 1
},
{
  id: 'sec_4',
  handle: 'scrolling-testimonials',
  title: 'Scrolling Testimonials',
  description: 'An infinite scrolling marquee of customer testimonials.',
  price: 1500,
  category: 'testimonials',
  tags: ['animated', 'popular'],
  thumbnailUrl:
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  previewImages: [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'],

  isFeatured: false,
  isPublished: true,
  sortOrder: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  presetsCount: 4
},
{
  id: 'sec_5',
  handle: 'accordion-faq',
  title: 'Accordion FAQ',
  description: 'Clean, accessible accordion for frequently asked questions.',
  price: 0,
  category: 'faq-sections',
  tags: ['free', 'minimal', 'responsive'],
  thumbnailUrl:
  'https://images.unsplash.com/photo-1507925922893-87310a01429b?w=800&q=80',
  previewImages: [
  'https://images.unsplash.com/photo-1507925922893-87310a01429b?w=800&q=80'],

  isFeatured: false,
  isPublished: true,
  sortOrder: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  presetsCount: 2
}];


export const mockSectionFiles: SectionFile[] = [
{
  id: 'file_1',
  sectionId: 'sec_1',
  filename: 'split-screen-hero.liquid',
  fileType: 'liquid',
  fileUrl: '#',
  fileSize: 4500,
  sortOrder: 1
},
{
  id: 'file_2',
  sectionId: 'sec_1',
  filename: 'split-screen-hero.css',
  fileType: 'css',
  fileUrl: '#',
  fileSize: 1200,
  sortOrder: 2
},
{
  id: 'file_3',
  sectionId: 'sec_1',
  filename: 'split-screen-hero.js',
  fileType: 'js',
  fileUrl: '#',
  fileSize: 800,
  sortOrder: 3
},
{
  id: 'file_4',
  sectionId: 'sec_2',
  filename: 'masonry-grid.liquid',
  fileType: 'liquid',
  fileUrl: '#',
  fileSize: 6200,
  sortOrder: 1
},
{
  id: 'file_5',
  sectionId: 'sec_2',
  filename: 'masonry-grid.css',
  fileType: 'css',
  fileUrl: '#',
  fileSize: 2100,
  sortOrder: 2
}];


export const mockBundles: Bundle[] = [
{
  id: 'bun_1',
  handle: 'essential-store-starter',
  title: 'Essential Store Starter',
  description:
  'Everything you need to launch a beautiful, high-converting store.',
  price: 4900,
  discount: 25,
  thumbnailUrl:
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sectionIds: ['sec_1', 'sec_2', 'sec_5']
},
{
  id: 'bun_2',
  handle: 'conversion-booster',
  title: 'Conversion Booster Pack',
  description:
  'Sections specifically designed to increase trust and drive sales.',
  price: 3900,
  discount: 20,
  thumbnailUrl:
  'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&q=80',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sectionIds: ['sec_3', 'sec_4']
}];