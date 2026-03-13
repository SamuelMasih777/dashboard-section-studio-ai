import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
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
import { mockTags, mockSections } from '../lib/mockData';
import { Tag } from '../lib/types';
import { createTag } from '../api/tags';

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏷️');
  const [isActive, setIsActive] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSectionCount = (handle: string) => {
    return mockSections.filter((s) => s.tags?.includes(handle)).length;
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
      formData.append('emoji', emoji);
      formData.append('isActive', isActive.toString());

      const response = await createTag(formData);
      
      if (response.success) {
        // Optimistically update UI
        const newTag: Tag = {
          name,
          handle: slugify(name),
          emoji,
          isActive,
          sortOrder: tags.length,
          createdAt: new Date().toISOString(),
        };
        setTags([...tags, newTag]);
        clearForm();
        setIsCreateModalOpen(false);
      } else {
        setError(response.error || 'Failed to create tag');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground mt-1">Manage tags used to filter and categorize sections.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Emoji</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) =>
            <TableRow key={tag.handle} className="hover:bg-muted/50 border-border/50">
                <TableCell className="text-2xl text-center">
                  {tag.emoji}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-semibold">{tag.name}</div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                    {tag.handle}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-secondary/50">
                    {getSectionCount(tag.handle)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                  variant={tag.isActive ? 'default' : 'outline'}
                  className={
                  tag.isActive ?
                  'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 font-medium' :
                  'text-muted-foreground font-normal'
                  }>
                    {tag.isActive ? 'active' : 'inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <EditIcon className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogHeader>
          <DialogTitle>Add / Edit Tag</DialogTitle>
          <DialogDescription>
            Add a new tag to help users find sections.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="px-4 py-3 mx-4 mt-2 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-4 px-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minimal" 
              className="glass-input"
            />
            <p className="text-xs text-muted-foreground mt-2">handle: <span className="font-mono">{slugify(name) || '—'}</span></p>
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
              <div className="flex-1 rounded-md border border-input bg-muted/50 flex items-center justify-center text-2xl h-10">
                {emoji || '🏷️'}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                {isActive && <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
                  <svg className="w-3 h-3" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">Active (visible to users)</span>
            </label>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t border-border/50">
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save tag'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}