import { Menu, Sun, Moon, Shield, Eye } from 'lucide-react';
import { useUIStore } from '@/store';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export function Header() {
  const activePage = useUIStore((s) => s.activePage);
  const role = useUIStore((s) => s.role);
  const toggleRole = useUIStore((s) => s.toggleRole);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {pageTitles[activePage]}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {activePage === 'dashboard' && 'Your financial overview'}
            {activePage === 'transactions' && 'Manage your transactions'}
            {activePage === 'insights' && 'Analyze your spending patterns'}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Role toggle */}
        <button
          onClick={toggleRole}
          title={`Switch to ${role === 'admin' ? 'viewer' : 'admin'}`}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
            role === 'admin'
              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          )}
        >
          {role === 'admin' ? (
            <>
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Viewer</span>
            </>
          )}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
