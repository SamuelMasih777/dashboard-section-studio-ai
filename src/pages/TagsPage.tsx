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
import { mockTags, mockSections } from '../lib/mockData';
import { Tag } from '../lib/types';
export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const getSectionCount = (handle: string) => {
    return mockSections.filter((s) => s.tags.includes(handle)).length;
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage tags used to filter and categorize sections.
          </p>
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
              <TableHead>Name</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) =>
            <TableRow key={tag.handle}>
                <TableCell className="text-2xl text-center">
                  {tag.emoji}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-semibold">{tag.name}</div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded-md">
                    {tag.handle}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getSectionCount(tag.handle)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                  variant={tag.isActive ? 'default' : 'outline'}
                  className={
                  tag.isActive ?
                  'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20' :
                  ''
                  }>
                  
                    {tag.isActive ? 'Active' : 'Inactive'}
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
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription>
            Add a new tag to help users find sections.
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
                placeholder="🏷️"
                className="text-center text-xl" />
              
            </div>
            <div className="grid gap-2 col-span-3">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="e.g. Minimal" />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="handle" className="text-sm font-medium">
              Handle
            </label>
            <Input id="handle" placeholder="e.g. minimal" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsCreateModalOpen(false)}>
            Create Tag
          </Button>
        </DialogFooter>
      </Dialog>
    </div>);

}