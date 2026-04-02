import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useUIStore } from '@/store';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const { isDarkMode } = useTheme();

  // Close sidebar on outside click / escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [setSidebarOpen]);

  return (
    <div className={cn('flex h-screen overflow-hidden', isDarkMode ? 'dark' : '')}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 w-60">
        <Sidebar className="w-full" />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden animate-slide-up">
            <Sidebar className="w-full" onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
