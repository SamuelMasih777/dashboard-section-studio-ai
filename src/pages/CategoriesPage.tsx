import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
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
import { mockCategories, mockSections } from '../lib/mockData';
import { Category } from '../lib/types';
export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const getSectionCount = (handle: string) => {
    return mockSections.filter((s) => s.category === handle).length;
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your sections into logical groups.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Emoji</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) =>
            <TableRow key={category.handle}>
                <TableCell className="text-2xl text-center">
                  {category.emoji}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {category.description}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded-md">
                    {category.handle}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getSectionCount(category.handle)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                  variant={category.isActive ? 'default' : 'outline'}
                  className={
                  category.isActive ?
                  'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20' :
                  ''
                  }>
                  
                    {category.isActive ? 'Active' : 'Inactive'}
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
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your sections.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="grid gap-2 col-span-1">
              <label htmlFor="emoji" className="text-sm font-medium">
                Emoji
              </label>
              <Input
                id="emoji"
                placeholder="📦"
                className="text-center text-xl" />
              
            </div>
            <div className="grid gap-2 col-span-3">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="e.g. Hero Sections" />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="handle" className="text-sm font-medium">
              Handle
            </label>
            <Input id="handle" placeholder="e.g. hero-sections" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="Brief description of this category" />
            
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsCreateModalOpen(false)}>
            Create Category
          </Button>
        </DialogFooter>
      </Dialog>
    </div>);

}