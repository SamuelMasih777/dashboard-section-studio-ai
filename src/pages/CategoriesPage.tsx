import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlusIcon, EditIcon, TrashIcon, Image as ImageIcon, AlertCircle, Loader2, EyeIcon, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from
'../components/ui/Dialog';
import { Category, Section } from '../lib/types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import { getSections } from '../api/sections';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  
  // Image Upload State
  const [image, setImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, secRes] = await Promise.all([
        getCategories({
          page: currentPage,
          limit: pageSize
        }),
        getSections({ limit: 1000 }) // Fetch all for count lookup if needed, but better to optimize later
      ]);

      if (catRes.success) { // This was 'tagRes.success' in the instruction, but kept as 'catRes.success' for CategoriesPage context
        setCategories(catRes.data); // This was 'setTags(tagRes.data)' in the instruction, but kept as 'setCategories(catRes.data)' for CategoriesPage context
        setTotalCount(catRes.pagination.totalCount);
      } else {
        setError(catRes.error || 'Failed to fetch categories');
      }

      if (secRes.success) {
        setSections(secRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getSectionCount = (handle: string) => {
    return sections.filter((s) => s.category === handle).length;
  };

  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setEmoji('📦');
    setSortOrder('0');
    setIsActive(true);
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    setError(null);
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setEmoji(category.emoji);
    setSortOrder(category.sortOrder.toString());
    setIsActive(category.isActive);
    setIsEditing(true);
    setIsCreateModalOpen(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('handle', slugify(name));
      formData.append('description', description);
      formData.append('emoji', emoji);
      formData.append('sortOrder', sortOrder);
      formData.append('isActive', isActive.toString());
      if (image) {
        formData.append('image', image);
      }

      const response = isEditing && selectedCategory
        ? await updateCategory(selectedCategory.handle, formData)
        : await createCategory(formData);
      
      if (response.success) {
        await fetchData();
        clearForm();
        setIsCreateModalOpen(false);
      } else {
        setError(response.error || `Failed to ${isEditing ? 'update' : 'create'} category`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(categoryToDelete.handle);
    try {
      const res = await deleteCategory(categoryToDelete.handle);
      if (res.success) {
        await fetchData();
        setIsConfirmDeleteOpen(false);
      } else {
        alert(res.error || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setIsDeleting(null);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your sections into logical groups.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-primary/20">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {error && !isCreateModalOpen && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchData} className="ml-auto h-7 hover:bg-destructive/20 text-destructive">
            Retry
          </Button>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden border-border/50">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[80px] text-center">Emoji</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm font-medium">Fetching categories...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.handle} className="group hover:bg-muted/30 border-border/50 transition-colors">
                  <TableCell className="text-2xl text-center">
                    <span className="drop-shadow-sm group-hover:scale-110 transition-transform inline-block">
                      {category.emoji}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-bold group-hover:text-primary transition-colors">{category.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5 opacity-70 italic">
                      {category.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground font-mono">
                      {category.handle}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold px-2.5">
                      {getSectionCount(category.handle)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={category.isActive ? 'default' : 'outline'}
                      className={
                        category.isActive ?
                        'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 font-bold uppercase text-[10px] tracking-wider' :
                        'text-muted-foreground uppercase text-[10px] tracking-wider'
                      }>
                      {category.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="action-btn h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleView(category)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="action-btn h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleEdit(category)}
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="action-btn h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => confirmDelete(category)}
                        disabled={isDeleting === category.handle}
                      >
                        {isDeleting === category.handle ? (
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
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                  No categories found. Create one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) clearForm();
      }}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl">{isEditing ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this category.' : 'Add a new category to organize your sections.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="px-4 py-3 mx-4 mt-2 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="grid gap-6 px-6 py-4 overflow-y-auto scrollbar-thin">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Testimonial" 
                className="glass-input font-medium"
              />
              <p className="text-[10px] text-muted-foreground font-mono">handle: {slugify(name) || '—'}</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..." 
                className="w-full min-h-[80px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Emoji <span className="text-destructive">*</span></label>
                <div className="flex gap-2">
                  <Input 
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="glass-input text-center text-xl w-16 px-0"
                    maxLength={2}
                  />
                  <div className="flex-1 rounded-md border border-input bg-muted/50 flex items-center justify-center text-2xl h-10 shadow-inner">
                    {emoji || '📦'}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Sort order</label>
                <Input 
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Category image (optional)</label>
              <div 
                className={`border border-dashed rounded-lg p-4 text-center transition-all cursor-pointer bg-muted/20
                  ${image ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/40'}`}
                onClick={() => imageInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
                {image ? (
                  <div className="flex items-center justify-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium truncate max-w-[200px]">{image.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Click to upload image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {isActive && <Check className="w-3.5 h-3.5 text-primary-foreground stroke-[4]" />}
                </div>
                <span className="text-sm font-semibold group-hover:text-primary transition-colors">Active (visible to users)</span>
              </label>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-6 border-t border-border/50 bg-muted/20">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="glass-hover">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[100px] shadow-lg shadow-primary/10">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : isEditing ? 'Update category' : 'Save category'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* View Category Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{selectedCategory?.emoji}</span>
            <span>{selectedCategory?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this category.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          {selectedCategory?.imageUrl && (
            <div className="w-full h-40 rounded-xl overflow-hidden border border-border/50">
              <img src={selectedCategory.imageUrl} alt={selectedCategory.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Description</p>
              <p className="text-sm font-medium bg-muted/30 p-3 rounded-lg min-h-[60px]">
                {selectedCategory?.description || 'No description provided.'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Handle</p>
              <code className="text-sm bg-muted px-2 py-1 rounded-md block w-fit font-mono">{selectedCategory?.handle}</code>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Status</p>
              <Badge variant={selectedCategory?.isActive ? 'default' : 'outline'}>
                {selectedCategory?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Sections</p>
              <Badge variant="secondary" className="font-bold">
                {selectedCategory ? getSectionCount(selectedCategory.handle) : 0}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Sort Order</p>
              <p className="text-sm font-medium">{selectedCategory?.sortOrder}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-6 border-t border-border/50 bg-muted/20">
          <Button onClick={() => setIsViewModalOpen(false)} variant="outline">Close</Button>
          <Button onClick={() => { setIsViewModalOpen(false); handleEdit(selectedCategory!); }}>Edit Category</Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action may affect sections assigned to this category.`}
        isLoading={isDeleting !== null}
        confirmText="Delete"
      />
    </div>
  );
}