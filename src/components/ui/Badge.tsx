import { cn } from '@/utils/cn';
import { CATEGORY_MAP } from '@/constants/categories';
import type { CategoryId, TransactionType } from '@/types';

interface CategoryBadgeProps {
  categoryId: CategoryId;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ categoryId, size = 'sm' }: CategoryBadgeProps) {
  const cat = CATEGORY_MAP[categoryId];
  if (!cat) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', cat.color)} />
      {cat.label}
    </span>
  );
}

interface TypeBadgeProps {
  type: TransactionType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        type === 'income'
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
      )}
    >
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  );
}
