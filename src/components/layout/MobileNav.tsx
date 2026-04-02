import { LayoutDashboard, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store';

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions' as const, label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights' as const, label: 'Insights', icon: TrendingUp },
];

export function MobileNav() {
  const activePage = useUIStore((s) => s.activePage);
  const setActivePage = useUIStore((s) => s.setActivePage);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex safe-bottom">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors',
              isActive
                ? 'text-brand-500 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
