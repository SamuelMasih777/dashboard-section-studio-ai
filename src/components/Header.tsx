import React from 'react';
import { BellIcon, SearchIcon, MenuIcon } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 glass-strong border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <MenuIcon className="w-5 h-5" />
        </Button>

        <div className="hidden md:flex relative w-64 lg:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sections, tags..."
            className="pl-9 bg-background/50 border-border/50 focus:bg-background" />
          
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-sm border border-border cursor-pointer">
          JD
        </div>
      </div>
    </header>);

}