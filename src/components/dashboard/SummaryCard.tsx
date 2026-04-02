import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { cn } from '@/utils/cn';

type CardVariant = 'balance' | 'income' | 'expense' | 'savings';

const variantConfig: Record<
  CardVariant,
  { ringColor: string; iconBg: string; iconColor: string }
> = {
  balance: {
    ringColor: 'ring-brand-100 dark:ring-brand-900/30',
    iconBg: 'bg-brand-50 dark:bg-brand-900/20',
    iconColor: 'text-brand-500 dark:text-brand-400',
  },
  income: {
    ringColor: 'ring-emerald-100 dark:ring-emerald-900/30',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  expense: {
    ringColor: 'ring-rose-100 dark:ring-rose-900/30',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-500 dark:text-rose-400',
  },
  savings: {
    ringColor: 'ring-amber-100 dark:ring-amber-900/30',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
};

interface SummaryCardProps {
  title: string;
  value: number;
  delta?: number;
  icon: LucideIcon;
  variant: CardVariant;
  isCurrency?: boolean;
  isPercentage?: boolean;
  subtitle?: string;
}

export function SummaryCard({
  title,
  value,
  delta,
  icon: Icon,
  variant,
  isCurrency = true,
  isPercentage = false,
  subtitle,
}: SummaryCardProps) {
  const config = variantConfig[variant];
  const isPositiveDelta = (delta ?? 0) >= 0;
  const isExpenseCard = variant === 'expense';
  const deltaGood = isExpenseCard ? !isPositiveDelta : isPositiveDelta;

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center ring-1',
            config.iconBg,
            config.ringColor
          )}
        >
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {isCurrency && !isPercentage && '$'}
          <AnimatedNumber
            value={value}
            decimals={isPercentage ? 1 : 2}
            suffix={isPercentage ? '%' : ''}
          />
        </p>

        {delta !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
              deltaGood
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400'
            )}
          >
            {deltaGood ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </div>
        )}
      </div>
    </Card>
  );
}
