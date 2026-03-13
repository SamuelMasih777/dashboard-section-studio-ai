import { useState, useRef, useEffect } from 'react';
import { BellIcon, SearchIcon, MenuIcon, User as UserIcon, LogOut as LogOutIcon, ChevronDown } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ThemeToggle } from './ui/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-sm border border-border shadow-sm">
              {user?.initials || 'JD'}
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
              <div className="px-4 py-3 border-b border-border/50 mb-1 bg-muted/30">
                <p className="text-sm font-semibold truncate">{user?.name || 'John Doe'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
              </div>
              
              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>My Account</span>
              </button>
              
              <div className="h-px bg-border/50 my-1" />
              
              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left text-destructive"
                onClick={logout}
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}