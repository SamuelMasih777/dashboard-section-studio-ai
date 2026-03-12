import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('section-studio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ?
    'dark' :
    'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('section-studio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}