import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, EditIcon, TrashIcon, AlertCircle, Loader2, EyeIcon, Check } from 'lucide-react';
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
import { Tag, Section } from '../lib/types';
import { getTags, createTag, updateTag, deleteTag } from '../api/tags';
import { getSections } from '../api/sections';
import { LoadingState } from '../components/ui/LoadingState';
import { Skeleton } from '../components/ui/Skeleton';

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Form State
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏷️');
  const [isActive, setIsActive] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tagRes, secRes] = await Promise.all([
        getTags({
          page: currentPage,
          limit: pageSize
        }),
        getSections({ limit: 1000 })
      ]);

      if (tagRes.success) {
        setTags(tagRes.data);
        setTotalCount(tagRes.pagination.totalCount);
      } else {
        setError(tagRes.error || 'Failed to fetch tags');
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
    return sections.filter((s) => s.tags?.includes(handle)).length;
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
    setEmoji('🏷️');
    setIsActive(true);
    setError(null);
    setSelectedTag(null);
    setIsEditing(false);
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setName(tag.name);
    setEmoji(tag.emoji);
    setIsActive(tag.isActive);
    setIsEditing(true);
    setIsCreateModalOpen(true);
  };

  const handleView = (tag: Tag) => {
    setSelectedTag(tag);
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
      formData.append('handle', isEditing && selectedTag ? selectedTag.handle : slugify(name));
      formData.append('emoji', emoji);
      formData.append('isActive', isActive.toString());

      const response = isEditing && selectedTag 
        ? await updateTag(selectedTag.handle, formData)
        : await createTag(formData);
      
      if (response.success) {
        await fetchData();
        clearForm();
        setIsCreateModalOpen(false);
      } else {
        setError(response.error || `Failed to ${isEditing ? 'update' : 'create'} tag`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (tag: Tag) => {
    setTagToDelete(tag);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;

    setIsDeleting(tagToDelete.handle);
    try {
      const res = await deleteTag(tagToDelete.handle);
      if (res.success) {
        await fetchData();
        setIsConfirmDeleteOpen(false);
      } else {
        alert(res.error || 'Failed to delete tag');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete tag');
    } finally {
      setIsDeleting(null);
      setTagToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-1">Manage tags used to filter and categorize sections.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-primary/20">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Tag
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

      {isLoading && tags.length === 0 && !error ? (
        <LoadingState message="Connecting to Section Studio..." />
      ) : (
        <div className="glass rounded-2xl overflow-hidden border-border/50">
          <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[80px] text-center">Emoji</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center"><Skeleton className="w-8 h-8 rounded-md mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : tags.length > 0 ? (
              tags.map((tag) => (
                <TableRow key={tag.handle} className="group hover:bg-muted/30 border-border/50 transition-colors">
                  <TableCell className="text-2xl text-center">
                    <span className="drop-shadow-sm group-hover:scale-110 transition-transform inline-block">
                      {tag.emoji}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-bold group-hover:text-primary transition-colors">{tag.name}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground font-mono">
                      {tag.handle}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold px-2.5">
                      {getSectionCount(tag.handle)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={tag.isActive ? 'default' : 'outline'}
                      className={
                        tag.isActive ?
                        'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 font-bold uppercase text-[10px] tracking-wider' :
                        'text-muted-foreground uppercase text-[10px] tracking-wider'
                      }>
                      {tag.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="action-btn h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleView(tag)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="action-btn h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleEdit(tag)}
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="action-btn h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => confirmDelete(tag)}
                        disabled={isDeleting === tag.handle}
                      >
                        {isDeleting === tag.handle ? (
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
                  No tags found.
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
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) clearForm();
      }}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl">{isEditing ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this tag.' : 'Add a new tag to help users find sections.'}
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
                placeholder="e.g. Minimal" 
                className="glass-input font-medium"
              />
              <p className="text-[10px] text-muted-foreground font-mono">handle: {slugify(name) || '—'}</p>
            </div>

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
                  {emoji || '🏷️'}
                </div>
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
              ) : isEditing ? 'Update tag' : 'Save tag'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* View Tag Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{selectedTag?.emoji}</span>
            <span>{selectedTag?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this tag.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Handle</p>
              <code className="text-sm bg-muted px-2 py-1 rounded-md block w-fit font-mono">{selectedTag?.handle}</code>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Status</p>
              <Badge variant={selectedTag?.isActive ? 'default' : 'outline'}>
                {selectedTag?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Created At</p>
              <p className="text-sm font-medium">{selectedTag ? new Date(selectedTag.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Sections</p>
              <Badge variant="secondary" className="font-bold">
                {selectedTag ? getSectionCount(selectedTag.handle) : 0}
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-6 border-t border-border/50 bg-muted/20">
          <Button onClick={() => setIsViewModalOpen(false)} variant="outline">Close</Button>
          <Button onClick={() => { setIsViewModalOpen(false); handleEdit(selectedTag!); }}>Edit Tag</Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Tag"
        description={`Are you sure you want to delete "${tagToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting !== null}
        confirmText="Delete"
      />
    </div>
  );
}
