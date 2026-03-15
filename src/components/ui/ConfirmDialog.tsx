import { Button } from './Button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './Dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </div>
        <DialogDescription className="mt-2 text-muted-foreground">
          {description}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="px-6 py-6 border-t border-border/50 bg-muted/20">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
          className="hover:bg-muted"
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'primary'}
          onClick={onConfirm}
          disabled={isLoading}
          className="min-w-[100px] shadow-lg shadow-destructive/10"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            confirmText
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
