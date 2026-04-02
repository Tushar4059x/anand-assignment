import { TopCategoryCard } from '@/components/insights/TopCategoryCard';
import { MonthlyBarChart } from '@/components/insights/MonthlyBarChart';
import { SavingsTrendChart } from '@/components/insights/SavingsTrendChart';
import { Card } from '@/components/ui/Card';
import { useChartData } from '@/hooks/useChartData';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { TrendingUp, AlertCircle, Award } from 'lucide-react';

export function InsightsPage() {
  const {
    summaryMetrics,
    monthlyComparison,
    savingsTrend,
    spendingByCategory,
    topCategory,
    topCategoryPrevAmount,
  } = useChartData();

  const bestMonth = [...savingsTrend].sort((a, b) => b.savingsRate - a.savingsRate)[0];
  const avgSavingsRate =
    savingsTrend.length > 0
      ? savingsTrend.reduce((s, m) => s + m.savingsRate, 0) / savingsTrend.length
      : 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Best Savings Month</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {bestMonth?.month ?? '—'}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                {bestMonth ? formatPercentage(bestMonth.savingsRate) : '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg. Savings Rate</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {formatPercentage(avgSavingsRate)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Over last 6 months</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Current Month Net</p>
              <p className={`text-base font-bold ${summaryMetrics.income - summaryMetrics.expenses >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {formatCurrency(summaryMetrics.income - summaryMetrics.expenses)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {summaryMetrics.income - summaryMetrics.expenses >= 0 ? 'Positive cash flow' : 'Spending over income'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top category + monthly bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopCategoryCard
          topCategory={topCategory}
          prevAmount={topCategoryPrevAmount}
          totalExpenses={summaryMetrics.expenses}
        />
        <div className="lg:col-span-2">
          <MonthlyBarChart data={monthlyComparison} />
        </div>
      </div>

      {/* Savings trend + category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SavingsTrendChart data={savingsTrend} />

        {/* Category spending table */}
        <Card padding="md">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Category Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Current month spending</p>
          </div>
          {spendingByCategory.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">No expense data.</p>
          ) : (
            <div className="space-y-3">
              {spendingByCategory.slice(0, 8).map((item) => {
                const total = spendingByCategory.reduce((s, i) => s + i.value, 0);
                const pct = total > 0 ? (item.value / total) * 100 : 0;
                return (
                  <div key={item.categoryId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatPercentage(pct, 0)}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 w-16 text-right">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: item.hex }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
