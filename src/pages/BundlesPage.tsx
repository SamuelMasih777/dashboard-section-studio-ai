import { useState } from 'react';
import { PlusIcon, TrashIcon, PackageIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from
'../components/ui/Dialog';
import { mockBundles, mockSections } from '../lib/mockData';
import { Bundle } from '../lib/types';
export function BundlesPage() {
  const [bundles] = useState<Bundle[]>(mockBundles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bundles</h1>
          <p className="text-muted-foreground">
            Group sections together into discounted bundles.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Bundle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) =>
        <div
          key={bundle.id}
          className="glass rounded-2xl overflow-hidden flex flex-col">
          
            <div className="h-48 bg-muted relative">
              {bundle.thumbnailUrl ?
            <img
              src={bundle.thumbnailUrl}
              alt={bundle.title}
              className="w-full h-full object-cover" /> :


            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                  <PackageIcon className="w-12 h-12 text-primary/20" />
                </div>
            }
              <div className="absolute top-4 right-4">
                <Badge
                variant={bundle.isActive ? 'default' : 'secondary'}
                className={
                bundle.isActive ? 'bg-green-500/90 text-white' : ''
                }>
                
                  {bundle.isActive ? 'Active' : 'Draft'}
                </Badge>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">
                  {bundle.title}
                </h3>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    ${(bundle.price / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-green-500 font-medium">
                    {bundle.discount}% OFF
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                {bundle.description}
              </p>

              <div className="mb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Includes {bundle.sectionIds.length} sections
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  {bundle.sectionIds.slice(0, 4).map((sectionId, i) => {
                  const section = mockSections.find((s) => s.id === sectionId);
                  return (
                    <div
                      key={sectionId}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted overflow-hidden relative z-[1]"
                      style={{
                        zIndex: 10 - i
                      }}>
                      
                        {section?.thumbnailUrl ?
                      <img
                        src={section.thumbnailUrl}
                        alt={section.title}
                        className="w-full h-full object-cover" /> :


                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                            {section?.title.charAt(0)}
                          </div>
                      }
                      </div>);

                })}
                  {bundle.sectionIds.length > 4 &&
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-medium relative z-0">
                      +{bundle.sectionIds.length - 4}
                    </div>
                }
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                <Button variant="outline" className="flex-1">
                  Edit Bundle
                </Button>
                <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive">
                
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogHeader>
          <DialogTitle>Create Bundle</DialogTitle>
          <DialogDescription>
            Create a new bundle of sections to offer at a discount.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" placeholder="e.g. Essential Store Starter" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="handle" className="text-sm font-medium">
              Handle
            </label>
            <Input id="handle" placeholder="e.g. essential-store-starter" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (in cents)
              </label>
              <Input id="price" type="number" placeholder="4900" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="discount" className="text-sm font-medium">
                Discount (%)
              </label>
              <Input id="discount" type="number" placeholder="25" />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="Brief description of this bundle" />
            
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsCreateModalOpen(false)}>
            Create Bundle
          </Button>
        </DialogFooter>
      </Dialog>
    </div>);

}