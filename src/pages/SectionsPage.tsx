import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  Loader2,
  AlertCircle,
  PackageIcon,
  Tag as TagIcon,
  X,
  FileCode2,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from
'../components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { getSections, deleteSection, createSection, updateSection } from '../api/sections';
import { getCategories } from '../api/categories';
import { Section, Category } from '../lib/types';
import React from 'react';
import { LoadingState } from '../components/ui/LoadingState';
import { Skeleton } from '../components/ui/Skeleton';



export function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Testimonial');
  const [sortOrder, setSortOrder] = useState('0');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState('9');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [presetsCount, setPresetsCount] = useState('1');
  const [demoUrl, setDemoUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Files State
  const [liquidFile, setLiquidFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  
  // Refs
  const liquidInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const previewImagesInputRef = useRef<HTMLInputElement>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [secRes, catRes] = await Promise.all([
        getSections({ 
          search: debouncedSearch,
          page: currentPage,
          limit: pageSize
        }),
        getCategories({ limit: 1000 })
      ]);

      if (secRes.success) {
        setSections(secRes.data);
        setTotalCount(secRes.pagination.totalCount);
      } else {
        setError(secRes.error || 'Failed to fetch sections');
      }

      if (catRes.success) {
        setCategories(catRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, currentPage, pageSize]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleView = (section: Section) => {
    setSelectedSection(section);
    setIsViewModalOpen(true);
  };

  const confirmDelete = (section: Section) => {
    setSectionToDelete(section);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!sectionToDelete) return;

    setIsDeleting(sectionToDelete.id);
    try {
      const res = await deleteSection(sectionToDelete.id);
      if (res.success) {
        await fetchSections();
        setIsConfirmDeleteOpen(false);
      } else {
        alert(res.error || 'Failed to delete section');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete section');
    } finally {
      setIsDeleting(null);
      setSectionToDelete(null);
    }
  };

  const getCategoryName = (handle: string) => {
    return categories.find((c) => c.handle === handle)?.name || handle;
  };

  const handleOpenCreate = () => {
    clearForm();
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (section: Section) => {
    clearForm();
    setSelectedSection(section);
    setIsEditing(true);
    
    // Fill form
    setTitle(section.title);
    setDescription(section.description || '');
    setCategory(section.category);
    setSortOrder(section.sortOrder.toString());
    setTags(section.tags || []);
    setPrice((section.price / 100).toString());
    setCompareAtPrice(section.compareAtPrice ? (section.compareAtPrice / 100).toString() : '');
    setPresetsCount(section.presetsCount.toString());
    setDemoUrl(section.demoUrl || '');
    setPreviewVideoUrl(section.previewVideoUrl || '');
    setIsPublished(section.isPublished);
    setIsFeatured(section.isFeatured);
    
    setIsFormModalOpen(true);
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCategory(categories[0]?.handle || '');
    setSortOrder('0');
    setTagInput('');
    setTags([]);
    setPrice('9');
    setCompareAtPrice('');
    setPresetsCount('1');
    setLiquidFile(null);
    setDemoUrl('');
    setThumbnail(null);
    setPreviewImages([]);
    setPreviewVideoUrl('');
    setIsPublished(true);
    setIsFeatured(false);
    setError(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }

    if (!isEditing && !liquidFile) {
      setError('A .liquid file is required for new sections');
      return;
    }

    if (!isEditing && !thumbnail) {
      setError('A thumbnail image is required for new sections');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', (parseFloat(price) * 100).toString());
      if (compareAtPrice) formData.append('compareAtPrice', (parseFloat(compareAtPrice) * 100).toString());
      formData.append('category', category.toLowerCase());
      formData.append('tags', JSON.stringify(tags));
      formData.append('demoUrl', demoUrl);
      formData.append('isFeatured', isFeatured.toString());
      formData.append('isPublished', isPublished.toString());
      formData.append('presetsCount', presetsCount);
      formData.append('sortOrder', sortOrder);
      if (previewVideoUrl) formData.append('previewVideoUrl', previewVideoUrl);

      if (liquidFile) formData.append('liquidFile', liquidFile);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      previewImages.forEach(file => {
        formData.append('previewImages', file);
      });

      const res = isEditing && selectedSection
        ? await updateSection(selectedSection.id, formData)
        : await createSection(formData);

      if (res.success) {
        await fetchSections();
        clearForm();
        setIsFormModalOpen(false);
      } else {
        setError(res.error || `Failed to ${isEditing ? 'update' : 'create'} section`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sections</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Shopify sections, files, and settings.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto shadow-lg shadow-primary/20">
          
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between border-border/50">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or handle..."
            className="pl-9 glass-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="glass-hover">
            Filter
          </Button>
          <Button variant="outline" size="sm" className="glass-hover">
            Sort
          </Button>
        </div>
      </div>

      {error && !isFormModalOpen && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchSections} className="ml-auto h-7 hover:bg-destructive/20 text-destructive">
            Retry
          </Button>
        </div>
      )}

      {isLoading && sections.length === 0 && !error ? (
        <LoadingState message="Connecting to Section Studio..." />
      ) : (
        <div className="glass rounded-2xl overflow-hidden border-border/50">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[300px]">Section</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sections.length > 0 ? (
                sections.map((section) => (
                  <TableRow key={section.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/30 transition-colors">
                          {section.thumbnailUrl ? (
                            <img
                              src={section.thumbnailUrl}
                              alt={section.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/40 font-bold">
                              SS
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold group-hover:text-primary transition-colors">{section.title}</div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5 opacity-70">
                            {section.handle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {getCategoryName(section.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">
                        ${(section.price / 100).toFixed(2)}
                      </div>
                      {section.compareAtPrice && (
                        <div className="text-[10px] text-muted-foreground line-through opacity-60">
                          ${(section.compareAtPrice / 100).toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={section.isPublished ? 'default' : 'outline'}
                        className={
                          section.isPublished ?
                          'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 font-bold uppercase text-[10px] tracking-wider' :
                          'text-muted-foreground uppercase text-[10px] tracking-wider'
                        }>
                        {section.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {section.tags && section.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] py-0 h-5 px-2 bg-background/50">
                            {tag}
                          </Badge>
                        ))}
                        {section.tags && section.tags.length > 2 && (
                          <Badge variant="outline" className="text-[10px] py-0 h-5 px-1.5 opacity-60">
                            +{section.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="action-btn h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleView(section)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="action-btn h-8 w-8 hover:bg-accent/10 hover:text-accent"
                          onClick={() => handleOpenEdit(section)}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="action-btn h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => confirmDelete(section)}
                          disabled={isDeleting === section.id}
                        >
                          {isDeleting === section.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-muted-foreground italic">
                    {debouncedSearch ? `No sections matching "${debouncedSearch}"` : 'No sections found in your library.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          isLoading={isLoading}
        />
      </div>
      )}

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen} maxWidth="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-primary" />
            <span>{selectedSection?.title}</span>
          </DialogTitle>
          <DialogDescription>
            Technical details and metadata for this section.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedSection?.thumbnailUrl && (
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted">
                <img src={selectedSection.thumbnailUrl} alt={selectedSection.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Category</p>
                <Badge variant="secondary" className="font-bold">
                  {selectedSection ? getCategoryName(selectedSection.category) : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price</p>
                <p className="text-xl font-bold text-foreground">
                  ${selectedSection ? (selectedSection.price / 100).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Status</p>
                <Badge 
                  variant={selectedSection?.isPublished ? 'default' : 'outline'}
                  className={selectedSection?.isPublished ? 'bg-green-500/10 text-green-600 border-green-500/10' : ''}
                >
                  {selectedSection?.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Description</p>
            <p className="text-sm font-medium bg-muted/30 p-4 rounded-xl leading-relaxed">
              {selectedSection?.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Handle</p>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{selectedSection?.handle}</code>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Sort Order</p>
              <p className="text-sm font-bold">{selectedSection?.sortOrder}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Presets</p>
              <p className="text-sm font-bold">{selectedSection?.presetsCount}</p>
            </div>
          </div>

          {selectedSection?.tags && selectedSection.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSection.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-background flex items-center gap-1.5">
                    <TagIcon className="w-3 h-3 text-muted-foreground" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="px-6 py-6 border-t border-border/50 bg-muted/20">
          <Button onClick={() => setIsViewModalOpen(false)} variant="outline">Close</Button>
          <Button onClick={() => { setIsViewModalOpen(false); handleOpenEdit(selectedSection!); }}>Edit Section</Button>
        </DialogFooter>
      </Dialog>

      {/* Create/Edit Section Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={(open) => {
        setIsFormModalOpen(open);
        if (!open) clearForm();
      }} maxWidth="max-w-6xl">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl flex items-center gap-2">
            {isEditing ? <EditIcon className="w-6 h-6 text-primary" /> : <PlusIcon className="w-6 h-6 text-primary" />}
            <span>{isEditing ? 'Edit Section' : 'Add New Section'}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify the details and files for this section.' : 'Create a new section by uploading your .liquid code and metadata.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="px-6 mt-4">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <div className="p-6 space-y-8 overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Title <span className="text-destructive">*</span></label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Testimonial Carousel"
                    className="glass-input h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of what this section does..."
                    className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Category <span className="text-destructive">*</span></label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer hover:border-primary/30 transition-colors"
                      style={{ colorScheme: 'dark' }}
                    >
                      {categories.map(c => (
                        <option key={c.handle} value={c.handle} className="bg-background text-foreground">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Sort Order</label>
                    <Input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="glass-input h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Tags (Enter to add)</label>
                  <div className="relative">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tags..."
                      className="glass-input h-11 pl-10"
                    />
                    <TagIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1.5 bg-muted/50 border-border/50">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Files */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Price ($)</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="glass-input h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Presets</label>
                    <Input
                      type="number"
                      value={presetsCount}
                      onChange={(e) => setPresetsCount(e.target.value)}
                      className="glass-input h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Section File (.liquid) <span className="text-destructive">*</span></label>
                  <div
                    onClick={() => liquidInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/30 min-h-[100px] flex flex-col items-center justify-center
                      ${liquidFile ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                  >
                    <input type="file" ref={liquidInputRef} className="hidden" accept=".liquid" onChange={(e) => e.target.files && setLiquidFile(e.target.files[0])} />
                    <FileCode2 className={`w-8 h-8 mb-2 ${liquidFile ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-xs font-medium truncate max-w-full px-2">
                      {liquidFile ? liquidFile.name : isEditing ? 'Change .liquid file (optional)' : 'Upload .liquid file'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Thumbnail <span className="text-destructive">*</span></label>
                  <div 
                    onClick={() => thumbnailInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/30 min-h-[100px] flex flex-col items-center justify-center
                      ${thumbnail ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                  >
                    <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} />
                    {thumbnail ? (
                      <div className="flex flex-col items-center gap-1">
                        <ImageIcon className="w-8 h-8 text-primary" />
                        <span className="text-[10px] font-medium truncate max-w-[150px]">{thumbnail.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        <span className="text-[10px] font-medium">{isEditing ? 'Change thumbnail (optional)' : 'Upload thumbnail (required)'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Preview Images (Optional)</label>
                  <div 
                    onClick={() => previewImagesInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/30 min-h-[80px] flex flex-col items-center justify-center border-border"
                  >
                    <input type="file" ref={previewImagesInputRef} className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && setPreviewImages([...previewImages, ...Array.from(e.target.files)])} />
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] font-medium">Add preview images</span>
                    </div>
                  </div>
                  {previewImages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {previewImages.map((file, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5 flex items-center gap-1.5">
                          <span className="max-w-[80px] truncate">{file.name}</span>
                          <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => setPreviewImages(previewImages.filter((_, idx) => idx !== i))} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="peer sr-only" />
                    <div className="w-5 h-5 border-2 rounded border-muted-foreground bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {isPublished && <Check className="w-3.5 h-3.5 text-primary-foreground stroke-[4]" />}
                    </div>
                    <span className="text-sm font-medium">Published</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="peer sr-only" />
                    <div className="w-5 h-5 border-2 rounded border-muted-foreground bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {isFeatured && <Check className="w-3.5 h-3.5 text-primary-foreground stroke-[4]" />}
                    </div>
                    <span className="text-sm font-medium">Featured</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border/50 p-6 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isEditing ? 'Save Changes' : 'Publish Section'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation */}      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Section"
        description={`Are you sure you want to delete "${sectionToDelete?.title}"? This will permanently remove the section and its files.`}
        isLoading={isDeleting !== null}
        confirmText="Delete Section"
      />
    </div>
  );
}