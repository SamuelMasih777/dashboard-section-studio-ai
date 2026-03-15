import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, TrashIcon, PackageIcon, EditIcon, Loader2, AlertCircle, EyeIcon, Check } from 'lucide-react';
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
import { Bundle, Section } from '../lib/types';
import { getBundles, createBundle, updateBundle, deleteBundle } from '../api/bundles';
import { getSections } from '../api/sections';
import React from 'react';
import { LoadingState } from '../components/ui/LoadingState';
import { Skeleton } from '../components/ui/Skeleton';

export function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<Bundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [price, setPrice] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bundleRes, sectionRes] = await Promise.all([
        getBundles({
          page: currentPage,
          limit: pageSize
        }),
        getSections({ limit: 1000 })
      ]);

      if (bundleRes.success) {
        setBundles(bundleRes.data || []);
        setTotalCount(bundleRes.pagination.totalCount);
      } else {
        setError(bundleRes.error || 'Failed to fetch bundles');
      }

      if (sectionRes.success) {
        setSections(sectionRes.data || []);
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

  const clearForm = () => {
    setTitle('');
    setHandle('');
    setPrice('0');
    setDiscount('0');
    setDescription('');
    setIsActive(true);
    setSelectedSectionIds([]);
    setError(null);
    setSelectedBundle(null);
    setIsEditing(false);
  };

  const handleEdit = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setTitle(bundle.title);
    setHandle(bundle.handle);
    setPrice(bundle.price.toString());
    setDiscount(bundle.discount.toString());
    setDescription(bundle.description || '');
    setIsActive(bundle.isActive);
    setSelectedSectionIds(bundle.sectionIds);
    setIsEditing(true);
    setIsCreateModalOpen(true);
  };

  const handleView = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setIsViewModalOpen(true);
  };

  const confirmDelete = (bundle: Bundle) => {
    setBundleToDelete(bundle);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!bundleToDelete) return;

    setIsDeleting(bundleToDelete.id);
    try {
      const res = await deleteBundle(bundleToDelete.id);
      if (res.success) {
        await fetchData();
        setIsConfirmDeleteOpen(false);
      } else {
        alert(res.error || 'Failed to delete bundle');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete bundle');
    } finally {
      setIsDeleting(null);
      setBundleToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !handle.trim()) {
      setError('Title and handle are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('handle', handle);
      formData.append('price', price);
      formData.append('discount', discount);
      formData.append('description', description);
      formData.append('isActive', isActive.toString());
      formData.append('sectionIds', JSON.stringify(selectedSectionIds));

      const response = isEditing && selectedBundle
        ? await updateBundle(selectedBundle.id, formData)
        : await createBundle(formData);
      
      if (response.success) {
        await fetchData();
        clearForm();
        setIsCreateModalOpen(false);
      } else {
        setError(response.error || `Failed to ${isEditing ? 'update' : 'create'} bundle`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionDetails = (id: string) => {
    return sections.find(s => s.id === id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bundles</h1>
          <p className="text-muted-foreground mt-1">
            Group sections together into discounted bundles.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-primary/20">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Bundle
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchData} className="ml-auto h-7 hover:bg-destructive/20 text-destructive">
            Retry
          </Button>
        </div>
      )}

      {isLoading && bundles.length === 0 && !error ? (
        <LoadingState message="Connecting to Section Studio..." />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden flex flex-col border-border/50">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 mt-auto pt-4">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="glass rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50"
            >
              <div className="h-48 bg-muted relative overflow-hidden">
                {bundle.thumbnailUrl ? (
                  <img
                    src={bundle.thumbnailUrl}
                    alt={bundle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <PackageIcon className="w-12 h-12 text-primary/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={bundle.isActive ? 'default' : 'secondary'}
                    className={
                      bundle.isActive ? 
                      'bg-green-500/90 text-white border-green-500/20 backdrop-blur-md' : 
                      'backdrop-blur-md'
                    }
                  >
                    {bundle.isActive ? 'Active' : 'Draft'}
                  </Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {bundle.title}
                  </h3>
                  <div className="text-right">
                    <div className="font-bold text-lg text-foreground">
                      ${(bundle.price / 100).toFixed(2)}
                    </div>
                    {bundle.discount > 0 && (
                      <div className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                        {bundle.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {bundle.description || 'No description provided.'}
                </p>

                <div className="mb-6">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-70">
                    Includes {bundle.sectionIds.length} sections
                  </div>
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {bundle.sectionIds.slice(0, 5).map((sectionId, i) => {
                      const section = getSectionDetails(sectionId);
                      return (
                        <div
                          key={sectionId}
                          className="inline-block h-9 w-9 rounded-full ring-2 ring-background bg-muted overflow-hidden relative shadow-sm"
                          style={{ zIndex: 10 - i }}
                        >
                          {section?.thumbnailUrl ? (
                            <img
                              src={section.thumbnailUrl}
                              alt={section.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                              {section?.title?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {bundle.sectionIds.length > 5 && (
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-bold text-muted-foreground relative z-0 shadow-sm">
                        +{bundle.sectionIds.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
                  <Button 
                    variant="outline" 
                    className="action-btn flex-1 glass-hover text-xs font-bold uppercase tracking-wider h-9"
                    onClick={() => handleView(bundle)}
                  >
                    <EyeIcon className="w-3.5 h-3.5 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    className="action-btn flex-1 glass-hover text-xs font-bold uppercase tracking-wider h-9"
                    onClick={() => handleEdit(bundle)}
                  >
                    <EditIcon className="w-3.5 h-3.5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="action-btn h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive border-border/50"
                    onClick={() => confirmDelete(bundle)}
                    disabled={isDeleting === bundle.id}
                  >
                    {isDeleting === bundle.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-20 text-center border-dashed border-2">
          <div className="flex flex-col items-center gap-4">
            <PackageIcon className="w-12 h-12 text-muted-foreground/20" />
            <div>
              <h3 className="text-xl font-bold">No bundles found</h3>
              <p className="text-muted-foreground">Create your first bundle to get started!</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-2">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Bundle
            </Button>
          </div>
        </div>
      )}

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

      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) clearForm();
      }}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl">{isEditing ? 'Edit Bundle' : 'Create Bundle'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this bundle.' : 'Create a new bundle of sections to offer at a discount.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="px-4 py-3 mx-4 mt-2 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="grid gap-6 py-4 px-6 overflow-y-auto scrollbar-thin">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Essential Store Starter" 
                className="glass-input" 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="handle" className="text-sm font-medium">
                Handle
              </label>
              <Input 
                id="handle" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. essential-store-starter" 
                className="glass-input" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price (in cents)
                </label>
                <Input 
                  id="price" 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="4900" 
                  className="glass-input" 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="discount" className="text-sm font-medium">
                  Discount (%)
                </label>
                <Input 
                  id="discount" 
                  type="number" 
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="25" 
                  className="glass-input" 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this bundle"
                className="w-full min-h-[80px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Sections</label>
              <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 rounded-lg bg-muted/30 border border-border/50 scrollbar-thin">
                {sections.map(section => (
                  <label key={section.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedSectionIds.includes(section.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSectionIds(prev => [...prev, section.id]);
                        } else {
                          setSelectedSectionIds(prev => prev.filter(id => id !== section.id));
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border rounded transition-colors flex items-center justify-center
                      ${selectedSectionIds.includes(section.id) ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`}>
                      {selectedSectionIds.includes(section.id) && (
                        <Check className="w-3 h-3 text-primary-foreground stroke-[4]" />
                      )}
                    </div>
                    <span className="text-xs truncate group-hover:text-primary transition-colors">{section.title}</span>
                  </label>
                ))}
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
                <span className="text-sm font-semibold group-hover:text-primary transition-colors">Active</span>
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
              ) : isEditing ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* View Bundle Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-primary" />
            <span>{selectedBundle?.title}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this bundle and its contents.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {selectedBundle?.thumbnailUrl && (
            <div className="w-full h-48 rounded-xl overflow-hidden border border-border/50">
              <img src={selectedBundle.thumbnailUrl} alt={selectedBundle.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Description</p>
              <p className="text-sm font-medium bg-muted/30 p-3 rounded-lg min-h-[60px]">
                {selectedBundle?.description || 'No description provided.'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price</p>
              <p className="text-lg font-bold text-foreground">
                ${selectedBundle ? (selectedBundle.price / 100).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Discount</p>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/10 font-bold">
                {selectedBundle?.discount}% OFF
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Status</p>
              <Badge variant={selectedBundle?.isActive ? 'default' : 'outline'}>
                {selectedBundle?.isActive ? 'Active' : 'Draft'}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Handle</p>
              <code className="text-[10px] bg-muted px-2 py-1 rounded-md block w-fit font-mono">{selectedBundle?.handle}</code>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Included Sections ({selectedBundle?.sectionIds.length})</p>
            <div className="grid gap-2">
              {selectedBundle?.sectionIds.map(id => {
                const section = getSectionDetails(id);
                return (
                  <div key={id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-border/30">
                    <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                      {section?.thumbnailUrl ? (
                        <img src={section.thumbnailUrl} alt={section.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">?</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{section?.title || 'Unknown Section'}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{section?.handle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-6 border-t border-border/50 bg-muted/20">
          <Button onClick={() => setIsViewModalOpen(false)} variant="outline">Close</Button>
          <Button onClick={() => { setIsViewModalOpen(false); handleEdit(selectedBundle!); }}>Edit Bundle</Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Bundle"
        description={`Are you sure you want to delete the bundle "${bundleToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting !== null}
        confirmText="Delete"
      />
    </div>
  );
}