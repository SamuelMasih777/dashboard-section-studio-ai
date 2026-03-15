import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: PaginationProps) {
  const safeTotalCount = Number(totalCount) || 0;
  const totalPages = Math.ceil(safeTotalCount / pageSize);
  const startItem = safeTotalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, safeTotalCount);

  if (safeTotalCount === 0 && !isLoading) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/50 bg-muted/5 shadow-inner">
      <div className="flex items-center gap-4 text-sm text-muted-foreground order-2 sm:order-1">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-background border border-border/50 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-medium cursor-pointer hover:border-primary/30"
            disabled={isLoading}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size} className="bg-background text-foreground">
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-border/50" />
        <p className="font-medium">
          Showing <span className="text-foreground">{startItem}-{endItem}</span> of{' '}
          <span className="text-foreground">{safeTotalCount}</span>
        </p>
      </div>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="hidden sm:flex h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center px-4 text-sm font-medium">
          Page {currentPage} of {totalPages || 1}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || isLoading}
          className="hidden sm:flex h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
