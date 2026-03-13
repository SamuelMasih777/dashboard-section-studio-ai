import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  X, 
  FileCode2, 
  Image as ImageIcon, 
  AlertCircle,
  Tag as TagIcon,
  ArrowLeft
} from 'lucide-react';
import { createSection } from '../api/sections';

const CATEGORIES = [
  'Testimonial',
  'Hero',
  'Feature',
  'Pricing',
  'FAQ',
  'CTA',
  'Footer',
  'Header',
  'Gallery',
  'Newsletter',
  'Other'
];

export function CreateSectionPage() {
  const navigate = useNavigate();

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Testimonial');
  const [sortOrder, setSortOrder] = useState('0');
  
  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Pricing
  const [price, setPrice] = useState('9');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [presetsCount, setPresetsCount] = useState('1');

  // Files
  const [liquidFile, setLiquidFile] = useState<File | null>(null);
  const liquidInputRef = useRef<HTMLInputElement>(null);
  const [demoUrl, setDemoUrl] = useState('');

  // Media
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const previewImagesInputRef = useRef<HTMLInputElement>(null);
  
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');

  // Visibility
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const generatedHandle = slugify(title);

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

  const handleLiquidDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.liquid')) {
        setLiquidFile(file);
      } else {
        setError('Only .liquid files are allowed for the section file.');
      }
    }
  };

  const removeLiquidFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiquidFile(null);
    if (liquidInputRef.current) {
      liquidInputRef.current.value = '';
    }
  };

  const removePreviewImage = (index: number) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!title) {
      setError('Title is required');
      window.scrollTo(0, 0);
      return;
    }

    if (!liquidFile) {
      setError('A .liquid file is required');
      return;
    }

    if (!thumbnail) {
      setError('A thumbnail image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      if (compareAtPrice) formData.append('compareAtPrice', compareAtPrice);
      formData.append('category', category);
      formData.append('tags', JSON.stringify(tags));
      formData.append('demoUrl', demoUrl);
      formData.append('isFeatured', isFeatured.toString());
      formData.append('isPublished', isDraft ? 'false' : isPublished.toString());
      formData.append('presetsCount', presetsCount);
      formData.append('sortOrder', sortOrder);
      if (previewVideoUrl) formData.append('previewVideoUrl', previewVideoUrl);

      // Files
      formData.append('liquidFile', liquidFile);
      formData.append('thumbnail', thumbnail);
      previewImages.forEach(file => {
        formData.append('previewImages', file);
      });

      const response = await createSection(formData);

      if (response.success) {
        navigate('/sections');
      } else {
        setError(response.error || 'Failed to create section');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Back to Sections</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Add new section
          </h1>
          <p className="text-muted-foreground mt-1">All fields marked <span className="text-destructive">*</span> are required</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none glass-hover hover:border-primary/50 transition-colors"
          >
            Save draft
          </Button>
          <Button 
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all"
          >
            {isSubmitting ? 'Publishing...' : 'Publish ↗'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form className="space-y-6">
        {/* BASIC INFO */}
        <Card className="p-6 glass-strong border-border/50">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-6">Basic Info</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Title <span className="text-destructive">*</span></label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Testimonial #9"
                className="glass-input text-lg font-medium"
              />
              <p className="text-xs text-muted-foreground mt-2">Handle auto-generated: {generatedHandle || '...'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this section do? What makes it special?"
                className="w-full min-h-[100px] rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Category <span className="text-destructive">*</span></label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort order</label>
                <Input 
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                />
                <p className="text-xs text-muted-foreground mt-1">Lower = shown first</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="relative mb-3">
                <Input 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter..."
                  className="glass-input pl-9"
                />
                <TagIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 flex items-center gap-1.5 bg-secondary/50 border border-border/50">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Badge variant="outline" className="px-3 py-1 border-dashed cursor-pointer hover:bg-muted/50" onClick={() => {}}>
                  <span className="text-muted-foreground font-normal">+ add</span>
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* PRICING */}
        <Card className="p-6 glass-strong border-border/50">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-6">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Price (USD) <span className="text-destructive">*</span></label>
              <Input 
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9"
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground mt-1">0 = free section</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Compare at price</label>
              <Input 
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="e.g. 14"
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground mt-1">Shows strikethrough</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Presets count</label>
              <Input 
                type="number"
                value={presetsCount}
                onChange={(e) => setPresetsCount(e.target.value)}
                placeholder="1"
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground mt-1">Shown in modal badge</p>
            </div>
          </div>
        </Card>

        {/* SECTION FILE */}
        <Card className="p-6 glass-strong border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase focus:outline-none">Section File</h2>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-medium">.LIQUID</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">This is the file that gets injected into the merchant's Shopify theme on purchase.</p>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer mb-4 flex flex-col items-center justify-center min-h-[160px]
              ${liquidFile ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleLiquidDrop}
            onClick={() => liquidInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={liquidInputRef} 
              className="hidden" 
              accept=".liquid" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setLiquidFile(e.target.files[0]);
                }
              }}
            />
            
            <FileCode2 className={`w-10 h-10 mb-3 mx-auto ${liquidFile ? 'text-primary' : 'text-muted-foreground'}`} />
            
            <p className="font-medium text-foreground mb-1">
              Drop .liquid file here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              {generatedHandle ? `${generatedHandle}.liquid` : 'testimonial-9.liquid'} — will be stored on S3 and URL saved to SectionFile table
            </p>
          </div>

          {liquidFile && (
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileCode2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm truncate font-medium">{liquidFile.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">— {(liquidFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <button 
                type="button" 
                onClick={removeLiquidFile}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Demo URL</label>
            <Input 
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder={`https://demo.yourdomain.com/products/${generatedHandle || 'testimonial-9'}`}
              className="glass-input"
            />
            <p className="text-xs text-muted-foreground mt-1">Link to your live demo store page showing this section</p>
          </div>
        </Card>

        {/* MEDIA */}
        <Card className="p-6 glass-strong border-border/50">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-6">Media</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail <span className="text-destructive">*</span></label>
              
              <div 
                className={`border border-dashed rounded-lg p-6 text-center transition-all cursor-pointer mb-3
                  ${thumbnail ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={thumbnailInputRef} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setThumbnail(e.target.files[0]);
                    }
                  }}
                />
                
                {thumbnail ? (
                  <div className="flex items-center justify-center gap-3">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{thumbnail.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-foreground">Upload card thumbnail (shown in browse grid)</p>
                    <p className="text-sm text-muted-foreground">Recommended: 800×600px, JPG or PNG</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preview images</label>
              
              <div 
                className="border border-dashed border-border hover:border-primary/30 hover:bg-muted/30 rounded-lg p-6 text-center transition-all cursor-pointer mb-3"
                onClick={() => previewImagesInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={previewImagesInputRef} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp" 
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setPreviewImages([...previewImages, ...Array.from(e.target.files)]);
                    }
                  }}
                />
                
                <p className="font-medium text-foreground">Upload multiple images for modal carousel</p>
                <p className="text-sm text-muted-foreground">Desktop + mobile screenshots, different presets</p>
              </div>

              {previewImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewImages.map((file, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1.5 flex items-center gap-2 bg-background">
                      <span className="max-w-[120px] truncate text-xs">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removePreviewImage(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preview video URL</label>
              <Input 
                value={previewVideoUrl}
                onChange={(e) => setPreviewVideoUrl(e.target.value)}
                placeholder="https://youtube.com/... or Vimeo/direct MP4 URL"
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground mt-1">Shown in modal. YouTube embed or direct .mp4 link</p>
            </div>
          </div>
        </Card>

        {/* VISIBILITY */}
        <Card className="p-6 glass-strong border-border/50">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-6">Visibility</h2>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                {isPublished && <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
                  <svg className="w-3 h-3" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">Published (visible in app)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                {isFeatured && <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
                  <svg className="w-3 h-3" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">Featured (shown in spotlight row)</span>
            </label>
          </div>
        </Card>
      </form>
    </div>
  );
}
