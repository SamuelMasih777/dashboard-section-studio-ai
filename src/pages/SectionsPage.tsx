import React, { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  EyeIcon } from
'lucide-react';
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
import { mockSections, mockCategories } from '../lib/mockData';
import { Section } from '../lib/types';
export function SectionsPage() {
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const filteredSections = sections.filter(
    (section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getCategoryName = (handle: string) => {
    return mockCategories.find((c) => c.handle === handle)?.name || handle;
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
          <p className="text-muted-foreground">
            Manage your Shopify sections, files, and settings.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto">
          
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
          
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
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
            {filteredSections.map((section) =>
            <TableRow key={section.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border">
                      {section.thumbnailUrl ?
                    <img
                      src={section.thumbnailUrl}
                      alt={section.title}
                      className="w-full h-full object-cover" /> :


                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                          SS
                        </div>
                    }
                    </div>
                    <div>
                      <div className="font-semibold">{section.title}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {section.handle}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getCategoryName(section.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    ${(section.price / 100).toFixed(2)}
                  </div>
                  {section.compareAtPrice &&
                <div className="text-xs text-muted-foreground line-through">
                      ${(section.compareAtPrice / 100).toFixed(2)}
                    </div>
                }
                </TableCell>
                <TableCell>
                  <Badge
                  variant={section.isPublished ? 'default' : 'outline'}
                  className={
                  section.isPublished ?
                  'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20' :
                  ''
                  }>
                  
                    {section.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {section.tags.slice(0, 2).map((tag) =>
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs py-0 h-5">
                    
                        {tag}
                      </Badge>
                  )}
                    {section.tags.length > 2 &&
                  <Badge variant="outline" className="text-xs py-0 h-5">
                        +{section.tags.length - 2}
                      </Badge>
                  }
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <EyeIcon className="w-4 h-4 text-muted-foreground" />
                    </Button>
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
            {filteredSections.length === 0 &&
            <TableRow>
                <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground">
                
                  No sections found.
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogHeader>
          <DialogTitle>Create New Section</DialogTitle>
          <DialogDescription>
            Add a new section to your library. You can upload files later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" placeholder="e.g. Split Screen Hero" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="handle" className="text-sm font-medium">
              Handle
            </label>
            <Input id="handle" placeholder="e.g. split-screen-hero" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (in cents)
              </label>
              <Input id="price" type="number" placeholder="1900" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                className="glass-input flex h-10 w-full rounded-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                
                {mockCategories.map((c) =>
                <option key={c.handle} value={c.handle}>
                    {c.name}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsCreateModalOpen(false)}>
            Create Section
          </Button>
        </DialogFooter>
      </Dialog>
    </div>);

}