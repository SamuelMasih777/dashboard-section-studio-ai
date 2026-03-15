import React, { useState, useEffect } from 'react';
import { Loader2, Zap, Server, Globe } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  const [tip, setTip] = useState(0);
  
  const tips = [
    "Waking up the server... Hang tight!",
    "Render's free tier sleeps when inactive, but we're shaking it awake.",
    "Almost there! Just a few more seconds for the initial connection.",
    "Wait is worth the performance! Almost done.",
    "Optimizing your dashboard experience..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150 animate-pulse" />
        <div className="relative bg-background border border-primary/20 p-6 rounded-full shadow-2xl shadow-primary/10">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 bg-background border border-border p-2 rounded-lg shadow-lg animate-bounce">
          <Zap className="w-4 h-4 text-primary fill-primary" />
        </div>
      </div>
      
      <div className="text-center space-y-4 max-w-sm px-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Server className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">{message}</span>
        </div>
        
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {tips[tip]}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          The initial fetch takes longer because our backend is hosted on a cold-start environment. Thanks for your patience!
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
}
