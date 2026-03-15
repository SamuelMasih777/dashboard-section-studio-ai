import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Ghost, Home, ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function NotFoundPage() {
  const navigate = useNavigate();
  useTheme(); // Ensure theme is active

  return (
    <div className="min-h-screen flex items-center justify-center mesh-gradient p-4">
      <div className="text-center max-w-lg mx-auto flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-background border border-border p-8 rounded-full shadow-2xl">
            <Ghost className="w-20 h-20 text-primary animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter mb-4 text-foreground drop-shadow-sm">
          404
        </h1>
        
        <div className="space-y-2 mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Oops! It seems you've wandered into the unknown. The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="w-full sm:w-auto px-8 h-12 text-sm font-bold uppercase tracking-widest glass-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto px-8 h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
        
      </div>
    </div>
  );
}
