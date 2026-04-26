'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function ThemeProvider({ children }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root    = document.documentElement;
    const mediaq  = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = (sysDark) => {
      const shouldDark =
        theme === 'dark' || (theme === 'system' && sysDark);
      root.classList.toggle('dark', shouldDark);
    };

    // Apply immediately
    apply(mediaq.matches);

    // Keep in sync with system changes (only matters when theme === 'system')
    const handler = (e) => apply(e.matches);
    mediaq.addEventListener('change', handler);
    return () => mediaq.removeEventListener('change', handler);
  }, [theme]);

  return <>{children}</>;
}
