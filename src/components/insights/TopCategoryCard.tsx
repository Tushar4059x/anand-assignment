import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { CATEGORY_MAP } from '@/constants/categories';
import { cn } from '@/utils/cn';
import type { CategorySpend } from '@/utils/calculations';

interface TopCategoryCardProps {
  topCategory: CategorySpend | null;
  prevAmount: number;
  totalExpenses: number;
}

export function TopCategoryCard({ topCategory, prevAmount, totalExpenses }: TopCategoryCardProps) {
  if (!topCategory) {
    return (
      <Card>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Top Spending Category</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">No expense data this month.</p>
      </Card>
    );
  }

  const cat = CATEGORY_MAP[topCategory.categoryId];
  const pct = totalExpenses > 0 ? (topCategory.value / totalExpenses) * 100 : 0;
  const delta = topCategory.value - prevAmount;
  const deltaDir = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Spending Category</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Current month</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: (cat?.hex ?? '#a1a1aa') + '20' }}
        >
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: cat?.hex ?? '#a1a1aa' }}
          />
        </div>
      </div>

      <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        {topCategory.name}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        {formatCurrency(topCategory.value)}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>{pct.toFixed(1)}% of total expenses</span>
          <span>{formatCurrency(totalExpenses)} total</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: cat?.hex ?? '#a1a1aa' }}
          />
        </div>
      </div>

      {/* Delta vs prev month */}
      <div className={cn(
        'flex items-center gap-1.5 text-xs font-medium',
        deltaDir === 'up' ? 'text-rose-500 dark:text-rose-400' : deltaDir === 'down' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
      )}>
        {deltaDir === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
        {deltaDir === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
        {deltaDir === 'flat' && <Minus className="w-3.5 h-3.5" />}
        {deltaDir === 'flat'
          ? 'Same as last month'
          : `${formatCurrency(Math.abs(delta))} ${deltaDir === 'up' ? 'more' : 'less'} than last month`}
      </div>
    </Card>
  );
}
