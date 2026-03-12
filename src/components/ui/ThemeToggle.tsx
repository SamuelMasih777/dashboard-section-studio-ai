import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full">
      
      {theme === 'dark' ?
      <SunIcon className="h-5 w-5" /> :

      <MoonIcon className="h-5 w-5" />
      }
    </Button>);

}