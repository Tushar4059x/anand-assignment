import { useEffect } from 'react';
import { useUIStore } from '@/store';

export function useTheme() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
}
