import { LayoutDashboard, ArrowLeftRight, TrendingUp, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store';

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions' as const, label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights' as const, label: 'Insights', icon: TrendingUp },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const activePage = useUIStore((s) => s.activePage);
  const setActivePage = useUIStore((s) => s.setActivePage);
  const role = useUIStore((s) => s.role);

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-700">
        <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          FinanceIQ
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Navigation
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => {
                setActivePage(id);
                onClose?.();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  isActive ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Role badge */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
              role === 'admin' ? 'bg-brand-500' : 'bg-slate-400'
            )}
          >
            {role === 'admin' ? 'A' : 'V'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
              {role === 'admin' ? 'Administrator' : 'Viewer'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {role === 'admin' ? 'Full access' : 'Read only'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
