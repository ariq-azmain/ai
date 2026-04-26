'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

/* ─────────────────────────────────────────────────────────────
   ThemeProvider
   Reads theme from Zustand store and applies the 'dark' class
   to <html>. Also listens to system preference changes.
───────────────────────────────────────────────────────────── */
export default function ThemeProvider({ children }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (prefersDark) => {
      //  || (theme === 'system' && prefersDark)
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mediaQuery.matches);

    // Listen for system theme changes
    const handler = (e) => {
      if (theme === 'system') applyTheme(e.matches);
    };
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return <>{children}</>;
}
